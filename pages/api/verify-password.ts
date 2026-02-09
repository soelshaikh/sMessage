import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyPassword } from '@/lib/password';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }

  try {
    const result = verifyPassword(token, password);
    
    if (result.success) {
      return res.status(200).json({ success: true, message: 'Password verified' });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: result.message,
        attemptsLeft: result.attemptsLeft 
      });
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ error: 'Failed to verify password' });
  }
}
