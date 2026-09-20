import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, pixelShader) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelShader(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = Math.min(255, Math.max(0, Math.round(r)));
      rawData[pxOffset + 1] = Math.min(255, Math.max(0, Math.round(g)));
      rawData[pxOffset + 2] = Math.min(255, Math.max(0, Math.round(b)));
      rawData[pxOffset + 3] = Math.min(255, Math.max(0, Math.round(a)));
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression: Deflate
  ihdr[11] = 0; // Filter: Standard
  ihdr[12] = 0; // Interlace: None

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeInt32BE(calcCRC(body), 0);
    return Buffer.concat([length, body, crc]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Table-based CRC32
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function calcCRC(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) | 0;
}

// Minimal MarkPoint Icon Shader (Sleek geometric point & ring on dark background, NO TEXT)
function markPointShader(x, y, w, h, isRound = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxR = w * 0.47;

  // Background
  let bgR = 5, bgG = 8, bgB = 17, bgA = 255;
  if (isRound) {
    if (dist > maxR) {
      return [0, 0, 0, 0];
    }
  } else {
    // Squircle rounding
    const radius = w * 0.22;
    const qx = Math.max(0, Math.abs(dx) - (cx - radius));
    const qy = Math.max(0, Math.abs(dy) - (cy - radius));
    const cornerDist = Math.sqrt(qx * qx + qy * qy);
    if (cornerDist > radius) {
      return [0, 0, 0, 0];
    }
  }

  // Outer gradient glow ring (Emerald #10b981 to Cyan #06b6d4)
  const outerRingR1 = w * 0.32;
  const outerRingR2 = w * 0.40;
  const t = (x + y) / (w + h);
  const gradR = 16 * (1 - t) + 6 * t;
  const gradG = 185 * (1 - t) + 182 * t;
  const gradB = 129 * (1 - t) + 212 * t;

  if (dist >= outerRingR1 && dist <= outerRingR2) {
    return [gradR, gradG, gradB, 255];
  }

  // Inner Pin Marker
  const pinCy = cy - h * 0.05;
  const pinHeadR = w * 0.17;
  const pinDist = Math.sqrt(dx * dx + (y - pinCy) * (y - pinCy));

  if (pinDist <= pinHeadR) {
    const dotR = w * 0.065;
    if (pinDist <= dotR) {
      return [5, 8, 17, 255]; // center beacon aperture
    }
    return [255, 255, 255, 255];
  }

  if (y > pinCy && y <= cy + h * 0.23) {
    const pointWidth = (1 - (y - pinCy) / (h * 0.28)) * pinHeadR;
    if (Math.abs(dx) <= pointWidth) {
      return [255, 255, 255, 255];
    }
  }

  return [bgR, bgG, bgB, bgA];
}

function foregroundShader(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Outer gradient glow ring
  const outerRingR1 = w * 0.23;
  const outerRingR2 = w * 0.29;
  const t = (x + y) / (w + h);
  const gradR = 16 * (1 - t) + 6 * t;
  const gradG = 185 * (1 - t) + 182 * t;
  const gradB = 129 * (1 - t) + 212 * t;

  if (dist >= outerRingR1 && dist <= outerRingR2) {
    return [gradR, gradG, gradB, 255];
  }

  // Inner Pin Marker
  const pinCy = cy - h * 0.035;
  const pinHeadR = w * 0.12;
  const pinDist = Math.sqrt(dx * dx + (y - pinCy) * (y - pinCy));

  if (pinDist <= pinHeadR) {
    const dotR = w * 0.045;
    if (pinDist <= dotR) {
      return [5, 8, 17, 255];
    }
    return [255, 255, 255, 255];
  }

  if (y > pinCy && y <= cy + h * 0.16) {
    const pointWidth = (1 - (y - pinCy) / (h * 0.195)) * pinHeadR;
    if (Math.abs(dx) <= pointWidth) {
      return [255, 255, 255, 255];
    }
  }

  return [0, 0, 0, 0];
}

const sizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 }
];

const resDir = path.resolve('android/app/src/main/res');

for (const { dir, size } of sizes) {
  const targetDir = path.join(resDir, dir);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const squarePng = createPNG(size, size, (x, y, w, h) => markPointShader(x, y, w, h, false));
  fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), squarePng);

  const roundPng = createPNG(size, size, (x, y, w, h) => markPointShader(x, y, w, h, true));
  fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), roundPng);

  const fgPng = createPNG(size * 2, size * 2, (x, y, w, h) => foregroundShader(x, y, w, h));
  fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), fgPng);
}

const public512 = createPNG(512, 512, (x, y, w, h) => markPointShader(x, y, w, h, false));
fs.writeFileSync(path.resolve('public/icon.png'), public512);

console.log('All minimal Android icons successfully generated!');
