# 🚂 Railway Deployment Setup Guide

## Step 1: Go to Railway.app
1. Visit [railway.app](https://railway.app)
2. Sign in with your GitHub account

## Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **AlgoTutorAI** repository
4. Select the **`backend`** folder as the source

## Step 3: Set Environment Variables (CRITICAL!)

Once your project is created, you MUST set these environment variables:

### In Railway Dashboard:
1. Click on your project
2. Go to **"Variables"** tab
3. Click **"New Variable"** for each one:

### Required Variables:

#### 1. MONGODB_URI
- **Name:** `MONGODB_URI`
- **Value:** `mongodb+srv://algotutor-user:your-password@cluster.mongodb.net/algotutor-ai?retryWrites=true&w=majority`
- **Replace:** `your-password` with your actual MongoDB Atlas password

#### 2. JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** `algotutor-super-secret-key-2024-deployment`

#### 3. NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`

#### 4. CLIENT_URL
- **Name:** `CLIENT_URL`
- **Value:** `https://your-vercel-app-url.vercel.app`
- **Replace:** `your-vercel-app-url` with your actual Vercel URL

## Step 4: Deploy
1. Railway will automatically detect it's a Node.js app
2. It will install dependencies and start your server
3. You'll get a URL like: `https://your-app-name.railway.app`

## Step 5: Test Health Check
1. Visit: `https://your-app-name.railway.app/api/health`
2. You should see: `{"status":"OK","message":"AlgoTutorAI Server is running"}`

## Step 6: Update Frontend
1. Go to your **Vercel dashboard**
2. Go to **Project Settings** → **Environment Variables**
3. Add: `REACT_APP_API_URL` = `https://your-app-name.railway.app`

## 🔍 Troubleshooting

### If Health Check Fails:
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure MongoDB Atlas is accessible

### Common Issues:
- **MONGODB_URI wrong**: Check your MongoDB Atlas connection string
- **Missing variables**: All 4 variables must be set
- **Network issues**: Make sure Railway can reach MongoDB Atlas

## 📱 Your URLs After Setup:
- **Frontend:** `https://your-app-name.vercel.app`
- **Backend:** `https://your-app-name.railway.app`
- **Health Check:** `https://your-app-name.railway.app/api/health`

## 🎯 What This Will Fix:
✅ Problems will load on your live website
✅ Database connection will work
✅ Full functionality will be available
✅ Users can solve coding problems online

---

**Need Help?** Check the Railway logs for specific error messages!
