const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "build", "sidebar.html");
const target = path.join(__dirname, "extension", "sidebar.html");

fs.copyFile(source, target, (err) => {
  if (err) return console.error("❌ Failed to copy sidebar.html:", err);
  console.log("✅ sidebar.html copied to extension/");
});
