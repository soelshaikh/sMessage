import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

function isAuthenticated(req: NextApiRequest): boolean {
  const cookieHeader = req.headers.cookie || '';
  // Simple cookie parsing
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies.admin_session === 'authenticated';
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const stmt = db.prepare(`
      SELECT id, qr_token, opened_at, image_url, device_info, ip_address, 
             password_verified, password_attempts, created_at
      FROM surprise_events
      ORDER BY created_at DESC
    `);
    
    const events = stmt.all();
    
    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}
