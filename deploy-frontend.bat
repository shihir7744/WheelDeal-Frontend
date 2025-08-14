@echo off
setlocal enabledelayedexpansion

REM Car Rental System - Frontend Deployment Script (Windows)
REM This script deploys the frontend using Docker Compose

echo 🚀 Starting Frontend Deployment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

REM Navigate to frontend directory
cd frontend

REM Check if environment.prod.ts needs updating
echo 🔧 Checking production environment configuration...
findstr "your-backend-domain.com" src\environments\environment.prod.ts >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Please update src\environments\environment.prod.ts with your backend domain before continuing.
    echo    Current content:
    type src\environments\environment.prod.ts
    echo.
    echo Press Enter when you've updated the configuration...
    pause
)

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Build and start containers
echo 🔨 Building and starting containers...
docker-compose up -d --build

REM Wait for application to start
echo ⏳ Waiting for application to start...
timeout /t 20 /nobreak >nul

REM Check application health
echo 🏥 Checking application health...
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend health check failed. Check logs with: docker-compose logs -f frontend
    pause
    exit /b 1
) else (
    echo ✅ Frontend is running successfully!
    echo 🌐 Frontend URL: http://localhost
    echo 📊 Health Check: http://localhost/health
)

echo 🎉 Frontend deployment completed successfully!
echo.
echo 📋 Useful commands:
echo   View logs: docker-compose logs -f frontend
echo   Stop: docker-compose down
echo   Restart: docker-compose restart
echo   Update: docker-compose up -d --build
echo.
echo 🔧 To update backend URL, edit src\environments\environment.prod.ts and rebuild

pause
