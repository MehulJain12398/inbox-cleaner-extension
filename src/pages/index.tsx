// If using React, for example in /src/pages/index.tsx

import React from "react";

export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>📬 Inbox Cleaner AI</h1>
      <p>
        Inbox Cleaner AI is a browser extension that connects with Gmail to help users
        automatically categorize, clean, and summarize their inbox using AI.
      </p>
      <ul>
        <li>🔄 Categorize emails into Jobs, Promotions, Newsletters, etc.</li>
        <li>🧹 Delete old/unwanted emails in bulk</li>
        <li>🧠 AI-powered summaries and reply suggestions (Pro plan)</li>
      </ul>
      <p>This tool is intended for personal and professional Gmail users who want to better manage inbox clutter.</p>

      <hr style={{ margin: "2rem 0" }} />

      <p>
        📜 <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a> |{" "}
        📃 <a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a>
      </p>
    </div>
  );
}
