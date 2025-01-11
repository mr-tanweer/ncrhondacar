import dbConnect from '../../utils/dbConnect';
import RajasthanEnquiry from '../../model/RajasthanEnquiry';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // ✅ Allow only specific domain
  const allowedOrigin = 'http://127.0.0.1:5500';
  const origin = req.headers.origin;

  if (origin !== allowedOrigin) {
    return res.status(403).json({ error: 'Access denied. Unauthorized domain.' });
  }

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    await dbConnect();
    const inquiries = await RajasthanEnquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: inquiries });
  } catch (err) {
    console.error('Error fetching Rajasthan inquiries:', err);
    return res.status(500).json({ error: 'Error fetching inquiries.' });
  }
}