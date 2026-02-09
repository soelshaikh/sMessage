import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'surprise.db');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS surprise_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    qr_token TEXT UNIQUE NOT NULL,
    opened_at TEXT,
    image_url TEXT,
    device_info TEXT,
    ip_address TEXT,
    password_verified INTEGER DEFAULT 0,
    password_attempts INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    password_hash TEXT NOT NULL
  );
`);

export interface SurpriseEvent {
  id?: number;
  qr_token: string;
  opened_at?: string | null;
  image_url?: string | null;
  device_info?: string | null;
  ip_address?: string | null;
  password_verified?: number;
  password_attempts?: number;
  created_at?: string;
}

export default db;
