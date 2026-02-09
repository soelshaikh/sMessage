import bcrypt from 'bcryptjs';
import db from './db';

const DEFAULT_ADMIN_PASSWORD = 'Soel@404';

// Initialize admin password on first run
export function initializeAdmin() {
  const stmt = db.prepare('SELECT * FROM admin_config WHERE id = 1');
  const result = stmt.get();
  
  if (!result) {
    const hash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
    const insertStmt = db.prepare('INSERT INTO admin_config (id, password_hash) VALUES (1, ?)');
    insertStmt.run(hash);
    console.log('Admin password initialized. Default password: Soel@404');
  }
}

export function verifyAdminPassword(password: string): boolean {
  const stmt = db.prepare('SELECT password_hash FROM admin_config WHERE id = 1');
  const result = stmt.get() as { password_hash: string } | undefined;
  
  if (!result) {
    initializeAdmin();
    return password === DEFAULT_ADMIN_PASSWORD;
  }
  
  return bcrypt.compareSync(password, result.password_hash);
}

export function updateAdminPassword(newPassword: string): boolean {
  const hash = bcrypt.hashSync(newPassword, 10);
  const stmt = db.prepare('UPDATE admin_config SET password_hash = ? WHERE id = 1');
  const result = stmt.run(hash);
  return result.changes > 0;
}
