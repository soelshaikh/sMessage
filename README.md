# 🎂 Birthday QR Surprise for Uzma

A romantic, secure web-based birthday surprise accessible via QR code.

## 🌟 Features

- **QR Code Access**: Unique, secure tokens for each surprise
- **Password Protection**: Secret date verification (when you first met: 21-01-2023)
- **Camera Capture**: Automatic selfie capture to preserve the moment
- **Romantic Reveal**: Beautiful birthday message with animations
- **Admin Dashboard**: View all captured moments and event details
- **Mobile-First**: Optimized for OnePlus Nord CE 4 5G and similar devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📱 How to Use

### For the Admin (You)

1. **Generate a QR Token:**
   - Go to `http://localhost:3000`
   - Click "Generate New Token 🎁"
   - Download the QR code image
   - Print or display it for Uzma

2. **Access Admin Dashboard:**
   - Go to `http://localhost:3000/admin`
   - Enter password: `UzmaLove2024!`
   - View all surprise events and captured moments

### For Uzma

1. **Scan QR Code:** Use phone camera to scan the QR code
2. **Enter Secret Date:** When you first met (21-01-2023)
3. **Click Continue:** Simple button to proceed
4. **Camera Capture:** Automatically captures a selfie after 3 seconds
5. **View Surprise:** Beautiful birthday message is revealed! 🎉

## 🔐 Security Features

- **Unique Tokens**: Each QR code uses a cryptographically secure UUID
- **Password Verification**: Maximum 5 attempts with the secret date
- **Single Use**: Each token can only be used once
- **Admin Authentication**: Dashboard protected with password
- **Secure Storage**: Images stored locally with controlled access

## 📁 Project Structure

```
birthday-surprise-uzma/
├── pages/
│   ├── api/                 # Backend API routes
│   │   ├── generate-token.ts
│   │   ├── verify-token.ts
│   │   ├── verify-password.ts
│   │   ├── save-image.ts
│   │   └── admin/
│   │       ├── login.ts
│   │       └── events.ts
│   ├── surprise/
│   │   └── [token].tsx      # Main surprise page
│   ├── admin/
│   │   └── index.tsx        # Admin dashboard
│   ├── index.tsx            # Home page
│   └── _app.tsx
├── lib/
│   ├── db.ts               # Database setup (SQLite)
│   ├── token.ts            # Token generation & validation
│   ├── password.ts         # Password verification
│   ├── admin.ts            # Admin authentication
│   └── storage.ts          # Image storage
├── styles/
│   └── globals.css         # Global styles with Tailwind
├── data/
│   └── surprise.db         # SQLite database (auto-created)
└── public/
    └── uploads/            # Captured images (auto-created)
```

## 🎨 Customization

### Change the Birthday Message

Edit `pages/surprise/[token].tsx` in the `SurpriseReveal` component to customize:
- Birthday message text
- Emojis and decorations
- Colors and animations

### Change the Secret Date

Edit `lib/password.ts`:
```typescript
const SECRET_DATE = '21-01-2023'; // Change this
```

### Change Admin Password

Default password: `UzmaLove2024!`

To change it:
1. Login to admin dashboard
2. Update in database or modify `lib/admin.ts`

### Customize Colors

Edit `tailwind.config.js` to change the romantic color scheme:
```javascript
romantic: {
  pink: '#FFB6C1',
  rose: '#FF69B4',
  coral: '#FF6B9D',
  purple: '#DDA0DD',
}
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Note:** For production, you'll need to:
   - Set up Supabase or another cloud database (SQLite won't work on Vercel)
   - Use cloud storage for images (Supabase Storage, AWS S3, etc.)

### Option 2: Local Network (For Testing)

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Access from phone:**
   - Find your computer's local IP (e.g., 192.168.1.100)
   - Access from phone: `http://192.168.1.100:3000`

### Option 3: Deploy with Database

For production deployment with persistent storage:

1. **Set up Supabase:**
   - Create account at supabase.com
   - Create a new project
   - Update database connection in `lib/db.ts`

2. **Set up Cloud Storage:**
   - Use Supabase Storage or AWS S3
   - Update `lib/storage.ts`

## 🎯 Important Dates

- **Uzma's Birthday:** February 10, 2002
- **First Met:** January 21, 2023 (Secret password)

## 🛠️ Troubleshooting

### Camera Not Working
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions
- Try a different browser (Chrome/Safari recommended)

### Database Errors
- Delete `data/surprise.db` and restart the server
- Check file permissions in the `data/` folder

### Images Not Saving
- Check `public/uploads/` folder exists and has write permissions
- Check browser console for errors

## 📝 Development Notes

- **Local Development:** Uses SQLite database
- **Image Storage:** Stored in `public/uploads/`
- **Session Management:** Uses HTTP-only cookies
- **Mobile Optimization:** Tailwind responsive classes

## 💖 Credits

Made with love for Uzma's special day! 🎂✨

---

**Remember:** This is a local development setup. For production use:
1. Use a proper cloud database (PostgreSQL, MySQL)
2. Use cloud storage for images (S3, Supabase Storage)
3. Enable HTTPS
4. Change all default passwords
5. Add proper security headers
