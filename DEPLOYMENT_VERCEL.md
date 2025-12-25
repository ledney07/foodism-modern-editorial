# Deploying to Vercel - Quick Guide

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to github.com
   - Click "New repository"
   - Name it: `foodism-modern-editorial`
   - Don't initialize with README (we already have files)
   - Click "Create repository"

2. **Push your code:**
   ```bash
   cd "/Users/ledney/Downloads/foodism-modern-editorial 2"
   git init
   git add .
   git commit -m "Initial commit - Foodism CA editorial platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/foodism-modern-editorial.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Go back to Vercel Dashboard**
   - Click "Add New..." → "Project"
   - You should now see your `foodism-modern-editorial` repository
   - Click "Import" next to it

2. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (should be auto-detected)
   - **Output Directory:** `dist` (should be auto-detected)
   - **Install Command:** `npm install` (should be auto-detected)
   - Click "Deploy"

3. **After Deployment:**
   - Go to your project settings
   - Navigate to "Storage" or "Databases"
   - Connect your Aurora PostgreSQL database
   - The environment variables will be automatically injected

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd "/Users/ledney/Downloads/foodism-modern-editorial 2"
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? foodism-modern-editorial
# - Directory? ./
# - Override settings? No
```

## Step 3: Connect Database

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Storage" or "Databases"
   - Find your Aurora PostgreSQL database
   - Click "Connect"
   - Select your project
   - Keep default prefix (or use "DATABASE")
   - Select environments (Development, Preview, Production)
   - Click "Connect"

## Step 4: Environment Variables

Vercel will automatically inject these environment variables:
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGSSLMODE`
- `AWS_ROLE_ARN`
- `AWS_REGION`

Your code is already configured to use these! ✅

## Step 5: Deploy Backend API (Optional)

If you want to deploy the backend API separately:

1. **Option 1: Deploy as Serverless Functions**
   - Vercel can host your Express API as serverless functions
   - Create `/api` folder with serverless function handlers
   - Or use the existing `/server` folder with proper configuration

2. **Option 2: Deploy to Separate Service**
   - Deploy backend to Railway, Render, or Fly.io
   - Update frontend API URL to point to backend

## Notes:

- **Frontend only:** The current setup will deploy your Vite + React frontend to Vercel
- **Backend:** For now, your backend can run locally or you can deploy it separately
- **Database:** Once connected, it will work with your deployed frontend

## Troubleshooting:

If you encounter issues:
1. Check build logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Ensure database connection is configured properly

