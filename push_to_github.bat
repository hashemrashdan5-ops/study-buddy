@echo off
cd /d "%~dp0"
echo === Committing and pushing changes to GitHub ===
git add .
git commit -m "update: latest changes"
git push origin main
echo.
echo === Done! ===
pause
