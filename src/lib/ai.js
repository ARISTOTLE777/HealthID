import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// API Keys
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Check which providers are available
const hasGemini = GEMINI_KEY && GEMINI_KEY !== 'your_gemini_key_here';
const hasClaude = ANTHROPIC_KEY && ANTHROPIC_KEY !== 'your_key_here';

// Gemini client
let genAI = null;
if (hasGemini) {
  genAI = new GoogleGenerativeAI(GEMINI_KEY);
}

// Model preference order — flash-lite has a more generous free-tier quota
const GEMINI_MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];

// ── Retry helper ──────────────────────────────────────

async function withRetry(fn, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err?.message?.includes('429') || err?.status === 429;
      if (is429 && attempt < maxRetries) {
        // Extract retry delay from error if available, otherwise use exponential backoff
        const retryMatch = err.message?.match(/retry in (\d+)/i);
        const waitSec = retryMatch ? Math.min(parseInt(retryMatch[1]), 10) : (attempt + 1) * 3;
        console.warn(`Rate limited. Retrying in ${waitSec}s (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
        continue;
      }
      throw err;
    }
  }
}

// ── Gemini calls ──────────────────────────────────────

async function callGemini(systemPrompt, userPrompt) {
  let lastErr = null;
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });
      const result = await model.generateContent(userPrompt);
      return result.response.text();
    } catch (err) {
      console.warn(`Gemini ${modelName} failed:`, err.message?.substring(0, 120));
      lastErr = err;
      // If it's a quota error, try the next model
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        continue;
      }
      // For non-quota errors, throw immediately
      throw err;
    }
  }
  throw lastErr;
}

async function callGeminiWithImage(systemPrompt, textPrompt, imageData) {
  let lastErr = null;
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });
      const imagePart = {
        inlineData: {
          data: imageData.base64,
          mimeType: imageData.mediaType,
        },
      };
      const result = await model.generateContent([textPrompt, imagePart]);
      return result.response.text();
    } catch (err) {
      console.warn(`Gemini ${modelName} vision failed:`, err.message?.substring(0, 120));
      lastErr = err;
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

// ── Claude calls ──────────────────────────────────────

async function callClaudeAPI(systemPrompt, userPrompt) {
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    }
  );
  return response.data.content[0].text;
}

async function callClaudeWithImageAPI(systemPrompt, textPrompt, imageData) {
  const content = [];
  if (imageData) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: imageData.mediaType, data: imageData.base64 },
    });
  }
  content.push({ type: 'text', text: textPrompt });
  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    }
  );
  return response.data.content[0].text;
}

// ── Unified interface (tries Gemini → Claude → throws) ──

export async function callAI(systemPrompt, userPrompt) {
  if (hasGemini) {
    try {
      return await withRetry(() => callGemini(systemPrompt, userPrompt));
    } catch (err) {
      console.warn('All Gemini models failed, trying Claude:', err.message?.substring(0, 100));
    }
  }
  if (hasClaude) {
    try {
      return await callClaudeAPI(systemPrompt, userPrompt);
    } catch (err) {
      console.warn('Claude failed:', err.message);
    }
  }
  throw new Error('No AI provider available. Please set VITE_GEMINI_API_KEY or VITE_ANTHROPIC_API_KEY in your .env file.');
}

export async function callAIWithImage(systemPrompt, textPrompt, imageData) {
  if (hasGemini) {
    try {
      return await withRetry(() => callGeminiWithImage(systemPrompt, textPrompt, imageData));
    } catch (err) {
      console.warn('All Gemini vision models failed, trying Claude:', err.message?.substring(0, 100));
    }
  }
  if (hasClaude) {
    try {
      return await callClaudeWithImageAPI(systemPrompt, textPrompt, imageData);
    } catch (err) {
      console.warn('Claude vision failed:', err.message);
    }
  }
  throw new Error('No AI provider available for image analysis.');
}

// ── Provider status (for UI feedback) ──

export function getAIProvider() {
  if (hasGemini) return 'Gemini';
  if (hasClaude) return 'Claude';
  return null;
}

// ── System prompts ──

export const SYSTEM_PROMPTS = {
  symptomChecker: 'You are HealthID, a medical literacy assistant for patients in India. Your job is to help patients understand which specialist to see based on their symptoms. You do NOT diagnose conditions. Always recommend professional consultation. Be specific to their symptoms, not generic. Respond in clear, empathetic language.',
  checklist: 'You are HealthID, a medical literacy assistant for patients in India. Help patients prepare for their doctor visit by generating a personalised checklist of questions specific to their condition and urgency level. Every question must be directly relevant to what the patient described.',
  prescriptionDecoder: 'You are HealthID, a medical literacy assistant for patients in India. Help patients understand their specific prescription in simple language. For each medicine mentioned, explain what it does, why it was likely prescribed for their condition, correct dosage and timing, side effects, and warnings. Be specific to the actual medicines listed.',
  billBreakdown: 'You are HealthID, a medical literacy assistant for patients in India. Help patients understand and question their specific medical bill. Analyse each charge individually, flag anything that seems unreasonable, and provide specific questions to ask.',
};

// ── Prompt builders ──

export function buildSymptomPrompt(urgency, symptoms) {
  return `Patient urgency level: ${urgency}.

Symptoms described by patient: "${symptoms}"

Based on these SPECIFIC symptoms, provide:
1. The exact specialist type they should see and WHY based on their symptoms
2. What to tell the receptionist when booking (specific to their symptoms)
3. What documents and information to bring to the appointment
4. Red flags specific to their symptoms that require immediate emergency care
5. What they must NOT do (no self-medication, no ignoring worsening symptoms)

If urgency is Emergency, begin with a bold emergency care recommendation.
Be specific to the symptoms described. Do not give generic advice.`;
}

export function buildChecklistPrompt(urgency, condition) {
  return `Patient urgency level: ${urgency}.

Patient's condition and reason for visit: "${condition}"

Generate exactly 10 numbered questions this specific patient should ask their doctor. Each question must be directly relevant to the condition described above. Cover:
1. Understanding what exactly is wrong (specific to their condition)
2. All treatment options for their specific condition
3. Expected duration of treatment
4. Side effects of likely medications for this condition
5. Lifestyle and dietary changes specific to their condition
6. When to schedule a follow-up
7. Warning signs specific to their condition that need immediate attention
8. Whether a second opinion would be advisable for this case
9. Estimated cost of treatment for this condition
10. What happens if this specific condition is left untreated

Write each question in first person, as if the patient is asking. Make them assertive and specific.`;
}

export function buildPrescriptionPrompt(prescription) {
  return `Prescription details: "${prescription}"

For EACH medicine listed above, provide:

**[Medicine Name]**
- What it is: Simple explanation of the drug class and mechanism
- Why prescribed: Why this specific medicine was likely prescribed
- How to take: Exact timing, with/without food, spacing between doses
- Side effects: Common ones to watch for
- Warnings: Important interactions or contraindications

After all medicines, provide:
- A "Tips" section with practical advice specific to this prescription combination
- End with: "This explanation is for understanding only. Always follow your doctor's specific instructions and never change your dose without consulting them."`;
}

export function buildBillPrompt(bill) {
  return `Medical bill details: "${bill}"

Analyse EACH charge listed above:

For each line item, format as:
**[Charge Name]**
- What it is: Plain language explanation of this charge
- Is it reasonable: Whether this amount is standard for Indian healthcare
- Should you question it: Specific reason if yes

After all items, provide:
1. Summary of what the total bill covers
2. List of specific charges to question with exact questions to ask
3. Advice on requesting itemised receipts and comparing with government rate cards`;
}
