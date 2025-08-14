@echo off
echo ========================================
echo    Frontend Production Diagnostic
echo    (For Separate Repository)
echo ========================================
echo.

echo PROBLEM: Frontend requests not reaching backend
echo SYMPTOM: No backend HTTP logs
echo.

echo STEP 1: Check current environment files
echo ======================================
echo.

echo Current environment.prod.ts:
type src\environments\environment.prod.ts
echo.

echo Current environment.ts:
type src\environments\environment.ts
echo.

echo STEP 2: Check if production build is working
echo ============================================
echo.

echo Building frontend with production configuration...
call npm run build:prod
echo.

echo STEP 3: Check built files
echo =========================
echo.

echo Checking if production build was created...
if exist "dist\frontend\browser\main.js" (
    echo ✅ Production build exists
    echo.
    echo Checking main.js for API URL...
    findstr /C:"wheeldeal-backend-production" "dist\frontend\browser\main.js" >nul
    if %errorlevel%==0 (
        echo ✅ Production API URL found in build
        echo Build is using correct production environment
    ) else (
        echo ❌ Production API URL NOT found in build
        echo This means the build is not using production configuration
        echo.
        echo Checking what URL is actually in the build...
        findstr /C:"localhost:8080" "dist\frontend\browser\main.js" >nul
        if %errorlevel%==0 (
            echo ❌ Found localhost:8080 in build - using development environment!
        ) else (
            echo ❓ No localhost:8080 found - check what URL is being used
        )
    )
) else (
    echo ❌ Production build failed - no dist/frontend/browser/main.js
)

echo.
echo STEP 4: Verify build configuration
echo ==================================
echo.

echo Checking angular.json build configuration...
findstr /C:"defaultConfiguration.*production" "angular.json" >nul
if %errorlevel%==0 (
    echo ✅ Angular default configuration is production
) else (
    echo ❌ Angular default configuration is NOT production
)

echo.
echo STEP 5: Manual verification
echo ===========================
echo.

echo To manually verify the issue:
echo 1. Open your deployed frontend in browser
echo 2. Press F12 to open dev tools
echo 3. Go to Network tab
echo 4. Try to login
echo 5. Look for requests to localhost:8080 instead of your backend
echo.

echo If you see localhost:8080 requests:
echo - Frontend is not using production environment
echo - Need to rebuild with production configuration
echo - Check if build command is correct
echo.

echo STEP 6: Next steps
echo ===================
echo.

echo If production build is correct:
echo 1. Commit and push to your frontend repository
echo 2. Deploy to Railway: railway up
echo 3. Test login again
echo.

echo If production build is wrong:
echo 1. Check environment.prod.ts file
echo 2. Ensure it has correct backend URL
echo 3. Rebuild and redeploy
echo.

pause
