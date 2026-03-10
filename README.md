# **CaseBox**

A full-stack legal case management system built for law firms and independent practitioners. CaseBox handles case tracking, document storage, deadline management, party records, and role-based access — with a custom-designed frontend and a Django REST API backend.

**Live:** [casebox-beta.vercel.app](https://casebox-beta.vercel.app)  


---

## The Problem

Legal workflows are fragmented. Case files live in folders, deadlines get tracked in spreadsheets, and client communication happens over email threads with no audit trail. For small firms and solo practitioners, there is no lightweight tool that handles the full picture — case lifecycle, document uploads, involved parties, deadline monitoring, and access control — without the overhead of enterprise software.

CaseBox is that tool.

---

## Architecture

```
┌──────────────────────────────────────────┐
│              React Frontend              │
│     Vercel · JWT Auth · Role-based UI    │
└──────────────────┬───────────────────────┘
                   │ HTTPS · REST
┌──────────────────▼───────────────────────┐
│            Django REST Framework         │
│   Render · Gunicorn · Custom JWT Auth    │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│              SQLite / PostgreSQL         │
│    Per-case document storage · ORM       │
└──────────────────────────────────────────┘
```

The frontend is a single-page React application deployed on Vercel. The backend is a Django REST API deployed on Render using Gunicorn. JWT tokens handle authentication with automatic refresh via axios interceptors. CORS is configured to only allow requests from the live Vercel domain.

---

## Features

**Authentication & Access Control**  
Login/logout with JWT (access + refresh token pair). Four roles — Admin, Advocate, Judge, Client — each with a separate dashboard and scoped API access. Client accounts require explicit admin approval before they can log in (`is_approved` flag on the User model). Non-client roles bypass this check.

**Case Management**  
Full CRUD on cases with status tracking, metadata, and case history. Cases are the central object — everything else (parties, deadlines, documents) attaches to a case.

**Party Handling**  
Each case can have multiple parties with configurable roles: plaintiff, defendant, or custom. Stored relationally per case.

**Deadline Engine**  
Deadlines are attached to cases with due dates and completion flags. Overdue detection runs at query time — no cron job needed — by comparing due dates against the current timestamp.

**Document Upload System**  
File uploads are validated on both extension and file size before storage. Files are organized into per-case subdirectories under `media/`. Supported types include PDF and common image formats.

**Admin Dashboard**  
Superusers can view all cases, manage users, approve pending client registrations, and access an audit log. Built as a separate view from advocate/judge/client dashboards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Axios, Context API |
| Styling | Custom CSS — no component library |
| Backend | Django 4.x, Django REST Framework |
| Auth | SimpleJWT — custom token serializer |
| Database | SQLite (dev) / PostgreSQL-ready via `dj-database-url` |
| File Handling | Pillow for image processing |
| Server | Gunicorn |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Project Structure

```
Casebox/
├── backend/
│   ├── accounts/          # Custom User model, JWT serializer, role logic
│   ├── cases/             # Case, Party, Deadline models and APIs
│   ├── legal_case_tracker/ # Not in use (legacy Django-only version)
│   ├── casebox/           # Django settings, URLs, WSGI
│   ├── media/             # Uploaded documents (gitignored)
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios instance with JWT refresh interceptor
│   │   ├── components/    # Layout, shared UI
│   │   ├── context/       # AuthContext — user state and token management
│   │   └── pages/
│   │       ├── admin/     # Admin dashboard, user management, audit log
│   │       ├── shared/    # Case detail view
│   │       ├── LandingPage.jsx
│   │       ├── LoginPage.jsx
│   │       └── RolePages.jsx  # Advocate, Judge, Client views
│   └── package.json
└── README.md
```

---

## Local Setup

**Backend**

```bash
git clone https://github.com/thattimelessman/Casebox.git
cd Casebox/backend

python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Create `backend/.env`:
```env
SECRET_KEY=your-secret-key
DEBUG=True
USE_SQLITE=True
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
ADMIN_EMAIL=admin@casebox.law
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

```bash
python manage.py migrate
python manage.py create_admin   # reads credentials from .env
python manage.py runserver
```

Backend runs at `http://localhost:8000`.

**Frontend**

```bash
cd Casebox/frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

```bash
npm start
```

Frontend runs at `http://localhost:3000`.

---

## Deployment

**Backend — Render**

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt && python manage.py migrate && python manage.py create_admin` |
| Start Command | `gunicorn casebox.wsgi:application` |

Environment variables to set in Render dashboard:
```
SECRET_KEY          = <strong random key>
DEBUG               = False
USE_SQLITE          = True
ADMIN_USERNAME      = admin
ADMIN_PASSWORD      = <your password>
ADMIN_EMAIL         = admin@casebox.law
ALLOWED_HOSTS       = .onrender.com
CORS_ALLOWED_ORIGINS = https://your-vercel-url.vercel.app
```

**Frontend — Vercel**

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Create React App (auto-detected) |
| Build Command | `DISABLE_ESLINT_PLUGIN=true react-scripts build` |

Environment variable to set in Vercel dashboard:
```
REACT_APP_API_URL = https://your-render-url.onrender.com/api
```

After both are deployed, update `CORS_ALLOWED_ORIGINS` on Render to match the exact Vercel URL and redeploy.

---

## Authentication Flow

1. User submits credentials to `POST /api/token/`
2. Django validates against the custom `User` model — checks `is_active` and `can_access` (which enforces `is_approved` for clients)
3. On success, returns an access token (short-lived) and refresh token (long-lived)
4. Frontend stores tokens and attaches the access token as a Bearer header on every API request via an axios interceptor
5. When a 401 is returned, the interceptor automatically calls `POST /api/token/refresh/` and retries the original request
6. On logout, tokens are cleared from state

The custom token serializer extends `TokenObtainPairSerializer` to include `role` and `is_approved` in the token payload, so the frontend can gate UI without an extra API call.

---

## Known Limitations

- **Media file persistence on Render**: Render's free tier has an ephemeral filesystem. Uploaded documents will be lost on redeploy. For production use, integrate cloud storage (S3 or Cloudinary) via `django-storages`.
- **SQLite on Render**: Works for demos but is not suitable for concurrent writes. Swap `USE_SQLITE=False` and set `DATABASE_URL` to a managed PostgreSQL instance (Neon or Supabase both have free tiers).
- **Render cold starts**: The free tier spins down after inactivity. First request after idle may take 30–60 seconds.

---

## Contact

Built by [Agraj Singh](mailto:agrajsingh04@gmail.com)  
[LinkedIn](https://www.linkedin.com/in/thattimelessman/) · [GitHub](https://github.com/thattimelessman)
