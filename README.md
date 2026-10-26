# 🎓 AI Chatbot for College Enquiry

> A complete, production-ready, full-stack web application designed for prospective students, parents, and college administrators. Delivers 24/7 automated conversational enquiry assistance on college admissions, academic courses, fee structures, merit scholarships, hostel accommodation, and campus placements.

---

## 🌟 Key Highlights

- **24/7 Grounded AI Conversational Assistant**: Integrates with Google Gemini / OpenAI with Retrieval-Augmented Generation (RAG) strictly grounded in verified database records.
- **Zero Hallucination Guarantee**: Strictly prevents invented fees or deadlines. When unverified, gracefully guides users to administrative contact channels.
- **Resilient Fallback Mode (Demo / Offline)**: Features intelligent database-grounded demo mode if an external AI API key is not supplied, labeled with transparency.
- **Role-Based Access Control**: Secure JWT authentication and bcrypt password hashing with separated roles for students and college administrators.
- **Interactive Student Dashboard**: Enables students to track past conversational sessions, view verified responses, and monitor official contact enquiries.
- **Executive Admin Control Center**: Provides live analytical metrics, interactive course management, institutional knowledge base editor, FAQ management, and contact enquiry review with resolution notes.
- **Mobile-First Responsive Interface**: Built with Tailwind CSS, Lucide icons, glassmorphism, responsive navigation drawers, and light/dark theme toggle.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Lucide React, Axios |
| **Backend** | Node.js (v18+), Express.js (v4.21), REST API architecture |
| **Database** | MongoDB (Local Service or MongoDB Atlas cloud cluster), Mongoose |
| **AI / RAG** | Google Gemini API (`@google/genai` / REST) / OpenAI API / Grounded Database Retriever |
| **Security** | JSON Web Tokens (JWT), bcryptjs, Helmet, CORS, Express-Rate-Limit |

---

## 📁 Repository Structure

```text
FSD project/
│
├── frontend/                     # React + Vite Single-Page Application
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProtectedRoute
│   │   ├── context/              # AuthContext, ThemeContext, ChatContext
│   │   ├── pages/                # Home, Chatbot, Courses, Admissions, Contact, Login, Register, Dashboards
│   │   ├── services/             # Axios API client with auth interceptors
│   │   ├── App.jsx               # Router & Theme configuration
│   │   ├── main.jsx              # DOM entry point
│   │   └── index.css             # Tailwind design system & utilities
│   ├── public/                   # SVG Favicon & static assets
│   ├── index.html                # SEO metadata & Google Fonts
│   ├── tailwind.config.js        # Color palette & custom animations
│   ├── package.json
│   └── .env.example
│
├── backend/                      # Express.js REST API Server
│   ├── src/
│   │   ├── config/               # Database connection & Environment loader
│   │   ├── controllers/          # Auth, Course, FAQ, Chat, Enquiry, Admin controllers
│   │   ├── middleware/           # Auth, Role authorization, Rate limiters, Error handler
│   │   ├── models/               # User, Course, CollegeInfo, FAQ, ChatConversation, Enquiry, KnowledgeItem
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Multi-provider AI service & RAG database retriever
│   │   ├── app.js                # Express app setup, middlewares, healthcheck
│   │   └── server.js             # HTTP server bootstrap & graceful shutdown
│   ├── scripts/
│   │   ├── seed.js               # Database seeder (Courses, FAQs, Admin, Student)
│   │   └── testEndpoints.js      # Automated end-to-end API test suite
│   ├── package.json
│   └── .env.example
│
└── README.md                     # Comprehensive project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: Local MongoDB community service running at `mongodb://127.0.0.1:27017` OR a free MongoDB Atlas connection URI.

---

### 2. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` as needed:*
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/college_enquiry_db
   JWT_SECRET=super_secret_college_enquiry_jwt_key_2026_dev_env_unique
   FRONTEND_URL=http://localhost:5173

   # Optional Live AI: Enter your Gemini key to enable live generation
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: If `GEMINI_API_KEY` is not provided, the application runs seamlessly in Grounded Database Demo Mode).*

4. Seed the database with verified sample courses, FAQs, and accounts:
   ```bash
   npm run seed
   ```

5. Run automated API integration tests:
   ```bash
   npm run test:api
   ```

6. Start backend development server:
   ```bash
   npm start
   ```
   *Backend runs on `http://localhost:5000`. Health check available at `http://localhost:5000/api/health`.*

---

### 3. Frontend Setup

1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Contents of `frontend/.env`:*
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend opens at `http://localhost:5173`.*

---

## 🔑 Demo Credentials

For quick evaluation and testing, 1-click buttons are provided on the Login page:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Student** | `student@apex.edu` | `Student@12345` | Student Dashboard, Chat History, Contact Tracking |
| **Administrator** | `admin@apex.edu` | `Admin@12345` | Full Admin Control Center (Courses, Info, FAQs, Enquiries, RAG) |

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create new student account (or admin with setup key)
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/me` - Retrieve authenticated user profile `[Bearer Auth]`

### Chatbot & RAG
- `POST /api/chat` - Send user message, retrieve grounded database context, and generate answer
- `GET /api/chat/history` - Retrieve student conversation history
- `GET /api/chat/history/:id` - Retrieve full conversation transcript
- `DELETE /api/chat/history/:id` - Delete conversation session
- `DELETE /api/chat/history` - Clear all conversations for authenticated user

### Courses
- `GET /api/courses` - Search and filter courses by keyword and department
- `GET /api/courses/departments` - List unique course departments
- `GET /api/courses/:id` - Fetch single course details
- `POST /api/courses` - Add new course `[Admin Only]`
- `PUT /api/courses/:id` - Update course `[Admin Only]`
- `DELETE /api/courses/:id` - Remove course `[Admin Only]`

### College Information
- `GET /api/college-info` - Get official college singleton data (admissions, fees, hostel, placements)
- `PUT /api/college-info` - Update institutional information `[Admin Only]`

### FAQs
- `GET /api/faqs` - List FAQs with category and search filters
- `PATCH /api/faqs/:id/click` - Increment question inquiry counter
- `POST /api/faqs` - Create FAQ `[Admin Only]`
- `PUT /api/faqs/:id` - Edit FAQ `[Admin Only]`
- `DELETE /api/faqs/:id` - Delete FAQ `[Admin Only]`

### Contact Enquiries
- `POST /api/enquiries` - Submit public contact enquiry
- `GET /api/enquiries` - View submissions `[Admin / Authenticated Student]`
- `PATCH /api/enquiries/:id` - Update status and add internal resolution note `[Admin Only]`
- `DELETE /api/enquiries/:id` - Delete enquiry `[Admin Only]`

### Admin & Analytics
- `GET /api/admin/analytics` - Summary metrics, inquiry category breakdown, top FAQs `[Admin Only]`
- `GET /api/admin/knowledge` - Manage RAG knowledge base items `[Admin Only]`

---

## 🌐 Deployment Instructions

### 1. Frontend on Vercel
1. Push project to GitHub.
2. In Vercel, import the repository and set Root Directory to `frontend`.
3. Framework Preset: `Vite`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com/api`
5. Deploy.

### 2. Backend on Render
1. Create a **Web Service** on Render connected to the repository.
2. Root Directory: `backend`.
3. Environment: `Node`.
4. Build Command: `npm install`.
5. Start Command: `npm start`.
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.mongodb.net/college_enquiry_db?retryWrites=true&w=majority`
   - `JWT_SECRET` = `your_strong_32_character_jwt_secret`
   - `FRONTEND_URL` = `https://your-frontend-app.vercel.app`
   - `GEMINI_API_KEY` = `your_gemini_api_key`

### 3. Database on MongoDB Atlas
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write privileges.
3. In Network Access, allow IP Access `0.0.0.0/0` (or Render's outbound IPs).
4. Copy the connection string and paste it into `MONGODB_URI`.
5. Run `npm run seed` once against the production database.

---

## 🛡️ Security Implementation
- **JWT Protection**: Secured with expiration tokens and Bearer verification.
- **Role Guard**: Strict middleware preventing regular users from hitting administrative endpoints.
- **Password Safety**: Stored as one-way salt-hashed bcrypt hashes (`saltRounds = 10`).
- **HTTP Protection**: Helmet security headers and CORS whitelisting.
- **Abuse Prevention**: Rate-limiting applied on authentication attempts and chatbot queries.
- **Safe Secrets**: Environment variables isolated in `.env` and never committed or exposed on client.

---

## 📜 Academic Notice
> **Notice**: Fictional sample college data (Apex Institute of Science & Technology) is provided for academic demonstration purposes.
