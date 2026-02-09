# Force Render to Redeploy

## Issue
The new API endpoints (`/api/debug-uploads` and `/api/get-image`) are returning 404 because Render hasn't redeployed with the latest code.

## Solution: Force Redeploy on Render

### Method 1: Manual Deploy (Recommended)
1. Go to https://dashboard.render.com
2. Select your **sMessage** service
3. Click **"Manual Deploy"** button (top right)
4. Select **"Clear build cache & deploy"**
5. Wait for deployment to complete (~2-5 minutes)

### Method 2: Trigger via Empty Commit
Run this in your terminal:
```bash
cd sMessage
git commit --allow-empty -m "Trigger Render redeploy"
git push origin main
```

### Method 3: Check Render Dashboard
1. Go to your service on Render
2. Check the **"Events"** tab
3. Verify the latest commit hash matches: `f8f9bad`
4. If it shows an older commit, Render didn't auto-deploy

## Verify After Redeployment
Once deployed, test:
- https://smessage.onrender.com/api/debug-uploads (should show upload directory info)
- https://smessage.onrender.com (main app should still work)

## Common Issues

### Auto-Deploy Not Working?
1. Go to Render Dashboard → Your Service
2. Click **"Settings"**
3. Scroll to **"Build & Deploy"**
4. Make sure **"Auto-Deploy"** is set to **"Yes"**
5. Verify **"Branch"** is set to **"main"**

### Build Failing?
Check the **"Logs"** tab on Render to see build errors.
