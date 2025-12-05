@echo off
echo Starting Backend Server...
echo.
echo Checking environment...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create backend/.env file with required configuration.
    pause
    exit /b 1
)

echo.
echo Installing dependencies if needed...
call npm install

echo.
echo Starting server...
node server.js

pause

