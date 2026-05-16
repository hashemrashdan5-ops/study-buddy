@echo off
title Study Buddy Launcher
color 0E
echo.
echo  =====================================================
echo            STUDY BUDDY - Quick Launcher
echo  =====================================================
echo.
echo  [1/3] Starting Backend (Django)...
cd /d "%~dp0backend"
start "Study Buddy - Backend" cmd /k "color 0A && title Study Buddy Backend && .venv\Scripts\activate && python manage.py runserver"

echo  [2/3] Waiting for backend to start...
timeout /t 4 /nobreak >nul

echo  [3/3] Starting Frontend (React)...
cd /d "%~dp0frontend"
start "Study Buddy - Frontend" cmd /k "color 0B && title Study Buddy Frontend && npm run dev"

echo.
echo  Waiting for frontend to be ready...
timeout /t 6 /nobreak >nul

echo.
echo  Opening browser...
start http://localhost:5173

echo.
echo  =====================================================
echo   Study Buddy is now running!
echo  =====================================================
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:8000
echo   Admin:    http://127.0.0.1:8000/admin
echo.
echo   To stop everything, run STOP.bat
echo   You can close this window safely.
echo.
pause
