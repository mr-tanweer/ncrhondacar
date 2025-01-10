import Image from "next/image";

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>Delhi NCR Webhook </h1>
        <p>version v1</p>
        <p>
        https://webhook-ncr.vercel.app
        </p>
      </header>
      <section className="api-section">
        <h2>Api Working...</h2>
        <p>Form Submit</p>
        <div className="api-endpoints">
          <div className="endpoint">
            <span className="endpoint-path">/api/webhook</span>
          
            <button className="post-btn">POST</button>
          </div>
       
        </div>
      </section>
    </div>
  );
}
