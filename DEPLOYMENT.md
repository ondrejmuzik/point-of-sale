# Deployment Guide - Netlify

This guide covers deploying your Point of Sale app to Netlify with Supabase database integration.

## Prerequisites

Before deploying, make sure you have:

- ✅ Completed [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- ✅ Tested the app locally with your Supabase credentials
- ✅ Your Supabase project URL and anon key ready

## Deploy to Netlify

### Step 1: Push Your Code to GitHub (if not already done)

```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

### Step 2: Connect to Netlify

1. **Go to [netlify.com](https://netlify.com)**
   - Sign up or log in (you can use GitHub, GitLab, or email)

2. **Import Your Project**
   - Click "Add new site" → "Import an existing project"
   - Click "Deploy with GitHub" (or GitLab/Bitbucket)
   - Authorize Netlify to access your repositories
   - Select your point-of-sale-app repository

### Step 3: Configure Build Settings

Netlify should auto-detect your Vite app settings, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Base directory**: (leave empty)

### Step 4: Add Environment Variables

**IMPORTANT**: Before clicking "Deploy site", add your environment variables:

1. Click **"Show advanced"** button
2. Click **"New variable"**
3. Add the following variables:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://your-project.supabase.co` (your actual Supabase URL)

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGc...` (your actual Supabase anon key)

### Step 5: Deploy

1. Click **"Deploy site"**
2. Wait 1-2 minutes for the build to complete
3. Your app will be live at `https://random-name.netlify.app`

### Step 6: Rename Your Site (Optional)

1. Go to **Site settings** → **General** → **Site details**
2. Click **"Change site name"**
3. Choose a better name (e.g., `beverage-pos-2025`)
4. Your URL will become `https://beverage-pos-2025.netlify.app`

### Step 7: Add Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the DNS configuration instructions

---

## Updating Your Deployment

After your initial deployment, any push to GitHub will automatically trigger a new deploy:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify will automatically:
- Pull the latest code
- Run the build
- Deploy the updated app

You can monitor deployments in the Netlify dashboard under **Deploys** tab.

---

## Managing Environment Variables After Deployment

If you need to update your Supabase credentials:

1. Go to **Site settings** → **Environment variables**
2. Click on the variable you want to edit
3. Update the value
4. Click **"Save"**
5. **Trigger a new deploy**: Go to **Deploys** → **Trigger deploy** → **Deploy site**

---

## Alternative Deployment Platforms

### Option 1: Vercel

Vercel is built by the creators of Next.js and works great with Vite/React apps.

#### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

#### Step 2: Deploy via GitHub (Easiest Method)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign up/login with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Environment Variables**:
   - Before deploying, click "Environment Variables"
   - Add these variables:
     ```
     VITE_SUPABASE_URL = https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY = your-anon-key-here
     ```
   - Make sure to add them for all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Wait ~2 minutes for build to complete
   - Your app will be live at `your-project.vercel.app`

#### Step 3: Custom Domain (Optional)
- In Vercel dashboard → Settings → Domains
- Add your custom domain and follow DNS instructions

---

### Option 2: GitHub Pages (Free, but more setup)

⚠️ GitHub Pages doesn't support environment variables directly, so you'll need to build with the variables baked in.

#### Step 1: Create Production Environment File

Create `.env.production` in your project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Warning**: This file will be in your repository. Make sure to add it to `.gitignore` if your repo is public!

#### Step 2: Update package.json

Add a deploy script:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

#### Step 3: Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Step 4: Update vite.config.js

Add base path (replace `your-repo-name` with your GitHub repo name):

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Add this line
})
```

#### Step 5: Deploy

```bash
npm run deploy
```

Your app will be live at: `https://yourusername.github.io/your-repo-name/`

---

### Option 3: Traditional Web Hosting (cPanel, etc.)

#### Step 1: Build Your App Locally

1. Create `.env.production` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Build the app:
   ```bash
   npm run build
   ```

3. This creates a `dist` folder with all static files

#### Step 2: Upload to Your Hosting

1. Connect to your hosting via FTP/SFTP
2. Upload all contents of the `dist` folder to your public_html or web root
3. Make sure `.htaccess` is configured for single-page apps:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Post-Deployment Checklist

After deploying, verify everything works:

- [ ] App loads without errors
- [ ] Can create new orders
- [ ] Orders persist after page refresh
- [ ] Orders sync between multiple devices/browsers
- [ ] QR code payment modal works
- [ ] Statistics view shows correct data

## Updating Your Deployment (Other Platforms)

### For Vercel (auto-deploy from Git):
```bash
git add .
git commit -m "Your changes"
git push origin main
```
The platform will automatically rebuild and deploy.

### For GitHub Pages:
```bash
npm run deploy
```

### For Traditional Hosting:
```bash
npm run build
# Then upload the contents of 'dist' folder via FTP
```

---

## Environment Variables Reference

Your deployment needs these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | `eyJhbGc...` (long string) |

⚠️ **Important Notes**:
- Environment variables in Vite **must** start with `VITE_`
- Never commit `.env.local` to git (it's already in `.gitignore`)
- For production, use your hosting platform's environment variable settings
- The anon key is safe to expose publicly (it's called "public" key in Supabase)

---

## Troubleshooting Deployment Issues

### "Missing Supabase environment variables" after deployment

**Solution**: Environment variables not configured on hosting platform
- Go to Netlify dashboard → Site settings → Environment variables
- Add the missing variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
- Trigger a new deploy: Deploys → Trigger deploy → Deploy site

### App shows white screen after deployment

**Solution 1**: Check browser console for errors
- Open browser DevTools (F12)
- Look for CORS or network errors
- Verify Supabase credentials are correct

**Solution 2**: Check base path (for GitHub Pages)
- Make sure `vite.config.js` has correct `base` setting
- Verify the path matches your deployment URL

### Orders not saving in production

**Solution**: Check Supabase configuration
- Verify RLS (Row Level Security) policies are correct
- Check Supabase dashboard → Logs for errors
- Ensure environment variables are correct

### Different order numbers on different devices

**Solution**: This is expected initially
- The order number counter syncs through Supabase
- Each device increments from the last synced value
- Once synchronized, all devices will use consistent numbering

---

## Security Considerations

### Is it safe to expose Supabase keys?

✅ **Yes, the anon key is safe to expose** - it's designed to be public
- It only allows operations permitted by your RLS policies
- For this temporary event app with RLS disabled, it's fine
- For long-term production, enable RLS policies

### Recommendations for production:

1. **Enable Row Level Security** in Supabase
2. **Add proper policies** to restrict data access
3. **Consider authentication** if multiple users need different permissions
4. **Regular backups** of your Supabase data

---

## Performance Tips

### For Event Day:

1. **Test beforehand**: Deploy and test 1-2 days before your event
2. **Mobile data**: Ensure devices have good internet connection
3. **Supabase region**: Choose closest region to your event location
4. **Device browsers**: Use modern browsers (Chrome, Safari, Firefox)
5. **Add to home screen**: On mobile, add the app to home screen for full-screen experience

### Connection Reliability:

- Supabase has offline handling built-in
- If connection drops, operations will queue and retry
- Real-time sync will reconnect automatically

---

## Getting Help

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vite**: [vitejs.dev/guide](https://vitejs.dev/guide)

## Quick Start (TL;DR)

**For Netlify**:
1. Push to GitHub
2. Import on netlify.com → "Add new site" → "Import an existing project"
3. Configure build: `npm run build` and publish directory: `dist`
4. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) under "Show advanced"
5. Deploy
6. Done! 🎉

Your app will be live at `https://your-site-name.netlify.app`
