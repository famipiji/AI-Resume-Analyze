# 🚀 Deployment Guide

## Overview
This guide will help you deploy:
- **Frontend** → Cloudflare Pages
- **Backend** → Railway

---

## 📦 Part 1: Deploy Backend to Railway

### Step 1: Prepare Your Backend
1. Make sure your `.env` file in the `server` folder has all required variables:
   ```env
   OPENAI_API_KEY=your_openai_key_here
   GEMINI_API_KEY=your_gemini_key_here
   PORT=3001
   ```

### Step 2: Create Railway Account
1. Go to [Railway.app](https://railway.app/)
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended)

### Step 3: Deploy to Railway

#### Option A: Deploy from GitHub (Recommended)
1. Push your code to GitHub:
   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. In Railway:
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository
   - Railway will auto-detect it's a Node.js project

#### Option B: Deploy via Railway CLI
1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   cd server
   railway login
   railway init
   railway up
   ```

### Step 4: Configure Environment Variables in Railway
1. In your Railway project dashboard
2. Go to **"Variables"** tab
3. Add these variables:
   - `OPENAI_API_KEY` = your OpenAI API key
   - `GEMINI_API_KEY` = your Gemini API key (optional)
   - `PORT` = 3001 (Railway will override this automatically)

### Step 5: Get Your Backend URL
1. Go to **"Settings"** tab
2. Under **"Domains"**, click **"Generate Domain"**
3. Copy the generated URL (e.g., `https://your-app.up.railway.app`)
4. **Save this URL** - you'll need it for the frontend!

### Step 6: Update CORS Settings (if needed)
If you get CORS errors later, update `server/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.pages.dev', 'http://localhost:5173'],
  credentials: true
}));
```

---

## 🌐 Part 2: Deploy Frontend to Cloudflare Pages

### Step 1: Update Environment Variable
1. Create a `.env.production` file in the root directory:
   ```env
   VITE_API_URL=https://your-app.up.railway.app
   ```
   ⚠️ Replace `your-app.up.railway.app` with your actual Railway URL!

### Step 2: Test Build Locally
```bash
npm install
npm run build
```
This creates a `dist` folder with your production build.

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 4: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **"Workers & Pages"** from the left sidebar
3. Click **"Create application"** → **"Pages"** → **"Connect to Git"**
4. Authorize GitHub and select your repository
5. Configure build settings:
   - **Project name**: Choose a name (e.g., `resume-analyzer`)
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

6. Click **"Environment variables (advanced)"**
   - Add variable: `VITE_API_URL` = `https://your-app.up.railway.app`

7. Click **"Save and Deploy"**

### Step 5: Wait for Deployment
- Cloudflare will build and deploy your site
- This takes about 1-3 minutes
- You'll get a URL like: `https://resume-analyzer.pages.dev`

---

## ✅ Part 3: Verify Deployment

### Test Your Backend
```bash
curl https://your-app.up.railway.app/health
```
Should return: `{"status":"ok"}`

### Test Your Frontend
1. Open your Cloudflare Pages URL
2. Upload a resume and job description
3. Click "Analyze Match"
4. Check if the analysis works

### Common Issues

#### ❌ CORS Error
**Solution**: Update `server/index.js` with your Cloudflare Pages URL in CORS settings

#### ❌ API Connection Failed
**Solution**:
- Check that `VITE_API_URL` in Cloudflare Pages matches your Railway URL
- Ensure Railway backend is running (check Railway logs)

#### ❌ AI Features Not Working
**Solution**:
- Verify environment variables in Railway dashboard
- Check that `OPENAI_API_KEY` or `GEMINI_API_KEY` is set correctly

---

## 🔄 Future Updates

### Update Backend
```bash
cd server
git add .
git commit -m "Update backend"
git push
```
Railway will auto-deploy (if connected to Git)

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push
```
Cloudflare Pages will auto-deploy

---

## 📊 Monitor Your Apps

### Railway (Backend)
- Dashboard: https://railway.app/project/YOUR_PROJECT_ID
- View logs, metrics, and usage

### Cloudflare Pages (Frontend)
- Dashboard: https://dash.cloudflare.com/
- View deployment history, analytics, and build logs

---

## 💰 Pricing

### Railway
- **Free Trial**: $5 credit (no credit card required)
- **Pro Plan**: $5/month/member + usage-based pricing
- Your app: ~$0-10/month depending on traffic

### Cloudflare Pages
- **Free Tier**:
  - Unlimited sites
  - Unlimited bandwidth
  - 500 builds/month
- **Paid**: $20/month for more builds (likely not needed)

---

## 🎉 You're Done!

Your Resume Analyzer is now live:
- **Frontend**: `https://your-site.pages.dev`
- **Backend**: `https://your-app.up.railway.app`

Share your frontend URL with others to use your app!
