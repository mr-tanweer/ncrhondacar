
import nodemailer from 'nodemailer';
import dbConnect from '../../utils/dbConnect';
import RajasthanEnquiry from '../../model/RajasthanEnquiry';

// API configuration for body parser
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // Enable CORS for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Extract data from the request body
    const { name, email, mobile, model, outlet } = req.body;

    // Validate the required fields
    if (!name || !email || !mobile || !model || !outlet) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Connect to MongoDB
    await dbConnect();

    // Save the inquiry data to the database
    const newInquiry = new RajasthanEnquiry({
      name,
      email,
      mobile,
      model,
      outlet,
    });

    await newInquiry.save();

    // Set up Nodemailer transporter for sending emails
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email content
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'kli.advertising@gmail.com',
      subject: `Honda Car Rajasthan Inquiry from ${name}`,
      text: `
        New inquiry received:

        Name: ${name}
        Email: ${email}
        Mobile: ${mobile}
        Model: ${model}
        Outlet: ${outlet}
      `,
      replyTo: email,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send success response after saving data and sending the email
    return res.status(200).json({ success: true, message: 'Inquiry saved and email sent successfully!' });

  } catch (err) {
    // Handle any errors during the process
    console.error('Error:', err);
    return res.status(500).json({ error: 'Error processing the inquiry.' });
  }
}
