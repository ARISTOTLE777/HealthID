import { generateWithImage } from './_gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { systemPrompt, textPrompt, imageData } = req.body || {};
    if (!systemPrompt || !textPrompt || !imageData?.base64 || !imageData?.mediaType) {
      return res.status(400).json({ error: 'Missing required image analysis fields' });
    }

    const text = await generateWithImage({ systemPrompt, textPrompt, imageData });
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'AI image request failed' });
  }
}
