import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash'];

function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('Missing GEMINI_API_KEY on server');
  }
  return new GoogleGenerativeAI(key);
}

function mapGeminiError(err) {
  const message = err?.message || 'Gemini request failed';
  if (message.includes('429') || message.toLowerCase().includes('quota')) {
    return 'Gemini quota exceeded (429). Please update billing/quota.';
  }
  if (message.includes('401') || message.includes('403')) {
    return 'Gemini authentication failed. Check GEMINI_API_KEY.';
  }
  return message;
}

export async function generateText({ systemPrompt, userPrompt }) {
  const client = getGeminiClient();
  let lastError = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });
      const result = await model.generateContent(userPrompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      if (err?.message?.includes('429')) continue;
    }
  }

  throw new Error(mapGeminiError(lastError));
}

export async function generateWithImage({ systemPrompt, textPrompt, imageData }) {
  const client = getGeminiClient();
  let lastError = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = client.getGenerativeModel({
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
      lastError = err;
      if (err?.message?.includes('429')) continue;
    }
  }

  throw new Error(mapGeminiError(lastError));
}
