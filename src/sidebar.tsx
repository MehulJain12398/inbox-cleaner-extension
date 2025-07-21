import React, { useEffect, useMemo, useState } from "react";

// Declare chrome globally for TypeScript
import { mockEmails } from "./mockEmails";
import { fetchEmailMetadata } from "./utils";

declare const chrome: any;

type EmailItem = {
  id: string;
  subject: string;
  sender: string;
  date: string;
  type: string;
  snippet?: string;
  from?: string;
  labelIds?: string[];
};

const CATEGORIES = ["All", "Jobs", "Social", "Promotions", "Newsletters", "Updates", "Old", "AI Suggestions"];

const categorizeEmail = (email: EmailItem): string => {
  const subject = email.subject?.toLowerCase() || "";
  const from = email.sender?.toLowerCase() || "";

  if (from.includes("glassdoor") || subject.includes("job")) return "Jobs";
  if (from.includes("linkedin") || subject.includes("connection")) return "Social";
  if (email.labelIds?.includes("CATEGORY_PROMOTIONS")) return "Promotions";
  if (email.labelIds?.includes("CATEGORY_UPDATES")) return "Updates";
  if (from.includes("newsletter")) return "Newsletters";
  if (new Date(email.date) < new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)) return "Old";

  return "AI Suggestions";
};


const Sidebar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState("All");
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [emails, setEmails] = useState<EmailItem[]>([]);

  const filteredEmails = useMemo(() => {
    if (selectedTab === "All") return emails;
    return emails.filter(email => categorizeEmail(email) === selectedTab);
  }, [emails, selectedTab]);

  const toggleEmail = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const selectAllInView = () => {
    const ids = filteredEmails.map(e => e.id);
    setSelected(new Set(ids));
  };

  const handleDelete = async () => {
    let token = localStorage.getItem("gmailAccessToken");

    if (!token) {
      alert("Please connect to Gmail first.");
      return;
    }

    const confirmed = window.confirm(`Delete ${selected.size} emails?`);
    if (!confirmed) return;

    const tryDelete = async (currentToken: string) => {
      const failedIds: string[] = [];

      for (const id of Array.from(selected)) {
        const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        if (res.status === 403) failedIds.push(id);
      }

      return failedIds;
    };

    let failed = await tryDelete(token);

    if (failed.length > 0) {
      console.warn("Token might lack delete scope. Reauthenticating...");

      chrome.runtime.sendMessage({ type: "LOGIN_WITH_GOOGLE", scope: "https://www.googleapis.com/auth/gmail.modify" }, async (response: any) => {
        if (response?.token) {
          token = response.token;
          if (token) {
            localStorage.setItem("gmailAccessToken", token);
            const stillFailed = await tryDelete(token);

            if (stillFailed.length === 0) {
              alert(`${selected.size} emails deleted!`);
              setEmails((prev) => prev.filter((email) => !selected.has(email.id)));
              setSelected(new Set());
            } else {
              alert(`Some emails could not be deleted.`);
            }
          } else {
            console.error("Token is null and cannot be used.");
          }
        } else {
          alert("Failed to get permissions to delete emails.");
        }
      });
    } else {
      alert(`${selected.size} emails deleted!`);
      setEmails((prev) => prev.filter((email) => !selected.has(email.id)));
      setSelected(new Set());
    }
  };

  const connectToGmail = () => {
    const storedToken = localStorage.getItem("gmailAccessToken");

    const fetchAndSetEmails = async (token: string) => {
      const profileRes = await fetch("https://www.googleapis.com/gmail/v1/users/me/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = await profileRes.json();
      alert(`Hello ${profile.emailAddress}`);

      const messageRes = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const messageData = await messageRes.json();
      const ids = messageData.messages.map((msg: any) => msg.id);
      const enriched = await fetchEmailMetadata(token, ids);
      const categorized = enriched.map(email => ({
        ...email,
        type: categorizeEmail(email),
      }));
      setEmails(categorized);
    };

    if (!storedToken) {
      chrome.runtime.sendMessage({ type: "LOGIN_WITH_GOOGLE" }, async (response: any) => {
        if (response?.token) {
          localStorage.setItem("gmailAccessToken", response.token);
          await fetchAndSetEmails(response.token);
        } else {
          console.error("Login failed:", response?.error);
        }
      });
    } else {
      fetchAndSetEmails(storedToken);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("sidebarIsOpen");
    if (saved === "true") setIsOpen(true);
  }, []);
  
  useEffect(() => {
    localStorage.setItem("sidebarIsOpen", String(isOpen));
  }, [isOpen]);


  if (!visible) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "-60px",
          transform: "translateY(-50%)",
          zIndex: 10001,
        }}
      >
        <button
          onClick={() => setVisible(true)}
          style={{
            writingMode: "vertical-rl",
            padding: "6px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px 0 0 8px",
            cursor: "pointer",
          }}
        >
          📬 Open Cleaner
        </button>
      </div>
    );
  }

  const hideSidebar = () => {
    setVisible(false)
    window.parent.postMessage({ type: "HIDE_SIDEBAR" }, "*");
  };

  return (
    <div  style={{
      padding: "1rem",
      fontFamily: "Arial, sans-serif",
    }}>
           {/* 👇 Close Button */}
           <button
        onClick={hideSidebar}
        style={{
          position: "absolute",
          top: "10px",
          left: "-70px",
          background: "#2563eb",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: "8px 0 0 8px",
          cursor: "pointer",
          zIndex: 10001,
        }}
      >
        ← Close
      </button>

      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-360px",
          width: "360px",
          height: "100vh",
          backgroundColor: "#fff",
          boxShadow: "-2px 0 6px rgba(0,0,0,0.1)",
          transition: "right 0.3s ease-in-out",
          zIndex: 9999,
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "1rem" }}>
          <button
            onClick={connectToGmail}
            style={{
              background: "#22c55e",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            📧 Connect to Gmail
          </button>

          <h2>📬 Inbox Cleaner</h2>
          <p>{selected.size} selected</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1rem" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTab(cat)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: cat === selectedTab ? "#1976d2" : "#f3f3f3",
                  color: cat === selectedTab ? "white" : "black",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredEmails.map((email) => (
            <div
              key={email.id}
              style={{
                borderBottom: "1px solid #eee",
                padding: "8px",
                backgroundColor: selected.has(email.id) ? "#e3f2fd" : "white",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={selected.has(email.id)}
                  onChange={() => toggleEmail(email.id)}
                />
                <div>
                  <strong>{email.subject}</strong>
                  <div style={{ fontSize: "0.8rem", color: "#555" }}>{email.sender}</div>
                  <div style={{ fontSize: "0.75rem", color: "#999" }}>{new Date(email.date).toLocaleString()}</div>
                </div>
              </label>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <span>
              Estimated space to free: <strong>{(selected.size * 0.1).toFixed(1)} MB</strong>
            </span>
            {filteredEmails.length > 0 && (
              <button onClick={selectAllInView}>Select All</button>
            )}
          </div>

          <button
            onClick={handleDelete}
            style={{
              marginTop: "1rem",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🗑 Clean Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
