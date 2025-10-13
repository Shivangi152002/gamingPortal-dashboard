# Dashboard Environment Configuration

This document describes all environment variables needed for the Gaming Portal Dashboard.

## Quick Start

Create a `.env` file in the root of `gamingPortal-dashboard` directory with the following content:

```env
# ========================================
# GAMING PORTAL DASHBOARD - ENVIRONMENT CONFIGURATION
# ========================================
# For Vite to pick up environment variables, they MUST start with VITE_

# ========================================
# API CONFIGURATION
# ========================================
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# ========================================
# AWS CLOUDFRONT CONFIGURATION
# ========================================
VITE_CLOUDFRONT_URL=https://d1xtpep1y73br3.cloudfront.net
VITE_AWS_REGION=us-east-1

# ========================================
# FRONTEND CONFIGURATION
# ========================================
VITE_FRONTEND_URL=http://localhost:5174
VITE_APP_TITLE=Gaming Portal Admin
VITE_APP_DESCRIPTION=Complete game management system with AWS integration
VITE_APP_NAME=Gaming Portal
VITE_APP_VERSION=1.0.0

# ========================================
# FEATURE FLAGS
# ========================================
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true
VITE_DEV_TOOLS=true

# ========================================
# FILE UPLOAD SETTINGS
# ========================================
VITE_MAX_FILE_SIZE=52428800
VITE_MAX_FILES=10
VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
VITE_ALLOWED_VIDEO_TYPES=video/mp4,video/webm
VITE_ALLOWED_ARCHIVE_TYPES=application/zip,application/x-zip-compressed

# ========================================
# PAGINATION SETTINGS
# ========================================
VITE_DEFAULT_PAGE_SIZE=10
VITE_PAGE_SIZE_OPTIONS=10,25,50,100

# ========================================
# SESSION SETTINGS
# ========================================
VITE_SESSION_TIMEOUT=86400000
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000/api` |
| `VITE_CLOUDFRONT_URL` | CloudFront distribution URL for assets | `https://d1xtpep1y73br3.cloudfront.net` |

### Optional Variables with Defaults

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_TIMEOUT` | API request timeout (ms) | `30000` |
| `VITE_AWS_REGION` | AWS region | `us-east-1` |
| `VITE_FRONTEND_URL` | Frontend URL | `http://localhost:5174` |
| `VITE_MAX_FILE_SIZE` | Max upload size in bytes | `52428800` (50MB) |
| `VITE_DEBUG_MODE` | Enable debug logging | `true` (dev), `false` (prod) |

## Production Setup

For production deployment:

1. Set `VITE_API_BASE_URL` to your production API URL
2. Set `VITE_CLOUDFRONT_URL` to your CloudFront distribution
3. Set `VITE_FRONTEND_URL` to your dashboard domain
4. Set `VITE_DEBUG_MODE=false`
5. Set `VITE_ENABLE_ANALYTICS=true` if using analytics

## Important Notes

1. **NEVER** commit `.env` file to git
2. All Vite env vars **MUST** start with `VITE_` prefix
3. After changing `.env`, restart the dev server
4. CloudFront URL should **NOT** have trailing slash
5. API URL should point to your backend server endpoint

## Troubleshooting

### Assets not loading?
- Check `VITE_CLOUDFRONT_URL` is correct and accessible
- Verify CloudFront CORS is configured properly
- Check browser console for 403/404 errors

### API calls failing?
- Verify `VITE_API_BASE_URL` is correct
- Check server is running and accessible
- Verify CORS is configured on server

### Changes not reflecting?
- Restart Vite dev server after changing `.env`
- Clear browser cache
- Check environment variables are prefixed with `VITE_`

