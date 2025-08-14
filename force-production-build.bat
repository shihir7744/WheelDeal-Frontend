@echo off
echo ========================================
echo    Force Production Build
echo    (For Frontend Repository)
echo ========================================
echo.

echo PROBLEM: Frontend not using production environment
echo SOLUTION: Force production build and redeploy
echo.

echo STEP 1: Clean previous builds
echo ==============================
echo.
if exist "dist" (
    echo Removing previous build...
    rmdir /s /q "dist"
    echo ✅ Previous build removed
) else (
    echo No previous build found
)
echo.

echo STEP 2: Force production build
echo ===============================
echo.
echo Building with explicit production configuration...
call npm run build -- --configuration=production
echo.

echo STEP 3: Verify production build
echo ================================
echo.
if exist "dist\frontend\browser\main.js" (
    echo ✅ Production build created successfully
    
    echo Checking if production API URL is in build...
    findstr /C:"wheeldeal-backend-production" "dist\frontend\browser\main.js" >nul
    if %errorlevel%==0 (
        echo ✅ Production API URL found in build
        echo Build is using correct production environment
    ) else (
        echo ❌ Production API URL NOT found in build
        echo Build is still using wrong environment
        echo.
        echo Checking what URL is actually in the build...
        findstr /C:"localhost:8080" "dist\frontend\browser\main.js" >nul
        if %errorlevel%==0 (
            echo ❌ Found localhost:8080 in build!
            echo This means environment.prod.ts is not being used
            echo.
            echo Checking environment.prod.ts content:
            type src\environments\environment.prod.ts
            echo.
            pause
            exit /b 1
        ) else (
            echo ❓ No localhost:8080 found - check what URL is being used
            pause
            exit /b 1
        )
    )
) else (
    echo ❌ Production build failed
    echo Check for build errors above
    pause
    exit /b 1
)

echo.
echo STEP 4: Deploy to Railway
echo ==========================
echo.
echo Production build verified successfully!
echo.
echo Now deploy to Railway:
echo 1. Commit your changes: git add . && git commit -m "Force production build"
echo 2. Push to your frontend repository: git push origin main
echo 3. Deploy to Railway: railway up
echo.
echo After deployment, test login again:
echo - Check Network tab for requests to your backend URL
echo - Verify backend receives the requests
echo.

echo Demo accounts available:
echo - Admin: admin@wheeldeal.com / admin123
echo - Manager: manager@wheeldeal.com / manager123
echo - Customer: customer@wheeldeal.com / customer123
echo.

pause
