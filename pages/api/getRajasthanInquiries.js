import dbConnect from '../../utils/dbConnect';
import RajasthanEnquiry from '../../model/RajasthanEnquiry';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // ✅ Allowed origin
  const allowedOrigin = 'http://127.0.0.1:5500';

  // 🛑 Check Origin or Referer
  const origin = req.headers.origin || req.headers.referer;

  if (!origin || !origin.startsWith(allowedOrigin)) {
    return res.status(403).json({ error: 'Access denied. Unauthorized domain.' });
  }

  // ✅ Allow only GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    // ✅ Connect to MongoDB
    await dbConnect();

    // ✅ Fetch Rajasthan inquiries sorted by latest createdAt
    const inquiries = await RajasthanEnquiry.find().sort({ createdAt: -1 });

    // ✅ Return data
    return res.status(200).json({ success: true, data: inquiries });
  } catch (err) {
    console.error('Error fetching Rajasthan inquiries:', err);
    return res.status(500).json({ error: 'Error fetching inquiries.' });
  }
}