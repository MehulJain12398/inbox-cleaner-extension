const fs = require("fs");
const path = require("path");

// Paths
const buildDir = path.resolve(__dirname, "build");
const extensionDir = path.resolve(__dirname, "extension");

const sidebarHtmlPath = path.join(buildDir, "index.html");
const outputSidebarPath = path.join(extensionDir, "sidebar.html");
const staticDir = path.join(buildDir, "static");

// 🧹 Clean old JS/CSS from extension/
const existingFiles = fs.readdirSync(extensionDir);
for (const file of existingFiles) {
  if (/^sidebar\..*\.(js|css|map)$/.test(file)) {
    fs.unlinkSync(path.join(extensionDir, file));
  }
}

// 🚚 Copy static files (JS/CSS) to extension/
if (fs.existsSync(staticDir)) {
  const copyRecursive = (srcDir, destDir) => {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  copyRecursive(staticDir, extensionDir);
}

// 🧾 Patch and copy sidebar.html
let html = fs.readFileSync(sidebarHtmlPath, "utf-8");
html = html.replace(/"\/static\//g, '"static/');
fs.writeFileSync(outputSidebarPath, html);

console.log("✅ Cleaned old files, copied new build, and updated sidebar.html");
