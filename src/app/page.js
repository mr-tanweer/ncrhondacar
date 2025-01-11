"use client";
import { useState } from "react";

export default function Home() {
  const [showAPIs, setShowAPIs] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const correctPassword = "kli123"; // Set your password here

  const handleShowAPIs = () => {
    if (password === correctPassword) {
      setShowAPIs(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Delhi NCR & Rajasthan API Documentation</h1>
        <p>Version v1</p>
        <p>https://webhook-ncr.vercel.app</p>
      </header>

      <section className="api-section">
        <h2>API Endpoints</h2>
        <p>Form Submit and Fetch Inquiries</p>

        {!showAPIs ? (
          <div className="password-section">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            <button onClick={handleShowAPIs} className="show-btn">
              Show APIs
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        ) : (
          <div className="api-endpoints">
            {/* Delhi NCR Inquiry APIs */}
            <div className="endpoint">
              <span className="endpoint-path">/api/delhiInquiry</span>
              <button className="post-btn">POST</button>
            </div>
            <div className="endpoint">
              <span className="endpoint-path">/api/getDelhiInquiries</span>
              <button className="get-btn">GET</button>
            </div>

            {/* Rajasthan Inquiry APIs */}
            <div className="endpoint">
              <span className="endpoint-path">/api/rajasthanInquiry</span>
              <button className="post-btn">POST</button>
            </div>
            <div className="endpoint">
              <span className="endpoint-path">/api/getRajasthanInquiries</span>
              <button className="get-btn">GET</button>
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
          text-align: center;
        }

        .header {
          margin-bottom: 40px;
        }

        .password-section {
          margin-top: 20px;
        }

        .password-input {
          padding: 10px;
          width: 200px;
          margin-right: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .show-btn {
          padding: 10px 20px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .show-btn:hover {
          background-color: #005bb5;
        }

        .api-endpoints {
          margin-top: 20px;
        }

        .endpoint {
          margin: 10px 0;
        }

        .endpoint-path {
          font-weight: bold;
        }

        .post-btn,
        .get-btn {
          margin-left: 10px;
          padding: 5px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .post-btn {
          background-color: #28a745;
          color: white;
        }

        .get-btn {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
}
