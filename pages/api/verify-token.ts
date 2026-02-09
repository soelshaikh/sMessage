import type { NextApiRequest, NextApiResponse } from 'next';
import { validateToken, isTokenUsed } from '@/lib/token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const isValid = validateToken(token);
    
    if (!isValid) {
      return res.status(404).json({ error: 'Invalid token' });
    }

    const used = isTokenUsed(token);
    
    res.status(200).json({ 
      valid: true,
      used,
      message: used ? 'This surprise has already been opened' : 'Token is valid'
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
}
