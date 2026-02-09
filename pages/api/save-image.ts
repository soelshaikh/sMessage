import type { NextApiRequest, NextApiResponse } from 'next';
import { saveImage } from '@/lib/storage';
import { isPasswordVerified } from '@/lib/password';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, image, deviceInfo } = req.body;

  console.log('Save image API called for token:', token?.substring(0, 8));

  if (!token || !image) {
    console.error('Missing token or image');
    return res.status(400).json({ error: 'Token and image are required' });
  }

  try {
    // Verify password was verified before allowing image upload
    console.log('Checking password verification...');
    if (!isPasswordVerified(token)) {
      console.error('Password not verified for token:', token?.substring(0, 8));
      return res.status(403).json({ error: 'Password not verified' });
    }

    console.log('Password verified, saving image...');

    // Get IP address with better handling
    let ipAddress = 'unknown';
    
    if (req.headers['x-forwarded-for']) {
      // If behind proxy, get the first IP in the list
      const forwarded = req.headers['x-forwarded-for'] as string;
      ipAddress = forwarded.split(',')[0].trim();
    } else if (req.headers['x-real-ip']) {
      ipAddress = req.headers['x-real-ip'] as string;
    } else if (req.socket.remoteAddress) {
      ipAddress = req.socket.remoteAddress;
      // Convert IPv6 localhost to IPv4
      if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
        ipAddress = '127.0.0.1 (localhost)';
      }
    }

    const imageUrl = saveImage(token, image, deviceInfo, ipAddress);
    
    console.log('Image saved successfully:', imageUrl);
    
    res.status(200).json({ 
      success: true,
      imageUrl,
      message: 'Image saved successfully'
    });
  } catch (error) {
    console.error('Error saving image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save image';
    res.status(500).json({ error: errorMessage });
  }
}
