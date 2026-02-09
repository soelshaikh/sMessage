import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Check if directory exists
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({
        exists: false,
        path: uploadDir,
        message: 'Upload directory does not exist'
      });
    }

    // List all files in uploads directory
    const files = fs.readdirSync(uploadDir);
    
    // Get file details
    const fileDetails = files.map(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });

    return res.status(200).json({
      exists: true,
      path: uploadDir,
      filesCount: files.length,
      files: fileDetails
    });
  } catch (error) {
    console.error('Error checking uploads:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
}
