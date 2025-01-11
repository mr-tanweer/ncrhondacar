import nodemailer from 'nodemailer';

// Optional: Disable Next.js default body parser settings if needed
export const config = {
  api: {
    bodyParser: true, 
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
    const { name, email, mobile, model, outlet } = req.body;

    // 2. Basic validation
    if (!name || !email || !mobile || !model || !outlet) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // 3. Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    // 4. Define the email options
    let mailOptions = {
      from: process.env.EMAIL_USER,     
      to: 'kli.advertising@gmail.com',  
      subject: `Honda Car Rajasthan Inquiry from ${name}`,
      text: `
        New inquiry received!

        Name: ${name}
        Email: ${email}
        Mobile: ${mobile}
        Model: ${model}
        Outlet: ${outlet}
       
      `,
      replyTo: email 
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
