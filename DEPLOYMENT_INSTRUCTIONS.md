# Deployment Instructions

## Architecture
- **Backend**: Render.com (https://smessage.onrender.com)
- **Frontend**: Vercel (Coming soon)

## Backend (Already Deployed ✅)
Your backend is live at: https://smessage.onrender.com

## Frontend Deployment to Vercel

### Step 1: Push Code to GitHub
```bash
cd sMessage
git add .
git commit -m "Configure frontend to use Render backend"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `sMessage` repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 3: Add Environment Variable
In Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add: 
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://smessage.onrender.com`
   - **Environment**: Production, Preview, Development (select all)
3. Click "Save"

### Step 4: Deploy!
Click "Deploy" and Vercel will build and deploy your frontend.

## How It Works
- Frontend (Vercel) serves the React/Next.js pages
- All API calls go to Backend (Render) at https://smessage.onrender.com
- Database and file uploads are stored on Render's persistent disk

## Testing
After deployment, your app will be available at: `https://your-project.vercel.app`

Test the flow:
1. Open the homepage
2. Click "Open Message Link"
3. Enter password: 21-01-2023
4. Take a photo
5. View the surprise message

## Important Notes
- The backend must be running for the app to work
- Render free tier may sleep after inactivity (takes ~30s to wake up)
- All data is stored on Render's backend
