import dbConnect from '../../utils/dbConnect';
import DelhiNcrEnquiry from '../../model/Delhincrenquiry';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Allow only GET requests
    // ✅ Allow only specific domain
    const allowedOrigin = 'https://kliadvt.com';
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
    // Connect to MongoDB
    await dbConnect();

    // Fetch all Delhi NCR inquiries from the database
    const inquiries = await DelhiNcrEnquiry.find().sort({ createdAt: -1 });

    // Return the data
    return res.status(200).json({ success: true, data: inquiries });
  } catch (err) {
    console.error('Error fetching Delhi NCR inquiries:', err);
    return res.status(500).json({ error: 'Error fetching inquiries.' });
  }
}
