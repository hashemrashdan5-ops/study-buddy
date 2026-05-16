@echo off
title Study Buddy Stopper
color 0C
echo.
echo  =====================================================
echo            STOPPING Study Buddy Services
echo  =====================================================
echo.

echo  Stopping Django Backend...
taskkill /F /FI "WindowTitle eq Study Buddy - Backend*" >nul 2>&1
taskkill /F /FI "WindowTitle eq Study Buddy Backend*" >nul 2>&1

echo  Stopping React Frontend...
taskkill /F /FI "WindowTitle eq Study Buddy - Frontend*" >nul 2>&1
taskkill /F /FI "WindowTitle eq Study Buddy Frontend*" >nul 2>&1

echo  Cleaning up Python processes on port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo  Cleaning up Node processes on port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo.
echo  =====================================================
echo   All Study Buddy services stopped.
echo  =====================================================
echo.
timeout /t 3 >nul
