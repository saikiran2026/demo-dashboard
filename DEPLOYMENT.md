# GitHub Pages Deployment Guide

This SOC Dashboard is configured for automatic deployment to GitHub Pages using GitHub Actions.

## 🚀 Quick Deployment

### Option 1: Fork this Repository (Recommended)

1. **Fork this repository to your GitHub account**
   - Click the "Fork" button on the GitHub repository page
   - This creates a copy in your account

2. **Enable GitHub Pages**
   - Go to your forked repository
   - Navigate to `Settings` → `Pages`
   - Under "Source", select `GitHub Actions`
   - Save the settings

3. **Trigger Deployment**
   - The deployment happens automatically on every push to `main`
   - Or go to `Actions` tab and manually run the workflow

4. **Access Your Dashboard**
   - URL: `https://your-username.github.io/demo-dashboard/`
   - It may take a few minutes for the first deployment

### Option 2: Clone and Push to Your Repository

1. **Create a new repository on GitHub**
   - Name it `demo-dashboard` (or any name you prefer)
   - Make it public
   - Don't initialize with README

2. **Clone this repository and push to yours**
   ```bash
   git clone https://github.com/original-username/demo-dashboard.git
   cd demo-dashboard
   git remote set-url origin https://github.com/your-username/demo-dashboard.git
   git push -u origin main
   ```

3. **Enable GitHub Pages** (same as Option 1, step 2)

## 🔧 Configuration Details

### Repository Settings Required

1. **GitHub Pages Source**: GitHub Actions
2. **Repository visibility**: Public (required for free GitHub Pages)
3. **Actions permissions**: Enabled

### Automatic Features

- ✅ **Auto-deployment** on every push to main branch
- ✅ **Static optimization** with Next.js export
- ✅ **Asset optimization** for fast loading
- ✅ **Custom 404 page** with SOC branding
- ✅ **Mobile responsive** design

## 📁 Build Output

When deployed, the dashboard generates:
- **Static HTML/CSS/JS files** (no server required)
- **Optimized assets** for fast loading
- **SEO-friendly** structure
- **Progressive Web App** features

## 🛠️ Local Testing

Test the production build locally:

```bash
# Build for production
npm run build

# Serve the static files locally (requires Python or a static server)
cd out
python -m http.server 8000
# Or using Node.js
npx serve .
```

Then visit: `http://localhost:8000`

## 🔍 Troubleshooting

### Common Issues

1. **404 on deployed site**
   - Check if GitHub Pages is enabled
   - Verify the repository is public
   - Ensure the workflow ran successfully

2. **Assets not loading**
   - Check the `basePath` configuration in `next.config.js`
   - Verify the repository name matches the config

3. **Workflow failing**
   - Check Actions tab for error logs
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

### Customization

To change the deployment path, update `next.config.js`:

```javascript
basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '',
```

## 🌟 Features Available in Deployed Version

- **500+ Security Alerts** with full management capabilities
- **2000+ Log Entries** with advanced filtering
- **150+ Security Cases** with investigation workflows
- **Real-time Dashboards** with interactive charts
- **Professional SOC Interface** matching industry standards

## 📊 Performance

- **Build time**: ~30-60 seconds
- **Deploy time**: ~2-3 minutes
- **Page load**: <2 seconds (optimized assets)
- **Bundle size**: ~200KB (gzipped)

## 🔒 Security Notes

- All data is synthetic/simulated (no real security data)
- Client-side only (no backend/database required)
- No sensitive information exposed
- Safe for public deployment

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify your repository settings
3. Test the build locally first
4. Review the troubleshooting section above

Your SOC Dashboard will be live at:
**https://your-username.github.io/demo-dashboard/** 