# ⚡ Quick Deployment Steps

## 🎯 TL;DR

### Backend → Railway
```bash
cd server
# Make sure server/.env has your API keys
railway login
railway init
railway up
# Copy the generated URL (e.g., https://xyz.up.railway.app)
```

### Frontend → Cloudflare Pages
```bash
# In root directory
# Create .env.production with:
echo "VITE_API_URL=https://your-railway-url.up.railway.app" > .env.production

# Test build
npm run build

# Push to GitHub
git add .
git commit -m "Deploy"
git push

# Then go to Cloudflare Dashboard:
# 1. Workers & Pages → Create → Pages → Connect Git
# 2. Build command: npm run build
# 3. Build output: dist
# 4. Add env var: VITE_API_URL = your Railway URL
# 5. Deploy!
```

---

## 📝 Checklist

### Before Deploying Backend:
- [ ] `server/.env` exists with `OPENAI_API_KEY` or `GEMINI_API_KEY`
- [ ] Railway account created
- [ ] Railway CLI installed: `npm i -g @railway/cli`

### Before Deploying Frontend:
- [ ] Backend deployed and URL copied
- [ ] `.env.production` created with `VITE_API_URL=<your-railway-url>`
- [ ] Code pushed to GitHub
- [ ] Cloudflare account created

### After Deployment:
- [ ] Test backend health: `curl https://your-railway.up.railway.app/health`
- [ ] Test frontend loads
- [ ] Test uploading resume and job description
- [ ] Test AI features (if API keys configured)

---

## 🔗 Important URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production (fill in after deployment)
- Frontend: `https://__________.pages.dev`
- Backend: `https://__________.up.railway.app`

---

## 🆘 Quick Fixes

### "Cannot connect to server"
1. Check Railway backend is running (check Railway dashboard)
2. Verify `VITE_API_URL` in Cloudflare Pages environment variables
3. Check browser console for exact error

### "CORS error"
Update `server/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-site.pages.dev', 'http://localhost:5173']
}));
```
Then redeploy backend.

### "AI features not working"
1. Check Railway environment variables have API keys
2. Check Railway logs for errors
3. Verify API keys are valid

---

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.
