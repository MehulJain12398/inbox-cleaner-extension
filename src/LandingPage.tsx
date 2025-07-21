// src/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <h1>📬 InboxSweep AI</h1>
      <p>Your smart email assistant to declutter your inbox with one click.</p>
      <p>
        <Link to="/privacy" style={styles.link}>Privacy Policy</Link> |{" "}
        <Link to="/terms" style={styles.link}>Terms of Service</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "sans-serif",
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center" as const,
    padding: "2rem",
    lineHeight: "1.6",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default LandingPage;
