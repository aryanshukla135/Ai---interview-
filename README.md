# Interview AI

Interview AI generates personalized interview preparation plans from a job description and a candidate profile.

## Features

- User registration, login, logout, and protected routes
- PDF resume upload and text extraction
- Self-description input when a resume is not available
- AI-generated technical and behavioral questions
- Skill-gap analysis and match score
- Preparation roadmap
- Recent interview plan history
- AI-generated resume PDF download
- Responsive dark-themed React interface

## Tech stack

- Frontend: React, React Router, Vite, Sass, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- AI: Google GenAI
- PDF processing: `pdf-parse` and Puppeteer

## Project structure

```text
Backend/
  server.js
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
Frontend/
  src/
    features/auth/
    features/interview/
```

## Requirements

- Node.js 18 or newer
- A MongoDB database
- A Google GenAI API key

## Local setup

### Backend

```powershell
cd Backend
npm install
Copy-Item .env.example .env
```

Edit `Backend/.env` with your own values:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-master
JWT_SECRET=replace_with_a_long_random_secret
GOOGLE_GENAI_API_KEY=replace_with_your_google_genai_api_key
NODE_ENV=development
```

Start the backend:

```powershell
npm run dev
```

The API runs on `http://localhost:3000`.

### Frontend

```powershell
cd Frontend
npm install
npm run dev
```

The frontend runs on the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Main API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Log in and receive an HTTP-only cookie |
| `GET` | `/api/auth/get-me` | Get the current user |
| `GET` | `/api/auth/logout` | Log out |
| `POST` | `/api/interview` | Generate an interview report |
| `GET` | `/api/interview` | List the current user's reports |
| `GET` | `/api/interview/report/:id` | Get one report |
| `GET` | `/api/interview/report/:id/pdf` | Generate and download a PDF |

Interview generation uses `multipart/form-data`:

- `jobDescription` — required text
- `selfDescription` — required when no resume is supplied
- `resume` — optional PDF file, maximum 3 MB

## Postman PDF download

1. Log in with `POST /api/auth/login`.
2. Keep the `token` cookie saved in Postman.
3. Generate a report with `POST /api/interview`.
4. Copy `interviewReport._id`.
5. Send `GET /api/interview/report/:id/pdf`.
6. Use **Send and Download** in Postman.

The PDF route requires the same authenticated user that owns the report.

## Validation

Frontend:

```powershell
cd Frontend
npm run lint
npm run build
```

Backend syntax:

```powershell
cd Backend
Get-ChildItem -Path . -Filter *.js -Recurse -File |
  Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
  ForEach-Object { node --check $_.FullName }
```

## Security notes

- Never commit `Backend/.env`.
- Rotate any API keys, database passwords, or JWT secrets that have been exposed.
- Use HTTPS and secure cookies in production.
- Configure CORS to allow only the deployed frontend origin.
