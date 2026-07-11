import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';

const GOLD = '#FFB800';
const BG = '#0a0a09';

// Same Brain mark used in the app (App.jsx Brain component), scaled onto a
// full-bleed dark square so it reads cleanly as an iOS home-screen icon.
const brainIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="14" fill="${BG}"/>
  <circle cx="32" cy="32" r="29" fill="${GOLD}18" stroke="${GOLD}" stroke-width="1.5"/>
  <path d="M32 10C22 10 14 18 14 28c0 4 1.4 7.8 3.8 10.8V46h28.4v-7.2C48.6 35.8 50 32 50 28 50 18 42 10 32 10z" stroke="${GOLD}" stroke-width="2.2" fill="${GOLD}12"/>
  <polygon points="32,12 34.2,16.5 32,21 29.8,16.5" fill="${GOLD}"/>
  <polygon points="16,27 18.8,30 16,33 13.2,30" fill="${GOLD}" opacity=".8"/>
  <polygon points="48,27 50.8,30 48,33 45.2,30" fill="${GOLD}" opacity=".8"/>
  <polygon points="23,38 25.5,41 23,44 20.5,41" fill="${GOLD}" opacity=".65"/>
  <polygon points="41,38 43.5,41 41,44 38.5,41" fill="${GOLD}" opacity=".65"/>
  <polygon points="32,27 34,30 32,33 30,30" fill="#fff" opacity=".95"/>
  <line x1="32" y1="21" x2="32" y2="27" stroke="${GOLD}" stroke-width="1.4" opacity=".6"/>
  <line x1="18.8" y1="30" x2="30" y2="30" stroke="${GOLD}" stroke-width="1.4" opacity=".5"/>
  <line x1="45.2" y1="30" x2="34" y2="30" stroke="${GOLD}" stroke-width="1.4" opacity=".5"/>
  <line x1="25.5" y1="41" x2="30" y2="30" stroke="${GOLD}" stroke-width="1.4" opacity=".5"/>
  <line x1="38.5" y1="41" x2="34" y2="30" stroke="${GOLD}" stroke-width="1.4" opacity=".5"/>
</svg>`;

mkdirSync('public', { recursive: true });

const sizes = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
];

for (const { file, size } of sizes) {
  const svg = Buffer.from(brainIconSVG(512));
  await sharp(svg).resize(size, size).png().toFile(`public/${file}`);
  console.log('wrote', file);
}

writeFileSync('public/favicon.svg', brainIconSVG(64).trim());
console.log('wrote favicon.svg');
