# 🎓 Internship Provider — Rwanda TVET Board

Rwanda's premier TVET internship placement platform.  
**Stack:** React 18 + Vite · Tailwind CSS · Node.js · Express · MySQL

---

## 🚀 How to Run

### Prerequisites
- Node.js v18+
- XAMPP (MySQL running on port 3306)

### 1 — Start MySQL
Open XAMPP Control Panel and start **MySQL**.

### 2 — Setup Database
Open phpMyAdmin → Import → select `internship/database.sql`  
*(Database `internship_provider` will be created automatically)*

### 3 — Start Backend
```bash
cd internship
npm install        # first time only
npm run dev        # runs on http://localhost:5000
```

### 4 — Start Frontend
```bash
cd internship/client
npm install        # first time only
npm run dev        # runs on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🔐 Login Credentials

### Admin (via Company portal)
| Field    | Value                           |
|----------|---------------------------------|
| Email    | `admin@internshipprovider.rw`   |
| Password | `Admin@1234`                    |
| Tab      | **Company / Admin**             |

### Student / Company
Register a new account at `/register`

---

## 👥 User Roles

| Role    | What they can do |
|---------|-----------------|
| **Student** | Browse internships matched to their trade & level, apply, upload CV |
| **Company** | Post internships (pending admin approval), manage applications |
| **Admin** | Approve/reject internships, manage all students & companies |

---

## 🎓 TVET Trades & Levels

| Code | Trade | Levels |
|------|-------|--------|
| NIT | Network Infrastructure Technology | L3, L4, L5 |
| SOD | Software Development | L3, L4, L5 |
| FBO | Finance & Banking Operations | L3, L4, L5 |
| CSA | Computer Systems Analysis | L3, L4, L5 |
| ETE | Electronics & Telecommunication Engineering | L3, L4, L5 |
| BDC | Business Development & Commerce | L3, L4, L5 |
| Electricity | Electrical Installation & Maintenance | L3, L4, L5 |
| Tourism | Tourism & Hospitality Management | L3, L4, L5 |
| Agriculture | Agriculture & Food Technology | L3, L4, L5 |
| Construction | Construction Technology | L3, L4, L5 |
| Automotive | Automotive Technology | L3, L4, L5 |
| Fashion | Fashion & Garment Technology | L3, L4, L5 |

---

## � Project Structure

```
internship/
├── server.js              ← Express API server (port 5000)
├── .env                   ← Environment config
├── database.sql           ← MySQL schema + seed data
├── config/database.js     ← MySQL connection
├── controllers/           ← Route logic
├── middleware/auth.js     ← JWT authentication
├── models/                ← Database models
├── routes/                ← API routes
├── uploads/cvs/           ← Student CV uploads
└── client/                ← React + Vite frontend (port 3000)
    ├── index.html
    ├── vite.config.mjs
    ├── tailwind.config.cjs
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/    ← Navbar, Footer, InternshipCard, etc.
        ├── constants/     ← TVET trades & levels data
        ├── context/       ← Auth context (JWT state)
        ├── pages/         ← Home, Login, Register, Internships
        │   ├── student/   ← Student dashboard, profile, applications
        │   ├── company/   ← Company dashboard, profile, applications
        │   └── admin/     ← Admin dashboard
        └── services/api.js ← Axios API client
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/internships/public` | None | Browse approved internships |
| POST | `/api/auth/register/student` | None | Register student |
| POST | `/api/auth/register/company` | None | Register company |
| POST | `/api/auth/login` | None | Login (role: student/company) |
| GET | `/api/students/internships` | Student | Matched internships |
| POST | `/api/students/apply` | Student | Apply for internship |
| GET | `/api/students/applications` | Student | My applications |
| POST | `/api/companies/internships` | Company | Post internship |
| GET | `/api/admin/dashboard` | Admin | Stats overview |
| PUT | `/api/admin/internships/:id/approve` | Admin | Approve internship |
