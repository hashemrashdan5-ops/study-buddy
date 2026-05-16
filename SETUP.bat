@echo off
title Study Buddy - First Time Setup
color 0E
echo.
echo  =====================================================
echo       STUDY BUDDY - First Time Setup
echo  =====================================================
echo.
echo  This script will:
echo   1. Create Python virtual environment
echo   2. Install Backend (Django) dependencies
echo   3. Install Frontend (React) dependencies
echo   4. Run database migrations
echo.
echo  Make sure you have installed:
echo   - Python 3.11+
echo   - Node.js 20+
echo   - PostgreSQL 16 (with database created)
echo.
echo  Press any key to start...
pause >nul

cd /d "%~dp0backend"

echo.
echo  =====================================================
echo  [1/4] Creating Python virtual environment...
echo  =====================================================
if exist ".venv" (
    echo  Virtual environment already exists, skipping.
) else (
    python -m venv .venv
    if errorlevel 1 (
        color 0C
        echo.
        echo  ERROR: Failed to create virtual environment.
        echo  Make sure Python is installed and on PATH.
        echo  Download: https://www.python.org/downloads/
        pause
        exit /b 1
    )
)

echo.
echo  =====================================================
echo  [2/4] Installing Backend dependencies...
echo  =====================================================
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    color 0C
    echo  ERROR: Failed to install backend dependencies.
    pause
    exit /b 1
)

echo.
echo  =====================================================
echo  [3/4] Running database migrations...
echo  =====================================================
python manage.py makemigrations
python manage.py migrate
if errorlevel 1 (
    color 0C
    echo  ERROR: Migration failed. Make sure PostgreSQL is running
    echo  and the database 'studybuddy_db' exists.
    echo.
    echo  To create the database, open psql and run:
    echo    CREATE USER studybuddy_user WITH PASSWORD 'postgres123';
    echo    CREATE DATABASE studybuddy_db OWNER studybuddy_user;
    echo    GRANT ALL PRIVILEGES ON DATABASE studybuddy_db TO studybuddy_user;
    pause
    exit /b 1
)

cd /d "%~dp0frontend"

echo.
echo  =====================================================
echo  [4/4] Installing Frontend dependencies...
echo  =====================================================
call npm install
if errorlevel 1 (
    color 0C
    echo  ERROR: Failed to install frontend dependencies.
    echo  Make sure Node.js is installed.
    echo  Download: https://nodejs.org
    pause
    exit /b 1
)

color 0A
echo.
echo  =====================================================
echo            SETUP COMPLETE!
echo  =====================================================
echo.
echo  Now you can run START.bat to launch the project.
echo.
echo  Optional: Create a superuser for Django admin
echo    cd backend
echo    .venv\Scripts\activate
echo    python manage.py createsuperuser
echo.
pause
