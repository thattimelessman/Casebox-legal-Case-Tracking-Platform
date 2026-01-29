import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url  # REQUIRED for Render Database

# Load environment variables (for local dev)
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# --- SECURITY CONFIGURATION ---
# Auto-detect if we are on Render. If yes, DEBUG = False.
RENDER = 'RENDER' in os.environ
DEBUG = 'RENDER' not in os.environ

# Get SECRET_KEY from environment, or use a fallback for local dev only
SECRET_KEY = os.environ.get("SECRET_KEY", "unsafe-secret-key-change-me")

# Allow all hosts on Render to prevent "Bad Request (400)" errors
ALLOWED_HOSTS = ['*'] 

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Your apps
    'cases',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # <--- REQUIRED: Serves CSS/JS on Render
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "legal_case_tracker.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "cases" / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "legal_case_tracker.wsgi.application"

# --- DATABASE CONFIGURATION ---
# This automatically switches:
# Local -> Uses db.sqlite3
# Render -> Uses the PostgreSQL URL you add in the dashboard
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}',
        conn_max_age=600
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 12}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("TIME_ZONE", "Asia/Kolkata")
USE_I18N = True
USE_TZ = True

# --- STATIC FILES CONFIGURATION ---
STATIC_URL = "/static/"
# Where files are collected for production
STATIC_ROOT = BASE_DIR / "staticfiles"
# Where you keep static files locally
STATICFILES_DIRS = [BASE_DIR / "static"]
# Compresses and caches static files for speed
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

LOGIN_URL = "login"
LOGIN_REDIRECT_URL = "cases:dashboard"
LOGOUT_REDIRECT_URL = "login"

# --- SECURITY HARDENING ---
# These settings activate ONLY when you are on Render (Production)
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True
    # Allow CSRF from your Render URL (Replace this after you deploy if needed)
    CSRF_TRUSTED_ORIGINS = ['https://*.onrender.com']

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"