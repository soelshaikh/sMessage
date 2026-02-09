import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminPassword } from '@/lib/admin';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const isValid = verifyAdminPassword(password);
    
    if (isValid) {
      // Set HTTP-only cookie for admin session (manual serialization)
      const cookieValue = `admin_session=authenticated; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      
      res.setHeader('Set-Cookie', cookieValue);
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error verifying admin password:', error);
    res.status(500).json({ error: 'Failed to verify password' });
  }
}
