# Job Queue System Setup Guide

This guide provides instructions to set up the Job Queue System (Node.js, Express, Supabase, Redis, BullMQ, React) locally and prepare it for production deployment.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v16 or higher)
- **Redis** (Local instance or docker container)
- **Git**

## 1. Local Development Setup

### A. Clone & Install Dependencies

Open a terminal and navigate to your project directory. Install dependencies for both the backend and frontend.

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### B. Environment Configuration

1. Create a `.env` file in the root backend directory.
2. Copy the contents of `.env.example` (the Local Environment section) into your newly created `.env` file.
3. Update the following values with your own keys:
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: Get these from your Supabase Project Settings > API.
   - `ACCESS_TOKEN_SECRET`: Generate a random string for JWT signing.
   - `REDIS_HOST` & `REDIS_PORT`: Default is `127.0.0.1` and `6379`. Make sure your local Redis server is running.

### C. Start the Services

You need three terminal windows to run the system locally.

**Terminal 1: Run the Backend API Server**
```bash
# From the root directory
node index.js
# Runs on http://localhost:3000
```

**Terminal 2: Run the Background Worker**
```bash
# From the root directory
node worker/job.worker.js
# Connects to Redis and listens for BullMQ jobs
```

**Terminal 3: Run the Frontend App**
```bash
# Navigate to the frontend directory
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 2. Production Deployment Setup

When moving to production, you will need managed services for your database and queue.

### A. Infrastructure Requirements
- **Database:** Supabase (Managed PostgreSQL).
- **Redis:** Upstash, Render Redis, or Railway Redis.
- **Backend Host:** Railway, Render, Fly.io, or Heroku.
- **Frontend Host:** Vercel or Netlify.

### B. Production Environment Variables
Set the following environment variables in your Backend Host (e.g., Railway/Render):

```env
NODE_ENV=production
PORT=3000

# Authentication
ACCESS_TOKEN_SECRET=your_secure_production_secret
ACCESS_TOKEN_EXPIRY=1d

# Supabase Production DB
SUPABASE_URL=https://your-production-app.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Managed Redis (Usually provided as a connection URL)
REDIS_URL=redis://default:yourpassword@your-managed-redis-url.com:6379
BULLMQ_QUEUE_NAME=production_jobs
```

### C. Deploying the Backend
Ensure your backend deployment commands start both the API server and the Worker. 

Depending on your host, you might need a `Procfile` or separate run commands. If your host allows multiple processes (like Railway or Render Background Workers), run them as two separate services:
1. **API Service:** `node index.js`
2. **Worker Service:** `node worker/job.worker.js`

### D. Deploying the Frontend
1. In your frontend hosting provider (e.g., Vercel), set the build command to `npm run build` and output directory to `dist`.
2. Ensure you update `frontend/src/api/index.js` to point to your live production backend URL instead of `http://localhost:3000`.

```javascript
// frontend/src/api/index.js
export const API_URL = 'https://your-live-backend-url.com/api/v1'; 
```
