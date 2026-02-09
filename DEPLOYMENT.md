# 🚀 Deployment Guide

## Option 1: Quick Deploy with Vercel + Supabase (Recommended)

This is the easiest way to get a production-ready app with HTTPS (required for camera).

### Step 1: Set Up Supabase Database

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up (free tier is fine)
   - Create a new project

2. **Create Database Tables**
   - Go to SQL Editor in Supabase dashboard
   - Run this SQL:

```sql
-- Create surprise_events table
CREATE TABLE surprise_events (
  id SERIAL PRIMARY KEY,
  qr_token TEXT UNIQUE NOT NULL,
  opened_at TIMESTAMP,
  image_url TEXT,
  device_info TEXT,
  ip_address TEXT,
  password_verified BOOLEAN DEFAULT false,
  password_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_config table
CREATE TABLE admin_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  password_hash TEXT NOT NULL
);
```

3. **Set Up Storage Bucket**
   - Go to Storage in Supabase
   - Create new bucket named `surprise-images`
   - Set it to **private** (not public)
   - Set policies for authenticated access

4. **Get Connection Details**
   - Go to Project Settings → Database
   - Copy the connection string (URI)

### Step 2: Prepare Code for Supabase

Update `lib/db.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

Update `lib/storage.ts` for Supabase Storage:

```typescript
import { supabase } from './db';

export async function saveImage(token: string, base64Image: string, deviceInfo?: string, ipAddress?: string): Promise<string> {
  const matches = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image data');
  }

  const imageType = matches[1];
  const imageData = matches[2];
  const buffer = Buffer.from(imageData, 'base64');
  
  const filename = `${token}.${imageType === 'jpeg' ? 'jpg' : imageType}`;
  
  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('surprise-images')
    .upload(filename, buffer, {
      contentType: `image/${imageType}`,
      upsert: true
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage
    .from('surprise-images')
    .getPublicUrl(filename);

  const imageUrl = data.publicUrl;

  // Update database
  const { error: dbError } = await supabase
    .from('surprise_events')
    .update({
      image_url: imageUrl,
      opened_at: new Date().toISOString(),
      device_info: deviceInfo,
      ip_address: ipAddress
    })
    .eq('qr_token', token);

  if (dbError) throw dbError;

  return imageUrl;
}
```

### Step 3: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Birthday surprise for Uzma"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "Import Project"
   - Select your repository
   - Configure:
     - Framework: Next.js (auto-detected)
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-service-key
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

4. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your production URL!

---

## Option 2: Deploy with Render.com (Simple)

Render.com is simpler but might be slower on free tier.

### Steps:

1. **Prepare for Deployment**
   - Ensure all code is committed to GitHub
   - SQLite works on Render's paid tier only
   - Consider using PostgreSQL (Render provides free PostgreSQL)

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Name: `birthday-surprise-db`
   - Free tier is fine
   - Copy the connection URL

4. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect your GitHub repo
   - Settings:
     - Name: `birthday-surprise-uzma`
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

5. **Add Environment Variables**
   ```
   DATABASE_URL=your-postgresql-url
   NEXT_PUBLIC_BASE_URL=https://your-app.onrender.com
   NODE_ENV=production
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for build (5-10 minutes first time)
   - Access your app!

---

## Option 3: Local Network with ngrok (Quickest for Testing)

Perfect for testing with real HTTPS before full deployment.

### Steps:

1. **Install ngrok**
   - Download from https://ngrok.com/download
   - Extract and place in your PATH

2. **Start Your App**
   ```bash
   npm run dev
   ```

3. **Start ngrok**
   ```bash
   ngrok http 3000
   ```

4. **Use the HTTPS URL**
   - ngrok provides: `https://abc123.ngrok.io`
   - Share this URL or create QR code with it
   - Works with camera (has HTTPS!)

**Limitations:**
- URL changes each time you restart ngrok
- Free tier has connection limits
- Your computer must stay on

---

## Option 4: Railway.app (Modern & Simple)

Railway is modern, fast, and has good free tier.

### Steps:

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Dashboard → New Project
   - Deploy from GitHub repo
   - Select your repository

3. **Add PostgreSQL**
   - Add → Database → PostgreSQL
   - Railway auto-configures connection

4. **Configure Settings**
   - Add environment variables
   - Set start command: `npm start`

5. **Deploy**
   - Railway auto-deploys on push
   - Get your production URL

---

## Environment Variables Reference

For production, you'll need:

```env
# Required
NEXT_PUBLIC_BASE_URL=https://your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/db

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Optional
NODE_ENV=production
```

---

## Pre-Deployment Checklist

- [ ] Test locally with `npm run build && npm start`
- [ ] All environment variables set
- [ ] Database tables created
- [ ] Storage bucket configured
- [ ] Admin password changed from default
- [ ] Camera works with HTTPS
- [ ] Test complete flow on production URL
- [ ] QR code generated with production URL

---

## Post-Deployment Testing

1. **Generate Production QR Code**
   - Use production URL
   - Test scanning on phone
   - Verify camera works

2. **Test Complete Flow**
   - Password verification
   - Camera capture
   - Image upload
   - Admin dashboard

3. **Performance Check**
   - Page load speed
   - Image upload speed
   - Mobile responsiveness

---

## Cost Estimate

### Free Tier (Recommended for this project):
- **Vercel:** Free (perfect for Next.js)
- **Supabase:** Free (500MB storage, 2GB bandwidth)
- **Total:** $0/month

### Paid Options (if needed):
- **Vercel Pro:** $20/month (not needed for this)
- **Supabase Pro:** $25/month (not needed for this)
- **Render:** $7/month (if need persistent SQLite)

**For this project, free tier is more than enough!**

---

## Domain Setup (Optional)

If you want a custom domain like `uzmabirthday.com`:

1. **Buy Domain**
   - Namecheap, GoDaddy, etc. (~$12/year)

2. **Configure in Vercel/Render**
   - Dashboard → Domains → Add Custom Domain
   - Follow DNS configuration steps

3. **Update Environment Variables**
   - Change `NEXT_PUBLIC_BASE_URL` to your domain

---

## Security Checklist for Production

- [ ] Change default admin password
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set up CORS properly
- [ ] Configure CSP headers
- [ ] Enable rate limiting
- [ ] Secure API routes
- [ ] Use environment variables for secrets
- [ ] Set up database backups

---

## Recommended: Vercel + Supabase

**Why?**
- ✅ 100% Free
- ✅ Automatic HTTPS
- ✅ Great performance
- ✅ Easy to set up
- ✅ Scales automatically
- ✅ Perfect for Next.js
- ✅ Camera will work perfectly

**Time to deploy:** ~30 minutes first time

---

## Quick Decision Guide

**Need it working TODAY?**
→ Use ngrok (Option 3)

**Want it for February 10 only?**
→ Use ngrok or keep it local

**Want proper production deployment?**
→ Use Vercel + Supabase (Option 1)

**Want simplest deployment?**
→ Use Render.com (Option 2)

---

## Support

If you need help with deployment:
1. Check Vercel/Supabase docs (very detailed)
2. Most platforms have Discord communities
3. Stack Overflow for specific errors

Good luck with deployment! 🚀💖
