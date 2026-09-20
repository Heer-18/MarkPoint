import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Pure JS PNG generator for crisp, dependency-free icon generation
 */
function createPNG(width, height, renderPixelFn) {
  // RGBA buffer with filter byte 0 (None) per scanline
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderPixelFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, len + 8));
  chunk.writeInt32BE(crc, len + 8);
  return chunk;
}

// CRC32 table
const crcTable = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) | 0;
}

/**
 * Renders the Heart-Handshake MarkPoint App Icon
 * @param {boolean} isRound - Whether to clip into a circle or squircle
 * @param {boolean} isForegroundOnly - Transparent background for Android Adaptive Icon
 */
function renderMarkPointIconPixel(x, y, width, height, isRound = false, isForegroundOnly = false) {
  // Normalize coords to [-1, 1]
  const nx = (x / (width - 1)) * 2 - 1;
  const ny = (y / (height - 1)) * 2 - 1;
  const dist = Math.hypot(nx, ny);

  // 1. Adaptive Foreground Only (Transparent background)
  if (isForegroundOnly) {
    // Center scale factor for adaptive icon safe area (72/108 = ~0.66)
    const sx = nx / 0.62;
    const sy = ny / 0.62;
    return sampleHeartHandshake(sx, sy);
  }

  // 2. Full App Icon with Squircle / Round Container
  const cornerRadius = 0.44; // Squircle roundness
  // Superellipse formula for smooth modern squircle
  const squircleDist = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4);

  if (isRound) {
    if (dist > 0.96) return [0, 0, 0, 0]; // Transparent outside circle
  } else {
    if (squircleDist > 0.88) return [0, 0, 0, 0]; // Transparent outside squircle
  }

  // Background Gradient: Deep slate / obsidian (#09101d) with radiant emerald sheen (#042f2e -> #0f172a)
  const gradT = (nx + ny + 2) / 4; // Diagonal 0 to 1
  let bgR = Math.round(8 + gradT * 4);
  let bgG = Math.round(18 + gradT * 26);
  let bgB = Math.round(28 + gradT * 12);

  // Glowing Emerald Squircle Border
  const borderEdge = isRound ? Math.abs(dist - 0.94) : Math.abs(Math.pow(squircleDist, 0.25) - 0.94);
  if (borderEdge < 0.04) {
    const borderIntensity = (1 - borderEdge / 0.04);
    bgR = Math.round(bgR * (1 - borderIntensity) + 16 * borderIntensity);
    bgG = Math.round(bgG * (1 - borderIntensity) + 185 * borderIntensity);
    bgB = Math.round(bgB * (1 - borderIntensity) + 129 * borderIntensity);
  }

  // Inner subtle glow
  const innerGlow = Math.max(0, 1 - dist * 1.2);
  bgR = Math.min(255, Math.round(bgR + innerGlow * 12));
  bgG = Math.min(255, Math.round(bgG + innerGlow * 55));
  bgB = Math.min(255, Math.round(bgB + innerGlow * 40));

  // Sample Symbol
  const [symR, symG, symB, symA] = sampleHeartHandshake(nx / 0.54, (ny + 0.02) / 0.54);

  if (symA === 0) {
    return [bgR, bgG, bgB, 255];
  }

  const alpha = symA / 255;
  const outR = Math.round(symR * alpha + bgR * (1 - alpha));
  const outG = Math.round(symG * alpha + bgG * (1 - alpha));
  const outB = Math.round(symB * alpha + bgB * (1 - alpha));
  return [outR, outG, outB, 255];
}

/**
 * Mathematical Distance field renderer for Heart-Handshake Logo
 */
function sampleHeartHandshake(x, y) {
  // Stroke thickness
  const thickness = 0.12;

  // Approximate signed distance to Heart-Handshake contour
  const d = getHeartHandshakeDistance(x, y);

  if (d > thickness) {
    return [0, 0, 0, 0];
  }

  // Anti-aliased edge smoothing
  const edgeAlpha = Math.max(0, Math.min(1, (thickness - d) / 0.03));
  const alphaVal = Math.round(edgeAlpha * 255);

  // Gradient on stroke: White (#ffffff) transitioning to vibrant Emerald (#34d399)
  const strokeGrad = (x + y + 2) / 4;
  const r = Math.round(255 - strokeGrad * 30);
  const g = Math.round(255 - strokeGrad * 10);
  const b = Math.round(255 - strokeGrad * 40);

  return [r, g, b, alphaVal];
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function distToArc(px, py, cx, cy, radius, startAngle, endAngle) {
  const angle = Math.atan2(py - cy, px - cx);
  // Normalize angle to [startAngle, endAngle]
  let diff = angle - startAngle;
  while (diff < 0) diff += Math.PI * 2;
  const sweep = endAngle - startAngle;
  if (diff <= sweep) {
    return Math.abs(Math.hypot(px - cx, py - cy) - radius);
  }
  // Distance to arc endpoints
  const p1x = cx + Math.cos(startAngle) * radius;
  const p1y = cy + Math.sin(startAngle) * radius;
  const p2x = cx + Math.cos(endAngle) * radius;
  const p2y = cy + Math.sin(endAngle) * radius;
  return Math.min(Math.hypot(px - p1x, py - p1y), Math.hypot(px - p2x, py - p2y));
}

function getHeartHandshakeDistance(x, y) {
  let minDist = 999;

  // 1. Left Heart Lobe Arc: center (-0.42, -0.32), radius 0.42
  const dLeftLobe = distToArc(x, y, -0.42, -0.32, 0.42, Math.PI * 0.78, Math.PI * 2.05);
  minDist = Math.min(minDist, dLeftLobe);

  // 2. Right Heart Lobe Arc: center (0.42, -0.32), radius 0.42
  const dRightLobe = distToArc(x, y, 0.42, -0.32, 0.42, -Math.PI * 0.05, Math.PI * 1.22);
  minDist = Math.min(minDist, dRightLobe);

  // 3. Left Heart Body to Bottom Tip: from (-0.84, -0.25) to (0.0, 0.82)
  const dLeftBody = distToSegment(x, y, -0.84, -0.22, 0.0, 0.82);
  minDist = Math.min(minDist, dLeftBody);

  // 4. Right Heart Body to Handshake Entry: from (0.84, -0.22) to (0.28, 0.50)
  const dRightBody = distToSegment(x, y, 0.84, -0.22, 0.28, 0.50);
  minDist = Math.min(minDist, dRightBody);

  // 5. Right Hand Arm & Wrist Loop: from (0.28, 0.50) -> curve to (-0.15, 0.12) -> loop around to (0.35, -0.05)
  const dHandLoop1 = distToSegment(x, y, 0.28, 0.50, -0.10, 0.14);
  const dHandLoop2 = distToArc(x, y, -0.10, 0.02, 0.14, Math.PI * 0.4, Math.PI * 1.5);
  const dHandLoop3 = distToSegment(x, y, -0.10, -0.10, 0.38, -0.10);
  minDist = Math.min(minDist, dHandLoop1, dHandLoop2, dHandLoop3);

  // 6. Left Hand Interlocking Fingers / Ridges:
  // Ridge 1 (Wrist grip)
  const dGrip1 = distToSegment(x, y, -0.38, 0.40, -0.10, 0.14);
  // Ridge 2 (Center finger)
  const dFinger1 = distToSegment(x, y, -0.10, 0.38, 0.08, 0.20);
  // Ridge 3 (Index finger)
  const dFinger2 = distToSegment(x, y, 0.08, 0.55, 0.26, 0.37);
  minDist = Math.min(minDist, dGrip1, dFinger1, dFinger2);

  return minDist;
}

// Generate all density sizes
const DENSITIES = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 }
];

const RES_ROOT = path.resolve('android/app/src/main/res');

console.log('Generating MarkPoint Heart-Handshake Theme App Icons...');

for (const { dir, size } of DENSITIES) {
  const targetDir = path.join(RES_ROOT, dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Standard Squircle App Icon
  const pngSquircle = createPNG(size, size, (x, y, w, h) => renderMarkPointIconPixel(x, y, w, h, false, false));
  fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), pngSquircle);

  // 2. Round App Icon
  const pngRound = createPNG(size, size, (x, y, w, h) => renderMarkPointIconPixel(x, y, w, h, true, false));
  fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), pngRound);

  // 3. Foreground Icon (432x432 for adaptive icons in xxxhdpi, or scaled)
  const fgSize = Math.round((size / 192) * 432);
  const pngForeground = createPNG(fgSize, fgSize, (x, y, w, h) => renderMarkPointIconPixel(x, y, w, h, false, true));
  fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), pngForeground);

  console.log(`✓ Generated ${dir} (${size}x${size}, fg: ${fgSize}x${fgSize})`);
}

// Write Android 8+ Adaptive Icon XMLs in mipmap-anydpi-v26
const ANYDPI_DIR = path.join(RES_ROOT, 'mipmap-anydpi-v26');
if (!fs.existsSync(ANYDPI_DIR)) {
  fs.mkdirSync(ANYDPI_DIR, { recursive: true });
}

const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;

fs.writeFileSync(path.join(ANYDPI_DIR, 'ic_launcher.xml'), adaptiveXml);
fs.writeFileSync(path.join(ANYDPI_DIR, 'ic_launcher_round.xml'), adaptiveXml);
console.log('✓ Generated mipmap-anydpi-v26 adaptive icon definitions');

// Also update ic_launcher_background.xml
const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#09101d</color>
</resources>
`;
fs.writeFileSync(path.join(RES_ROOT, 'values/ic_launcher_background.xml'), bgXml);

console.log('All MarkPoint App Icons successfully generated!');
