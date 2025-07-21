// src/TermsPolicy.tsx
import React from "react";

const TermsPolicy = () => {
  return (
    <div style={styles.container}>
      <h1>Terms of Service</h1>
      <p>Effective Date: July 21, 2025</p>
      <p>
        By using Inbox Cleaner AI, you agree to use the extension in accordance with applicable laws
        and not for spamming, scraping, or unauthorized data collection.
      </p>
      <p>
        We are not responsible for any data loss or third-party services’ downtime
        including Gmail, Google APIs, or OpenAI/Gemini services.
      </p>
      <p>
        The service is provided “as is” without warranty. Your use of the extension and its
        AI features constitutes agreement to these terms.
      </p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "sans-serif",
    maxWidth: "800px",
    margin: "50px auto",
    padding: "2rem",
    lineHeight: "1.6",
  },
};

export default TermsPolicy;
