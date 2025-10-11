@echo off
echo ===================================
echo Testing Backend Authentication
echo ===================================
echo.

echo 1. Testing if backend is running...
echo -----------------------------------
curl -s http://localhost:3000/api/health
if %errorlevel% neq 0 (
    echo ERROR: Backend is not running!
    echo Please start your backend server first.
    pause
    exit /b 1
)
echo.

echo 2. Testing LOGIN endpoint...
echo -----------------------------------
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"root@admin.com\",\"password\":\"root123\"}" ^
  -c cookies.txt ^
  -v
echo.
echo.

echo 3. Checking if cookie was saved...
echo -----------------------------------
if exist cookies.txt (
    echo Cookie file created!
    type cookies.txt
) else (
    echo ERROR: No cookie file created!
    echo This means backend did not set a cookie.
)
echo.

echo 4. Testing /auth/me WITH cookie...
echo -----------------------------------
curl -X GET http://localhost:3000/api/auth/me ^
  -b cookies.txt ^
  -v
echo.
echo.

echo 5. Testing /auth/me WITHOUT cookie...
echo -----------------------------------
curl -X GET http://localhost:3000/api/auth/me
echo.
echo.

echo ===================================
echo Test Complete!
echo ===================================
echo.
echo Check the output above:
echo - Step 2: Should show "success":true
echo - Step 3: Should show cookie file
echo - Step 4: Should show user data
echo - Step 5: Should show "Not authenticated"
echo.
pause

