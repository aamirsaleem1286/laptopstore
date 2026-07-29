import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure directory exists
fs.mkdirSync(outputDir, { recursive: true });

// All image filenames from seed.js and add-products.js (mapped to SVG)
const productImages = [
  // Apple
  { file: 'macbook-pro-m3.jpg', name: 'MacBook Pro M3', bg: '#1a1a2e', accent: '#e94560' },
  { file: 'gold-macbook.jpg', name: 'MacBook Pro M3', bg: '#d4af37', accent: '#b8962c' },
  { file: 'macbook-air-m2.jpg', name: 'MacBook Air M2', bg: '#c0c0c0', accent: '#868686' },
  { file: 'starlight-macbook.jpg', name: 'MacBook Air', bg: '#f5e6d3', accent: '#d4b8a4' },
  { file: 'macbook-pro-m1-used.jpg', name: 'MacBook Pro M1', bg: '#333333', accent: '#555555' },
  { file: 'used-macbook.jpg', name: 'MacBook Pro M1', bg: '#444444', accent: '#666666' },

  // Dell
  { file: 'dell-xps-15.jpg', name: 'Dell XPS 15', bg: '#c0c0c0', accent: '#0077b6' },
  { file: 'dell-xps-15-silver.jpg', name: 'Dell XPS 15', bg: '#d4d4d4', accent: '#0096c7' },
  { file: 'latitude-7420-refurb.jpg', name: 'Latitude 7420', bg: '#2d2d2d', accent: '#0077b6' },
  { file: 'dell-logo.jpg', name: 'Dell', bg: '#001e6b', accent: '#0077b6' },
  { file: 'dell-inspiron-16-plus.jpg', name: 'Inspiron 16 Plus', bg: '#b8c4d0', accent: '#0056a7' },
  { file: 'inspiron-16-side.jpg', name: 'Inspiron 16', bg: '#a0b0c0', accent: '#004a99' },
  { file: 'precision-5570.jpg', name: 'Precision 5570', bg: '#3d3d3d', accent: '#00a6fb' },
  { file: 'precision-deck.jpg', name: 'Precision 5570', bg: '#2d2d2d', accent: '#0077b6' },
  { file: 'dell-g15.jpg', name: 'Dell G15', bg: '#1a1a2e', accent: '#e63946' },
  { file: 'g15-rgb.jpg', name: 'Dell G15', bg: '#0d1b2a', accent: '#e63946' },
  { file: 'latitude-5540.jpg', name: 'Latitude 5540', bg: '#384b70', accent: '#0077b6' },
  { file: 'latitude-open.jpg', name: 'Latitude 5540', bg: '#2c3e50', accent: '#3498db' },

  // HP
  { file: 'spectre-x360.jpg', name: 'HP Spectre x360', bg: '#1a1a2e', accent: '#e94560' },
  { file: 'spectre-tablet.jpg', name: 'HP Spectre', bg: '#16213e', accent: '#c0392b' },
  { file: 'hp-pavilion-15.jpg', name: 'HP Pavilion 15', bg: '#a8b2c1', accent: '#0066cc' },
  { file: 'hp-pavilion-side.jpg', name: 'HP Pavilion', bg: '#8a9ba8', accent: '#0055aa' },
  { file: 'elitebook-840-g10.jpg', name: 'EliteBook 840', bg: '#2c3e50', accent: '#009688' },
  { file: 'elitebook-angle.jpg', name: 'EliteBook 840', bg: '#1a252f', accent: '#00796b' },
  { file: 'hp-victus-16.jpg', name: 'HP Victus 16', bg: '#0d1b2a', accent: '#e63946' },
  { file: 'victus-kb.jpg', name: 'HP Victus', bg: '#1b2838', accent: '#c0392b' },
  { file: 'probook-450-g10.jpg', name: 'ProBook 450', bg: '#5d6d7e', accent: '#2c3e50' },
  { file: 'probook-top.jpg', name: 'ProBook 450', bg: '#4a5568', accent: '#1a202c' },

  // Lenovo
  { file: 'thinkpad-x1-carbon.jpg', name: 'ThinkPad X1', bg: '#1a1a1a', accent: '#cc0000' },
  { file: 'thinkpad-keyboard.jpg', name: 'ThinkPad', bg: '#2d2d2d', accent: '#cc0000' },

  // ASUS
  { file: 'zephyrus-g14.jpg', name: 'ROG Zephyrus G14', bg: '#1a1a2e', accent: '#e63946' },
  { file: 'rog-logo.jpg', name: 'ROG', bg: '#0d0d0d', accent: '#ff0000' },

  // Microsoft
  { file: 'surface-laptop-5.jpg', name: 'Surface Laptop 5', bg: '#c7c7c7', accent: '#0078d4' },
  { file: 'surface-alcantara.jpg', name: 'Surface Laptop', bg: '#d4c9b8', accent: '#0078d4' },

  // Acer
  { file: 'swift-x.jpg', name: 'Acer Swift X', bg: '#808080', accent: '#00a650' },
  { file: 'swift-x-side.jpg', name: 'Acer Swift X', bg: '#6b6b6b', accent: '#00843d' },

  // Samsung
  { file: 'galaxy-book3-pro.jpg', name: 'Galaxy Book3 Pro', bg: '#2d2d2d', accent: '#1428a0' },
  { file: 's-pen.jpg', name: 'Galaxy Book3', bg: '#1a1a1a', accent: '#1428a0' },
];

function generateSvg(name, bg, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${accent};stop-opacity:0.7" />
    </linearGradient>
    <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style="stop-color:#1a1a2e" />
      <stop offset="100%" style="stop-color:#0f3460" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="600" height="600" fill="url(#bg)" rx="20"/>

  <!-- Screen lid (open laptop view) -->
  <rect x="80" y="60" width="420" height="300" rx="14" fill="#1a1a2e" stroke="#444" stroke-width="2"/>
  <rect x="90" y="70" width="400" height="240" rx="6" fill="#0a0a1a"/>

  <!-- Desktop screen mockup -->
  <rect x="110" y="90" width="360" height="200" rx="4" fill="#16213e"/>

  <!-- Code lines on screen -->
  <rect x="130" y="110" width="60" height="4" rx="2" fill="#e94560"/>
  <rect x="200" y="110" width="120" height="4" rx="2" fill="#f5c542"/>
  <rect x="130" y="124" width="90" height="4" rx="2" fill="#00a86b"/>
  <rect x="130" y="138" width="150" height="4" rx="2" fill="#3498db"/>
  <rect x="150" y="152" width="80" height="4" rx="2" fill="#e94560"/>
  <rect x="150" y="166" width="200" height="4" rx="2" fill="#f5c542"/>
  <rect x="130" y="180" width="100" height="4" rx="2" fill="#00a86b"/>
  <rect x="150" y="194" width="160" height="4" rx="2" fill="#3498db"/>
  <rect x="130" y="208" width="70" height="4" rx="2" fill="#e94560"/>
  <rect x="130" y="222" width="180" height="4" rx="2" fill="#f5c542"/>

  <!-- Screen reflection -->
  <rect x="110" y="310" width="400" height="50" rx="0 0 6 6" fill="url(#screenGlow)" opacity="0.2"/>

  <!-- Laptop base / keyboard deck -->
  <path d="M70 380 L95 355 L505 355 L530 380 L510 450 L90 450 Z" fill="#2d2d2d" stroke="#444" stroke-width="2"/>

  <!-- Keyboard surface -->
  <rect x="130" y="365" width="340" height="50" rx="3" fill="#3d3d3d"/>

  <!-- Keys row 1 -->
  <rect x="140" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="173" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="206" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="239" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="272" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="305" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="338" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="371" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="404" y="370" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="437" y="370" width="28" height="7" rx="1.5" fill="#555"/>

  <!-- Keys row 2 -->
  <rect x="145" y="382" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="178" y="382" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="211" y="382" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="244" y="382" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="277" y="382" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="310" y="382" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="343" y="382" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="376" y="382" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="409" y="382" width="56" height="7" rx="1.5" fill="#555"/>

  <!-- Spacebar row -->
  <rect x="150" y="394" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="183" y="394" width="170" height="7" rx="1.5" fill="#555"/>
  <rect x="358" y="394" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="391" y="394" width="28" height="7" rx="1.5" fill="#555"/>
  <rect x="424" y="394" width="36" height="7" rx="1.5" fill="#555"/>

  <!-- Trackpad -->
  <rect x="250" y="408" width="100" height="20" rx="4" fill="#4d4d4d"/>

  <!-- Power LED -->
  <circle cx="300" cy="440" r="3" fill="${accent}"/>

  <!-- Brand text -->
  <text x="300" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" opacity="0.9">${name}</text>

  <!-- Laptop icon -->
  <text x="300" y="545" text-anchor="middle" font-size="28" opacity="0.6">💻</text>
</svg>`;
}

let generated = 0;
let skipped = 0;

for (const img of productImages) {
  const svgFilename = img.file;  // Keep .jpg name but content is SVG
  const filePath = path.join(outputDir, svgFilename);

  // Also create .svg version
  const svgFilePath = path.join(outputDir, img.file.replace('.jpg', '.svg'));

  if (fs.existsSync(svgFilePath)) {
    skipped++;
    continue;
  }

  const svg = generateSvg(img.name, img.bg, img.accent);
  fs.writeFileSync(svgFilePath, svg);
  generated++;
}

console.log(`✅ Generated ${generated} placeholder SVG images`);
console.log(`   Skipped ${skipped} existing files`);
console.log(`   Location: ${outputDir}`);

// Also create a generic fallback image
const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3498db;stop-opacity:0.5" />
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)" rx="20"/>
  <text x="300" y="280" text-anchor="middle" font-family="Arial" font-size="60" opacity="0.3">💻</text>
  <text x="300" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="white" opacity="0.6">Product Image</text>
  <text x="300" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white" opacity="0.4">Coming Soon</text>
</svg>`;
fs.writeFileSync(path.join(outputDir, 'placeholder.svg'), fallbackSvg);
console.log('   Created generic placeholder.svg');
