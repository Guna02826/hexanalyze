# HexAnalyze — AI Resume Analyzer

![HexAnalyze](https://via.placeholder.com/1200x600?text=HexAnalyze+-+AI+Resume+Analyzer)

**Live Demo:** [https://hexanalyze.netlify.app](https://hexanalyze.netlify.app)

HexAnalyze is a full-stack web application that allows users to upload a resume (PDF) and paste a job description to receive a structured ATS (Applicant Tracking System) analysis. Powered by the Gemini API, it provides a matching score, identified skills, missing keywords, and section-by-section feedback to help users tailor their resumes for specific roles.

## 🚀 Features

- **AI-Powered ATS Scoring:** Uses Google's Gemini API (`gemini-1.5-flash`) to generate structured, actionable feedback comparing a resume against a target job description.
- **Secure File Storage:** Securely stores uploaded PDF resumes in the cloud using Cloudinary.
- **User Authentication:** Complete authentication system with JWT (JSON Web Tokens), secure HTTP-only cookies, and hashed passwords.
- **Dashboard & History:** Users have a personal dashboard tracking their analysis history and overall statistics (average score, total analyses).
- **Security First:** Implements robust security measures including daily rate limiting (to prevent API abuse), `helmet` for HTTP headers, CORS, and `express-validator` for input sanitization.
- **Client-Side Validation:** Ensures a smooth user experience with robust form validation using `Zod` and `React Hook Form`.

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Redux Toolkit (State Management)
- React Router v6
- Tailwind CSS
- Axios
- React Hook Form + Zod
- React Dropzone

**Backend:**
- Node.js & Express with TypeScript
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Multer (Memory Storage)
- pdf-parse (Text Extraction)
- `@google/generative-ai` (Gemini SDK)
- Cloudinary (Cloud Storage)

**Testing & CI/CD:**
- Jest & Supertest (Backend Tests)
- GitHub Actions (Automated CI Pipeline)

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Cloudinary account credentials
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hexanalyze.git
cd hexanalyze
```

### 2. Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```
Run the development server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Run the development server:
```bash
npm run dev
```

## 🧪 Testing

The backend includes a comprehensive test suite covering authentication, the analysis flow, and rate limiting.

```bash
cd server
npm test
```

## 🔒 Security Measures

- **Rate Limiting:** Global rate limiting (100 req/15min) and specific application-level daily limits per user for the AI analysis endpoint to prevent abuse.
- **Helmet & CORS:** Configured to secure HTTP headers and restrict cross-origin requests to trusted domains.
- **Input Sanitization:** Backend uses `express-validator` and frontend uses `Zod` to prevent malicious inputs and guarantee data integrity.
- **Secure Auth:** JWTs are issued for access, with sensitive refresh operations or password hashes kept strictly on the backend.
