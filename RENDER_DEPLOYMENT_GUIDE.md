# 🚀 Render Deployment Guide for AlgoTutorAI

## Overview
This guide will help you deploy your AlgoTutorAI backend to Render for FREE! Render offers 750 hours/month on their free tier, which is enough for 24/7 hosting.

## 🎯 **Why Render Instead of Railway?**

- ✅ **Free tier**: 750 hours/month (vs Railway's 30-day trial)
- ✅ **Auto-deploy**: Connects to GitHub for automatic updates
- ✅ **Custom domains**: Free SSL certificates
- ✅ **MongoDB support**: Perfect for your existing Atlas setup
- ✅ **No credit card required**: Truly free hosting

## 🚀 **Step 1: Prepare Your Repository**

Your repository is already prepared with:
- ✅ Working backend code
- ✅ MongoDB Atlas connection
- ✅ Environment variables configured
- ✅ `render.yaml` configuration file

## 🚀 **Step 2: Deploy to Render**

### 1. **Sign Up for Render**
- Go to [render.com](https://render.com)
- Sign up with your GitHub account
- No credit card required

### 2. **Create New Web Service**
- Click "New +" → "Web Service"
- Connect your GitHub repository: `RahulR30/AlgoTutorAI`
- Select the repository

### 3. **Configure the Service**
- **Name**: `algotutor-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### 4. **Set Environment Variables**
Click "Environment" tab and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### 5. **Deploy**
- Click "Create Web Service"
- Render will automatically build and deploy your app
- Wait for the build to complete (usually 2-5 minutes)

## 🌐 **Step 3: Update Frontend Configuration**

Once deployed, Render will give you a URL like:
`https://algotutor-backend.onrender.com`

Update your frontend API configuration to use this URL instead of localhost.

## 🔧 **Step 4: Test Your Deployment**

1. **Health Check**: Visit `https://algotutor-backend.onrender.com/api/health`
2. **Test API**: Try your endpoints
3. **Check Logs**: Monitor the deployment in Render dashboard

## 📱 **Step 5: Deploy Frontend to Vercel**

### 1. **Sign Up for Vercel**
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 2. **Import Repository**
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect it's a React app

### 3. **Configure Build**
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4. **Set Environment Variables**
Add your backend URL:
```
REACT_APP_API_URL=https://algotutor-backend.onrender.com
```

### 5. **Deploy**
- Click "Deploy"
- Vercel will build and deploy your frontend

## 🎉 **You're Done!**

Your AlgoTutorAI is now hosted for FREE on:
- **Backend**: Render (750 hours/month free)
- **Frontend**: Vercel (unlimited free hosting)
- **Database**: MongoDB Atlas (free tier)

## 🔄 **Automatic Updates**

Both Render and Vercel will automatically redeploy when you push to GitHub!

## 📊 **Monitoring**

- **Render Dashboard**: Monitor backend performance
- **Vercel Dashboard**: Monitor frontend performance
- **MongoDB Atlas**: Monitor database usage

## 💰 **Cost Breakdown**

- **Render Backend**: $0/month (free tier)
- **Vercel Frontend**: $0/month (free tier)
- **MongoDB Atlas**: $0/month (free tier)
- **Total**: $0/month! 🎉

## 🆘 **Troubleshooting**

### Common Issues:
1. **Build fails**: Check Render logs for errors
2. **Environment variables**: Ensure all required vars are set
3. **MongoDB connection**: Verify your Atlas connection string
4. **CORS issues**: Check CLIENT_URL environment variable

### Support:
- Render: Excellent documentation and support
- Vercel: Great community and documentation
- MongoDB Atlas: Comprehensive guides

---

**Your AlgoTutorAI is now ready for production deployment! 🚀**
