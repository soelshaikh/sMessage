import fs from 'fs';
import path from 'path';
import db from './db';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export function saveImage(token: string, base64Image: string, deviceInfo?: string, ipAddress?: string): string {
  // Extract base64 data
  const matches = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image data');
  }
  
  const imageType = matches[1];
  const imageData = matches[2];
  const buffer = Buffer.from(imageData, 'base64');
  
  // Generate filename
  const filename = `${token}.${imageType === 'jpeg' ? 'jpg' : imageType}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  
  // Save file
  fs.writeFileSync(filepath, buffer);
  
  // Update database
  const imageUrl = `/uploads/${filename}`;
  const stmt = db.prepare(`
    UPDATE surprise_events 
    SET image_url = ?, opened_at = CURRENT_TIMESTAMP, device_info = ?, ip_address = ?
    WHERE qr_token = ?
  `);
  
  stmt.run(imageUrl, deviceInfo || null, ipAddress || null, token);
  
  return imageUrl;
}

export function getImageUrl(token: string): string | null {
  const stmt = db.prepare('SELECT image_url FROM surprise_events WHERE qr_token = ?');
  const result = stmt.get(token) as { image_url: string | null } | undefined;
  return result?.image_url || null;
}
