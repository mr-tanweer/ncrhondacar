import nodemailer from "nodemailer";
import { connectToDatabase } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secretKey = process.env.WEBHOOK_SECRET;
  const incomingKey = req.body.google_key; // Extract key from request body

  if (secretKey !== incomingKey) {
    return res.status(401).json({ message: "Unauthorized: Invalid key" });
  }

  try {
    const leadData = req.body; // Dynamic data from Google Ads form
    console.log("Lead Received:", leadData);

    // Step 1: Save to Database
    const db = await connectToDatabase();
    const collection = db.collection("delhileads");
    await collection.insertOne(leadData);

    // Step 2: Send Email Notification
    await sendEmail(leadData);

    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function sendEmail(leadData) {
    const { user_column_data } = leadData;
  
    // Extract specific fields from user_column_data
    const fullName = user_column_data.find(item => item.column_id === "FULL_NAME")?.string_value || "N/A";
    const userPhone = user_column_data.find(item => item.column_id === "PHONE_NUMBER")?.string_value || "N/A";
    const userEmail = user_column_data.find(item => item.column_id === "EMAIL")?.string_value || "N/A";
    const model = user_column_data.find(item => item.column_id === "which_model_are_you_interested_in?")?.string_value || "N/A";
    const dealership = user_column_data.find(item => item.column_id === "what_is_your_preferred_dealership?")?.string_value || "N/A";
  
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            margin: 20px;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
          p {
            font-size: 14px;
            color: #555;
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            color: #222;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Lead Notification</h2>
          <p><span class="label">Full Name:</span> ${fullName}</p>
          <p><span class="label">User Phone:</span> ${userPhone}</p>
          <p><span class="label">User Email:</span> ${userEmail}</p>
          <p><span class="label">Model Interested:</span> ${model}</p>
          <p><span class="label">Preferred Dealership:</span> ${dealership}</p>
        </div>
      </body>
      </html>
    `;
  
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "tanweer2002.nice@gmail.com",
      subject: "New Lead Received",
      html: emailBody, // Use html instead of text
    };
  
    await transporter.sendMail(mailOptions);
  }
  
  