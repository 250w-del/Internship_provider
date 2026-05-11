# 🎓 Internship Provider — Rwanda TVET Board

Rwanda's premier TVET internship placement platform. Built with **React**, **Tailwind CSS**, **Node.js**, and **Express**.

---

## 🚀 Quick Start

### 1. Database Setup
1. Open **phpMyAdmin** or MySQL CLI
2. Run the SQL file:
   ```sql
   source database.sql
   ```
   Or import `database.sql` via phpMyAdmin.

### 2. Backend Setup
```bash
cd internship
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd internship/client
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

---

## 🔐 Default Admin Credentials

The admin logs in via the **Company** portal:

| Field    | Value                              |
|----------|------------------------------------|
| Email    | `admin@internshipprovider.rw`      |
| Password | `password` (bcrypt hash in DB)     |
| Role     | Select **Company / Admin**         |

> The system detects `is_admin = true` on the company account and grants admin access automatically.

---

## 🏗️ Project Structure

```
internship/
├── server.js              # Express server
├── .env                   # Environment variables
├── database.sql           # MySQL schema + seed data
├── config/
│   └── database.js        # MySQL connection pool
├── controllers/           # Route handlers
├── middleware/
│   └── auth.js            # JWT authentication
├── models/                # Database models
├── routes/                # API routes
├── uploads/cvs/           # Student CV uploads
└── client/                # React frontend
    ├── public/
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css       # Tailwind CSS
    │   ├── components/     # Reusable components
    │   ├── constants/      # Trades & levels data
    │   ├── context/        # Auth context
    │   ├── pages/          # Page components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Internships.jsx
    │   │   ├── student/    # Student dashboard
    │   │   ├── company/    # Company dashboard
    │   │   └── admin/      # Admin dashboard
    │   └── services/
    │       └── api.js      # Axios API service
    ├── tailwind.config.js
    └── package.json
```

---

## 🎓 TVET Trades Supported

| Code        | Trade Name                              | Levels    |
|-------------|------------------------------------------|-----------|
| NIT         | Network Infrastructure Technology        | L3, L4, L5 |
| SOD         | Software Development                     | L3, L4, L5 |
| FBO         | Finance & Banking Operations             | L3, L4, L5 |
| CSA         | Computer Systems Analysis                | L3, L4, L5 |
| ETE         | Electronics & Telecommunication Eng.     | L3, L4, L5 |
| BDC         | Business Development & Commerce          | L3, L4, L5 |
| Electricity | Electrical Installation & Maintenance    | L3, L4, L5 |
| Tourism     | Tourism & Hospitality Management         | L3, L4, L5 |
| Agriculture | Agriculture & Food Technology            | L3, L4, L5 |
| Construction| Construction Technology                  | L3, L4, L5 |
| Automotive  | Automotive Technology                    | L3, L4, L5 |
| Fashion     | Fashion & Garment Technology             | L3, L4, L5 |

---

## 🔑 User Roles

| Role    | Access                                                    |
|---------|-----------------------------------------------------------|
| Student | Browse & apply for internships matched to trade/level     |
| Company | Post internships, manage applications                     |
| Admin   | Approve/reject internships, manage users (logs in as company) |

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register/student` — Register student
- `POST /api/auth/register/company` — Register company
- `POST /api/auth/login` — Login (role: student | company)

### Public
- `GET /api/internships/public` — Browse approved internships (filter by trade/level)

### Student (requires JWT)
- `GET /api/students/profile`
- `PUT /api/students/profile`
- `POST /api/students/upload-cv`
- `GET /api/students/internships` — Matched internships
- `POST /api/students/apply`
- `GET /api/students/applications`

### Company (requires JWT)
- `GET/PUT /api/companies/profile`
- `POST /api/companies/internships`
- `GET /api/companies/internships`
- `GET /api/companies/internships/:id/applications`
- `PUT /api/companies/applications/:id/status`
- `DELETE /api/companies/internships/:id`

### Admin (requires JWT with admin role)
- `GET /api/admin/dashboard`
- `GET /api/admin/students`
- `GET /api/admin/companies`
- `GET /api/admin/internships/pending`
- `PUT /api/admin/internships/:id/approve`
- `PUT /api/admin/internships/:id/reject`
