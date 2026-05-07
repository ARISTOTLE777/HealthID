async function requestServerAI(endpoint, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `AI request failed (${res.status})`);
  }
  if (!data?.text) {
    throw new Error('AI response was empty');
  }
  return data.text;
}

export async function callAI(systemPrompt, userPrompt) {
  return requestServerAI('/api/ai', { systemPrompt, userPrompt });
}

export async function callAIWithImage(systemPrompt, textPrompt, imageData) {
  return requestServerAI('/api/ai-image', { systemPrompt, textPrompt, imageData });
}

function normalizeText(value) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function isLowQualityResponse(response, minimumLength = 120) {
  const cleaned = normalizeText(response);
  if (!cleaned) return true;
  if (cleaned.length < minimumLength) return true;
  // Very short bullet lists with little context are usually low-value outputs.
  const bulletCount = (response.match(/^\s*[-*]\s+/gm) || []).length;
  return bulletCount > 0 && cleaned.length < minimumLength + 40;
}

function isRelevantResponse(response, relevanceTerms = []) {
  if (!relevanceTerms.length) return true;
  const lower = response.toLowerCase();
  return relevanceTerms.some((term) => lower.includes(term.toLowerCase()));
}

export async function getFeatureAIResponse({
  systemPrompt,
  userPrompt,
  fallbackResponse,
  minimumLength = 120,
  relevanceTerms = [],
  validateResponse = true,
}) {
  try {
    const response = await callAI(systemPrompt, userPrompt);
    if (validateResponse && (isLowQualityResponse(response, minimumLength) || !isRelevantResponse(response, relevanceTerms))) {
      throw new Error('Low-quality or irrelevant AI output');
    }
    return { content: response, source: 'ai' };
  } catch (err) {
    const fallback = typeof fallbackResponse === 'function' ? fallbackResponse() : fallbackResponse;
    return { content: fallback, source: 'fallback', reason: err?.message || 'unknown_error' };
  }
}

export async function getFeatureAIResponseWithImage({
  systemPrompt,
  textPrompt,
  imageData,
  fallbackResponse,
  minimumLength = 140,
  relevanceTerms = [],
  validateResponse = true,
}) {
  try {
    const response = await callAIWithImage(systemPrompt, textPrompt, imageData);
    if (validateResponse && (isLowQualityResponse(response, minimumLength) || !isRelevantResponse(response, relevanceTerms))) {
      throw new Error('Low-quality or irrelevant AI image output');
    }
    return { content: response, source: 'ai' };
  } catch (err) {
    const fallback = typeof fallbackResponse === 'function' ? fallbackResponse() : fallbackResponse;
    return { content: fallback, source: 'fallback', reason: err?.message || 'unknown_error' };
  }
}

// ── Provider status (for UI feedback) ──

export function getAIProvider() {
  return 'Gemini (secure server)';
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
