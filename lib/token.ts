import { v4 as uuidv4 } from 'uuid';
import db from './db';

export function generateToken(): string {
  // Generate a cryptographically secure random token
  const token = uuidv4();
  
  // Store token in database
  const stmt = db.prepare(`
    INSERT INTO surprise_events (qr_token, password_verified, password_attempts)
    VALUES (?, 0, 0)
  `);
  
  stmt.run(token);
  
  return token;
}

export function validateToken(token: string): boolean {
  const stmt = db.prepare('SELECT qr_token FROM surprise_events WHERE qr_token = ?');
  const result = stmt.get(token);
  return !!result;
}

export function isTokenUsed(token: string): boolean {
  const stmt = db.prepare('SELECT opened_at, password_verified FROM surprise_events WHERE qr_token = ?');
  const result = stmt.get(token) as { opened_at: string | null; password_verified: number } | undefined;
  
  // Token is used if password was verified and surprise was opened
  return !!(result && result.password_verified && result.opened_at);
}

export function getTokenData(token: string) {
  const stmt = db.prepare('SELECT * FROM surprise_events WHERE qr_token = ?');
  return stmt.get(token);
}
