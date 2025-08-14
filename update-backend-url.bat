@echo off
echo ========================================
echo    Update Backend URL for Deployment
echo ========================================
echo.

echo This script will help you update the backend URL for deployment.
echo.

set /p BACKEND_URL="Enter your backend URL (e.g., https://your-backend.railway.app): "

if "%BACKEND_URL%"=="" (
    echo Error: Backend URL cannot be empty
    pause
    exit /b 1
)

echo.
echo Updating environment configuration...
echo Backend URL: %BACKEND_URL%
echo.

REM Update the env.js file
echo // Runtime environment configuration > frontend\src\assets\env.js
echo // This file can be modified during deployment to set environment variables >> frontend\src\assets\env.js
echo window.__env = { >> frontend\src\assets\env.js
echo   // Backend API URL - Update this for your deployment >> frontend\src\assets\env.js
echo   API_URL: '%BACKEND_URL%/api', >> frontend\src\assets\env.js
echo. >> frontend\src\assets\env.js
echo   // Backend Base URL - Update this for your deployment  >> frontend\src\assets\env.js
echo   BASE_URL: '%BACKEND_URL%', >> frontend\src\assets\env.js
echo. >> frontend\src\assets\env.js
echo   // Environment name >> frontend\src\assets\env.js
echo   ENVIRONMENT: 'production' >> frontend\src\assets\env.js
echo }; >> frontend\src\assets\env.js

echo ✅ Environment configuration updated successfully!
echo.
echo Next steps:
echo 1. Rebuild your frontend: npm run build:prod
echo 2. Deploy the updated frontend
echo 3. Test login with demo accounts
echo.

pause
