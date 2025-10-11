#!/bin/bash

echo "==================================="
echo "Testing Backend Authentication"
echo "==================================="
echo ""

# Clean up old cookies
rm -f cookies.txt

echo "1. Testing if backend is running..."
echo "-----------------------------------"
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend is NOT running!"
    echo "Please start your backend server first."
    exit 1
fi
echo ""

echo "2. Testing LOGIN endpoint..."
echo "-----------------------------------"
LOGIN_OUTPUT=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"root@admin.com","password":"root123"}' \
  -c cookies.txt \
  -w "\nHTTP_CODE:%{http_code}")

echo "$LOGIN_OUTPUT"

if echo "$LOGIN_OUTPUT" | grep -q '"success":true'; then
    echo "✅ Login successful!"
else
    echo "❌ Login failed!"
    exit 1
fi
echo ""

echo "3. Checking if cookie was saved..."
echo "-----------------------------------"
if [ -f cookies.txt ]; then
    echo "✅ Cookie file created!"
    echo "Cookie content:"
    cat cookies.txt
else
    echo "❌ No cookie file created!"
    echo "This means backend did not set a cookie."
    exit 1
fi
echo ""

echo "4. Testing /auth/me WITH cookie..."
echo "-----------------------------------"
ME_WITH_COOKIE=$(curl -s -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt)

echo "$ME_WITH_COOKIE"

if echo "$ME_WITH_COOKIE" | grep -q '"success":true'; then
    echo "✅ /auth/me successful with cookie!"
else
    echo "❌ /auth/me failed even with cookie!"
    echo "Check your backend session validation."
fi
echo ""

echo "5. Testing /auth/me WITHOUT cookie..."
echo "-----------------------------------"
ME_WITHOUT_COOKIE=$(curl -s -X GET http://localhost:3000/api/auth/me)

echo "$ME_WITHOUT_COOKIE"

if echo "$ME_WITHOUT_COOKIE" | grep -q '"success":false'; then
    echo "✅ /auth/me correctly rejected without cookie!"
else
    echo "⚠️ Unexpected response without cookie"
fi
echo ""

echo "==================================="
echo "Test Complete!"
echo "==================================="
echo ""
echo "Summary:"
echo "--------"
if [ -f cookies.txt ] && echo "$ME_WITH_COOKIE" | grep -q '"success":true'; then
    echo "✅ Backend is working correctly!"
    echo "✅ Cookies are being set and validated"
    echo ""
    echo "If frontend still has issues, check:"
    echo "  - Frontend CORS configuration"
    echo "  - Browser is sending cookies (withCredentials: true)"
    echo "  - Check browser DevTools → Network → auth/me → Request Headers"
else
    echo "❌ Backend has authentication issues!"
    echo ""
    echo "Please check:"
    echo "  - Backend CORS configuration (credentials: true)"
    echo "  - Backend session middleware setup"
    echo "  - Session secret is set"
fi
echo ""

