@echo off
echo ========================================
echo    Quick Fix: Backend URL Issue
echo ========================================
echo.

echo PROBLEM: Your frontend is still trying to connect to localhost:8080
echo SOLUTION: Update the environment configuration and redeploy
echo.

echo Current issue:
echo - Frontend trying to connect to: http://localhost:8080
echo - This won't work in production deployment
echo.

echo To fix this issue:
echo.

echo 1. Get your backend URL from Railway:
echo    - Go to your Railway backend project
echo    - Copy the domain (e.g., https://wheeldeal-backend-production.up.railway.app)
echo.

echo 2. Run the update script:
echo    - update-backend-url.bat
echo    - Enter your backend URL when prompted
echo.

echo 3. Rebuild and redeploy frontend:
echo    cd frontend
echo    npm run build:prod
echo    redeploy to Railway
echo.

echo 4. Test login:
echo    - Try logging in with demo accounts
echo    - Check Network tab for correct API calls
echo.

echo Demo accounts available:
echo - Admin: admin@wheeldeal.com / admin123
echo - Manager: manager@wheeldeal.com / manager123
echo - Customer: customer@wheeldeal.com / customer123
echo.

pause
