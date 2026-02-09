import type { NextApiRequest, NextApiResponse } from 'next';
import { generateToken } from '@/lib/token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = generateToken();
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surprise/${token}`;
    
    res.status(200).json({ 
      token, 
      url,
      message: 'Token generated successfully. Use this URL to create a QR code.'
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}
