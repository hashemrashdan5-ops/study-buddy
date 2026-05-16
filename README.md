# Study Buddy

A full-stack AI-powered study assistant built with:

- **Backend:** Django + Django REST Framework + JWT
- **Frontend:** React + Vite + Axios + React Router
- **Database:** PostgreSQL
- **AI:** OpenAI API (GPT-3.5)
- **Deployment:** Render (Backend + DB) + Vercel (Frontend)

## Features

- User registration & JWT authentication
- Personal notes (CRUD)
- AI-powered text summarization
- AI-generated multiple-choice quizzes
- Public bug report submission

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open browser:
- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8000/api/health/
- Admin: http://127.0.0.1:8000/admin

## Author

Mohammad Salhab — BTEC Grade 12 — Jordan — 2026
