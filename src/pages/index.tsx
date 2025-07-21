// src/pages/index.tsx (homepage)
import React from "react";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📬 Inbox Cleaner AI</h1>
      <p>Your AI-powered Gmail cleaner to summarize, organize, and delete unwanted emails.</p>
      <p>
        <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms</a>
      </p>
    </main>
  );
}
