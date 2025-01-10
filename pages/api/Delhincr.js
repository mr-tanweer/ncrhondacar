// pages/api/sendMail.js
import nodemailer from 'nodemailer';

// Optional: Disable Next.js default body parser settings if needed
export const config = {
  api: {
    bodyParser: true, // Using default body parser for JSON
  },
};

export default async function handler(req, res) {
  // ===== Enable CORS Headers =====
  res.setHeader('Access-Control-Allow-Origin', '*');  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // =================================

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // 1. Extract form data from the request body
    const { name, email, mobile, model, outlet, dealer } = req.body;

    // 2. Basic validation
    if (!name || !email || !mobile || !model || !outlet || !dealer) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // 3. Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g. "your@gmail.com"
        pass: process.env.EMAIL_PASS  // e.g. "abcd1234" or an App Password if 2FA is on
      }
    });

    // 4. Define the email options
    let mailOptions = {
      from: process.env.EMAIL_USER,      // The "From" email (best if domain-based)
      to: 'tanweer2002.nice@gmail.com',  // Where you want to receive the inquiry
      subject: `Honda Car NCR Inquiry from ${name}`,
      text: `
        New inquiry received!

        Name: ${name}
        Email: ${email}
        Mobile: ${mobile}
        Model: ${model}
        Outlet: ${outlet}
        Dealer: ${dealer}
      `,
      replyTo: email // so you can reply directly to the user
    };

    // 5. Send the email
    await transporter.sendMail(mailOptions);

    // 6. Return success response
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: 'Error sending email.' });
  }
}
