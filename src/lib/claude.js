import axios from 'axios';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export async function callClaude(systemPrompt, userPrompt) {
  try {
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
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      }
    );
    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

export async function callClaudeWithImage(systemPrompt, textPrompt, imageData) {
  try {
    const content = [];
    if (imageData) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: imageData.mediaType,
          data: imageData.base64,
        },
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
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      }
    );
    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude Vision API error:', error);
    throw error;
  }
}

export const SYSTEM_PROMPTS = {
  symptomChecker: 'You are HealthID, a medical literacy assistant for patients in India. Your job is to help patients understand which specialist to see, not to diagnose them. Always recommend professional consultation.',
  checklist: 'You are HealthID, a medical literacy assistant for patients in India. Help patients prepare for their doctor visit by generating a personalised checklist of questions to ask.',
  prescriptionDecoder: 'You are HealthID, a medical literacy assistant for patients in India. Help patients understand their prescription in simple language.',
  billBreakdown: 'You are HealthID, a medical literacy assistant for patients in India. Help patients understand and question their medical bills.',
};

export function buildSymptomPrompt(urgency, symptoms) {
  return `Patient urgency level: ${urgency}. Symptoms described: ${symptoms}. Provide: 1. The exact specialist they should see and a clear reason why. 2. What to say when booking the appointment. 3. What information and documents to bring. 4. Red flags that require emergency care immediately. 5. What they must not do — no self-medication, no Google diagnosis. If urgency is Emergency, begin your response with a bold recommendation to seek emergency care before anything else. Write in simple, empathetic language.`;
}

export function buildChecklistPrompt(urgency, condition) {
  return `Patient urgency level: ${urgency}. Condition: ${condition}. Generate exactly 10 numbered questions the patient should ask their doctor. Cover: understanding the diagnosis, all treatment options available, how long treatment will take, side effects of any medicines, lifestyle changes needed, when to follow up, warning signs to go back immediately, whether a second opinion is advisable, estimated cost of treatment, and what happens if left untreated. Write in simple, assertive, first-person language — the patient should feel empowered to ask these.`;
}

export function buildPrescriptionPrompt(prescription) {
  return `Prescription: ${prescription}. For each medicine: explain what it is and what it does in the body, why it is likely prescribed, how to take it correctly including timing and food interaction, common side effects to watch for, and any important warnings. Use very simple language. No medical jargon. After all medicines, add a tips section: complete the full course, never share medicines, store correctly, and contact your doctor if you experience any severe side effect. End with this exact disclaimer: This explanation is for understanding only. Always follow your doctor's specific instructions and never change your dose without consulting them.`;
}

export function buildBillPrompt(bill) {
  return `Medical bill: ${bill}. For each line item: explain what this charge is for in plain language, state whether it is standard and reasonable or seems high, and flag any item the patient should question. Format each item with its name as a heading followed by three labelled sections: What it is, Is it reasonable, and Should you question it. After all items provide: a summary of what the bill covers, a list of flagged charges with specific questions to ask the billing department, and advice on always requesting itemised receipts going forward.`;
}
