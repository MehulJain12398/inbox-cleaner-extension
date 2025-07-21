// src/PrivacyPolicy.tsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <h1>Privacy Policy</h1>
      <p>Effective Date: July 22, 2025</p>
      <p>
        InboxSweep AI respects your privacy. We do not store or share your email content.
        All data is processed with your consent and only for features you explicitly request.
      </p>
      <p>
        We use Google OAuth only to access the minimal email metadata required for
        categorization and summarization. We do not store your access tokens or personal data on our servers.
      </p>
      <p>
        If you have any questions or concerns, please contact us at:{" "}
        <a href="mailto:mehuljain1203@gmail.com">mehuljain1203@gmail.com</a>
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

export default PrivacyPolicy;
