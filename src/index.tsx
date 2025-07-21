import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./sidebar";
import LandingPage from "./LandingPage";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsPolicy from "./TermsPolicy";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsPolicy />} />
        <Route path="/sidebar" element={<Sidebar />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
