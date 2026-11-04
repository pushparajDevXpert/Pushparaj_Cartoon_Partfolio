
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

  return res.status(200).json({
    mode: hasGeminiKey ? 'ai' : 'demo',
    provider: hasGeminiKey ? 'gemini' : 'demo'
  });
}
