@echo off
echo ========================================
echo Starting Game Admin System
echo ========================================
echo.

echo [1/2] Starting Backend Server...
cd /d "%~dp0server"
start "Game Admin Backend" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Dashboard...
cd /d "%~dp0"
start "Game Admin Dashboard" cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://85.209.95.229:3000
echo Frontend: http://localhost:5173
echo.
echo Login credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Press any key to close this window...
pause >nul
