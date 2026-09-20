import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlFile = 'file:///' + path.resolve('scripts/render_icons.html').replace(/\\/g, '/');
const resRoot = path.resolve('android/app/src/main/res');

console.log('Running headless Chrome to render pixel-perfect icons from HTML5 Canvas...');

const cmd = `"${chromePath}" --headless=new --disable-gpu --dump-dom "${htmlFile}"`;
const htmlOutput = execSync(cmd, { maxBuffer: 50 * 1024 * 1024 }).toString();

const match = htmlOutput.match(/<pre id="json-data">([\s\S]*?)<\/pre>/);
if (!match) {
  console.error('Failed to extract json-data from Chrome output!');
  process.exit(1);
}

const iconsData = JSON.parse(match[1]);

for (const [relPath, dataUrl] of Object.entries(iconsData)) {
  const targetPath = path.join(resRoot, relPath);
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
  console.log(`✓ Saved ${relPath} (${fs.statSync(targetPath).size} bytes)`);
}

// Write Android 8+ Adaptive Icon XMLs in mipmap-anydpi-v26
const anyDpiDir = path.join(resRoot, 'mipmap-anydpi-v26');
if (!fs.existsSync(anyDpiDir)) {
  fs.mkdirSync(anyDpiDir, { recursive: true });
}

const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;

fs.writeFileSync(path.join(anyDpiDir, 'ic_launcher.xml'), adaptiveXml);
fs.writeFileSync(path.join(anyDpiDir, 'ic_launcher_round.xml'), adaptiveXml);

// Update ic_launcher_background.xml
const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#059669</color>
</resources>
`;
fs.writeFileSync(path.join(resRoot, 'values/ic_launcher_background.xml'), bgXml);

console.log('All MarkPoint App Icons built and saved successfully!');
