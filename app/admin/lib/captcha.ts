import crypto from 'crypto';

const SECRET_KEY = process.env.CAPTCHA_SECRET || 'shivalay-travels-secret-key-123456';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  try {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    return '';
  }
}

export function generateCaptchaSvg(text: string): string {
  const width = 140;
  const height = 44;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Dark Background
  svg += `<rect width="100%" height="100%" fill="#121212" rx="6" stroke="#262626" stroke-width="1" />`;
  
  // Grid/noise lines
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#737373'];
  for (let i = 0; i < 5; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-opacity="0.35" stroke-width="1.5" />`;
  }
  
  // Noise dots
  for (let i = 0; i < 25; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = Math.random() * 1.5 + 0.5;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#525252" fill-opacity="0.5" />`;
  }
  
  // Distorted text characters
  const charWidth = width / (text.length + 1.2);
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const x = (i + 0.6) * charWidth + (Math.random() * 4 - 2);
    const y = 28 + (Math.random() * 6 - 3);
    const rotate = Math.random() * 24 - 12; // rotate between -12 and 12 deg
    const color = colors[Math.floor(Math.random() * colors.length)];
    const fontSize = 18 + Math.random() * 4;
    svg += `<text x="${x}" y="${y}" font-family="Courier New, monospace" font-size="${fontSize}" font-weight="bold" fill="${color}" transform="rotate(${rotate}, ${x}, ${y})">${char}</text>`;
  }
  
  svg += `</svg>`;
  return svg;
}
