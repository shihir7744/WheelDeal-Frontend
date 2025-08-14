@echo off
echo ========================================
echo    Fix Frontend-Backend Connectivity
echo ========================================
echo.

echo PROBLEM: Frontend requests not reaching backend
echo CAUSES: CORS issues, environment configuration, deployment problems
echo.

echo STEP 1: Check your backend URL
echo ================================
echo Go to your Railway backend project and copy the domain
echo Example: https://wheeldeal-backend-production.up.railway.app
echo.

set /p BACKEND_URL="Enter your backend URL: "

if "%BACKEND_URL%"=="" (
    echo Error: Backend URL cannot be empty
    pause
    exit /b 1
)

echo.
echo STEP 2: Update frontend environment
echo ===================================
echo Updating frontend environment files...

REM Update environment.prod.ts
echo export const environment = { > frontend\src\environments\environment.prod.ts
echo   production: true, >> frontend\src\environments\environment.prod.ts
echo   apiUrl: '%BACKEND_URL%/api', >> frontend\src\environments\environment.prod.ts
echo   baseUrl: '%BACKEND_URL%' >> frontend\src\environments\environment.prod.ts
echo }; >> frontend\src\environments\environment.prod.ts

echo ✅ Frontend environment updated
echo.

echo STEP 3: Update backend CORS configuration
echo =========================================
echo You need to set this environment variable in Railway:
echo.
echo CORS_ALLOWED_ORIGINS=%BACKEND_URL%,https://*.railway.app,http://localhost:4200
echo.

echo STEP 4: Rebuild and redeploy
echo =============================
echo 1. Rebuild frontend: npm run build:prod
echo 2. Redeploy frontend to Railway
echo 3. Redeploy backend to Railway (to apply CORS changes)
echo.

echo STEP 5: Test connectivity
echo =========================
echo 1. Open browser dev tools (F12)
echo 2. Go to Network tab
echo 3. Try to login with demo account
echo 4. Check if request goes to: %BACKEND_URL%/api/auth/login
echo.

echo Demo accounts available:
echo - Admin: admin@wheeldeal.com / admin123
echo - Manager: manager@wheeldeal.com / manager123
echo - Customer: customer@wheeldeal.com / customer123
echo.

echo If you still have issues:
echo 1. Check Railway logs for CORS errors
echo 2. Verify backend is running and accessible
echo 3. Check if demo users were created
echo.

pause
