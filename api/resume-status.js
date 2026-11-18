
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const host = process.env.VERCEL_URL || req.headers.host;

    const response = await fetch(
      `https://${host}/resume.pdf`,
      { method: 'HEAD' }
    );

    const contentType =
      response.headers.get('content-type') || '';

    const available =
      response.ok &&
      contentType.toLowerCase().includes('application/pdf');

    return res.status(200).json({ available });
  } catch (error) {
    console.error('Resume status:', error);

    return res.status(200).json({
      available: false
    });
  }
}
