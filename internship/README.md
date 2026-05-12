# 🎓 Internship Provider — Rwanda TVET Board

Rwanda's premier TVET internship placement platform.  
**Stack:** React 18 + Vite · Tailwind CSS · Node.js · Express · MySQL

---

## 🚀 Local Development

### Prerequisites
- Node.js v18+
- XAMPP (MySQL on port 3306)

### 1 — Database
Open phpMyAdmin → Import `database.sql`  
*(Creates `internship_provider` database with all tables and seed data)*

### 2 — Backend
```bash
cd internship
npm install
npm run dev        # http://localhost:5000
```

### 3 — Frontend
```bash
cd internship/client
npm install
npm run dev        # http://localhost:3000
```

---

## ☁️ Deployment Guide

### Architecture
```
Vercel (Frontend)  ──→  Render (Backend API)  ──→  PlanetScale/Railway (MySQL)
```

---

## 🗄️ Step 1 — Free MySQL Database (PlanetScale or Railway)

### Option A — PlanetScale (recommended, free tier)
1. Go to https://planetscale.com → Sign up free
2. Create database → name it `internship_provider`
3. Go to **Connect** → choose **Node.js** → copy the connection string
4. Run `database.sql` in the PlanetScale console (copy-paste the SQL)

### Option B — Railway
1. Go to https://railway.app → Sign up free
2. New Project → Add MySQL
3. Copy the connection details from the Variables tab
4. Connect with a MySQL client and run `database.sql`

---

## 🖥️ Step 2 — Deploy Backend to Render

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/internship-provider.git
git push -u origin main
```

2. Go to https://render.com → Sign up free → **New Web Service**

3. Connect your GitHub repo

4. Configure the service:
   | Setting | Value |
   |---------|-------|
   | **Name** | `internship-provider-api` |
   | **Root Directory** | `internship` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

5. Add **Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=your-planetscale-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=internship_provider
   DB_PORT=3306
   JWT_SECRET=your_super_secret_key_min_32_chars
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-app.vercel.app
   ```

6. Click **Deploy** — Render gives you a URL like:  
   `https://internship-provider-api.onrender.com`

7. Test it:  
   `https://internship-provider-api.onrender.com/health`

---

## 🌐 Step 3 — Deploy Frontend to Vercel

1. Go to https://vercel.com → Sign up free → **New Project**

2. Import your GitHub repo

3. Configure:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `internship/client` |
   | **Framework Preset** | `Vite` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. Add **Environment Variable**:
   ```
   VITE_API_URL=https://internship-provider-api.onrender.com
   ```
   *(Use your actual Render URL from Step 2)*

5. Click **Deploy** — Vercel gives you a URL like:  
   `https://internship-provider.vercel.app`

6. Go back to **Render** → update `CLIENT_URL` to your Vercel URL → Redeploy

---

## 🔄 Step 4 — Update CORS After Deployment

In Render environment variables, set:
```
CLIENT_URL=https://internship-provider.vercel.app
```
*(Replace with your actual Vercel URL)*

---

## ✅ Verify Deployment

| Check | URL |
|-------|-----|
| Backend health | `https://your-api.onrender.com/health` |
| Public internships | `https://your-api.onrender.com/api/internships/public` |
| Frontend | `https://your-app.vercel.app` |

---

## 🔐 Login Credentials

**Login tab:** `Company / Admin`

| Company | Email | Password | Role |
|---------|-------|----------|------|
| Rwanda TVET Board | `admin@internshipprovider.rw` | `Admin@1234` | **Admin** |
| MTN Rwanda | `hr@mtn.rw` | `Admin@1234` | Company |
| Bank of Kigali | `hr@bk.rw` | `Admin@1234` | Company |
| Kigali Heights | `hr@kigaliheights.rw` | `Admin@1234` | Company |
| RwandAir | `hr@rwandair.com` | `Admin@1234` | Company |
| Marriott Kigali | `hr@marriott.rw` | `Admin@1234` | Company |
| Andela Rwanda | `hr@andela.rw` | `Admin@1234` | Company |
| Rwanda Broadcasting | `hr@rba.rw` | `Admin@1234` | Company |
| Volkswagen Rwanda | `hr@vw.rw` | `Admin@1234` | Company |
| Inzuki Designs | `hr@inzuki.rw` | `Admin@1234` | Company |
| REG Rwanda | `hr@reg.rw` | `Admin@1234` | Company |

---

## 📁 Project Structure

```
internship/
├── server.js              ← Express API (Render)
├── .env                   ← Local env (never commit)
├── .env.example           ← Template for production env vars
├── .gitignore
├── database.sql           ← MySQL schema + seed data
├── config/database.js
├── controllers/
├── middleware/auth.js
├── models/
├── routes/
├── uploads/cvs/
└── client/                ← React + Vite (Vercel)
    ├── index.html
    ├── vite.config.mjs
    ├── vercel.json        ← SPA routing for Vercel
    ├── .env.development   ← Local dev env
    ├── .env.production    ← Production env (never commit)
    └── src/
```

---

## 🎓 TVET Trades (12 trades × 3 levels = 36 internships)

| Code | Trade |
|------|-------|
| NIT | Networking and Internet Technology |
| SOD | Software Development |
| BDC | Building and Construction |
| CSA | Computer System and Architecture |
| FBO | Food and Beverage Operations |
| MMP | Multimedia and Production |
| ACC | Accounting |
| ETE | Electronics and Telecommunication |
| MAT | Mechanics Automobile Technology |
| FST | Fashion and Garment Technology |
| ELT | Electricity |
| TRH | Tourism and Hospitality |
