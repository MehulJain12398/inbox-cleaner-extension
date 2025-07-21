import React from "react";

const PrivacyPolicy = () => (
  <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    <h1>Privacy Policy</h1>
    <p>This Chrome Extension only accesses Gmail data after you grant permission.</p>
    <p>
      We use OAuth to securely connect your Gmail account. Your email metadata is used to
      categorize, summarize, and clean your inbox.
    </p>
    <p>No email content is stored on our servers. All processing is client-side unless explicitly shared by the user.</p>
  </div>
);

export default PrivacyPolicy;


