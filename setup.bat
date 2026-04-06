@echo off
REM Quick start script for development (Windows)

echo.
echo 🚀 Starting SpeakUp...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODEJS_VERSION=%%i
echo ✅ Node.js version: %NODEJS_VERSION%
echo.

REM Backend setup
echo 📦 Setting up backend...
cd backend
if not exist node_modules (
    call npm install
)

if not exist .env (
    copy .env.example .env
    echo ⚠️  Created .env file. Please add your API keys to backend\.env
)

REM Frontend setup
echo.
echo 📦 Setting up frontend...
cd ..\frontend
if not exist node_modules (
    call npm install
)

if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file for frontend
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Add your API keys to backend\.env
echo 2. Run the following in separate terminals:
echo.
echo    Terminal 1 (Backend):
echo    cd backend ^&^& npm start
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open http://localhost:3000
echo.
pause
