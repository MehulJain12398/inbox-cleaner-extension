(function injectSidebar() {
  if (document.getElementById("inbox-cleaner-sidebar")) return;

  const div = document.createElement("div");
  div.id = "inbox-cleaner-sidebar";
  div.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 360px;
    height: 100vh;
    z-index: 9999;
    background: white;
    box-shadow: -2px 0 6px rgba(0,0,0,0.1);
  `;

  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("sidebar.html");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  div.appendChild(iframe);
  document.body.appendChild(div);

  // 🧠 Listen for toggle messages
  window.addEventListener("message", (event) => {
    if (event.data?.type === "HIDE_SIDEBAR") {
      div.style.display = "none";
    }
  });
})();

(function injectSummarizeButton() {
  const observer = new MutationObserver(() => {
    const toolbar = document.querySelector('div[role="button"][data-tooltip="Reply"]')?.parentElement;

    if (toolbar && !document.getElementById("summarize-btn")) {
      const button = document.createElement("button");
      button.id = "summarize-btn";
      button.innerText = "✨ Summarize";
      button.style.cssText = `
        background: #f1f3f4;
        border: 1px solid #dadce0;
        border-radius: 16px;
        padding: 4px 10px;
        font-size: 13px;
        cursor: pointer;
        margin-left: 8px;
      `;

      button.onclick = () => {
        const emailBody = document.querySelector(".a3s")?.innerText;
        if (emailBody) {
          console.log("Email content to summarize:", emailBody);
          alert("🚧 Summarization logic goes here.");
        } else {
          alert("Could not read email body.");
        }
      };

      toolbar.appendChild(button);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
