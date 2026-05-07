import { generateText } from './_gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { systemPrompt, userPrompt } = req.body || {};
    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ error: 'Missing required prompt fields' });
    }

    const text = await generateText({ systemPrompt, userPrompt });
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'AI request failed' });
  }
}
