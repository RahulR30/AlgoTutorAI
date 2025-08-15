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

**IMPORTANT**: Make sure you select "Web Service" and NOT "Static Site" or "Background Worker"

### 3. **Configure the Service**
- **Name**: `algotutor-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

**Important**: These commands are set during service creation, not after!

### 4. **Set Environment Variables**
Click "Environment" tab and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/algotutor-ai?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLIENT_URL=https://your-frontend-domain.vercel.app
```

**Important Notes:**
- **MONGODB_URI**: Get this from your MongoDB Atlas dashboard
- **JWT_SECRET**: Generate a random string (at least 32 characters)
- **CLIENT_URL**: Update this after you deploy your frontend to Vercel

**To generate a JWT_SECRET, run this in your terminal:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
This will generate a secure 128-character random string.

### 5. **Deploy**
- Click "Create Web Service"
- Render will automatically build and deploy your app
- Wait for the build to complete (usually 2-5 minutes)

## 🔧 **Step-by-Step Render Setup**

### **Step 1: Create Service**
1. Click "New +" button
2. Select **"Web Service"** (NOT Static Site!)
3. Connect your GitHub repo
4. Select `RahulR30/AlgoTutorAI`

### **Step 2: Configure Service**
1. **Name**: `algotutor-backend`
2. **Environment**: Should show "Node" (not Docker)
3. **Region**: Choose closest to you
4. **Branch**: `main`
5. **Build Command**: `cd backend && npm install`
6. **Start Command**: `cd backend && npm start`

### **Step 3: Set Environment Variables**
After creating the service:
1. **Go to your service dashboard**
2. **Click "Environment" tab**
3. **Click "Add Environment Variable"**
4. **Add each variable one by one**

## 🌐 **Step 3: Update Frontend Configuration**

Once deployed, Render will give you a URL like:
`https://algotutor-backend.onrender.com`

Update your frontend API configuration to use this URL instead of localhost.

## 🔧 **Step 4: Test Your Deployment**

1. **Health Check**: Visit `https://algotutor-backend.onrender.com/api/health`
2. **Test API**: Try your endpoints
3. **Check Logs**: Monitor the deployment in Render dashboard

## 📱 **Step 4: Deploy Frontend to Vercel**

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
1. **Docker error**: If you see "failed to read dockerfile", make sure you selected "Web Service" and not "Static Site"
2. **Build fails**: Check Render logs for errors
3. **Environment variables**: Ensure all required vars are set
4. **MongoDB connection**: Verify your Atlas connection string
5. **CORS issues**: Check CLIENT_URL environment variable

### **If You Still Get Docker Errors:**
1. **Delete the service** you just created
2. **Start over** and make sure to select "Web Service"
3. **Verify** the environment shows "Node" not "Docker"
4. **Check** that you're not in the wrong section of Render

### Support:
- Render: Excellent documentation and support
- Vercel: Great community and documentation
- MongoDB Atlas: Comprehensive guides

---

**Your AlgoTutorAI is now ready for production deployment! 🚀**
