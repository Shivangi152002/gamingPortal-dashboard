# ⚠️ IMPORTANT: S3 Direct URL Configuration

## 🔧 Current Configuration

**Dashboard is using S3 DIRECT URL for all assets:**
- ✅ Development: S3 Direct
- ✅ Production: S3 Direct
- ❌ CloudFront: DISABLED

## 📍 S3 Direct URL

```
https://gameportal-assets.s3.us-east-1.amazonaws.com
```

## 🚫 CloudFront Disabled

The CloudFront distribution `d1xtpep1y73br3.cloudfront.net` was deleted/is not available.

Until CloudFront is properly configured, all assets load directly from S3.

## 📁 Configuration Files

### 1. `.env.local` (Highest Priority)
```env
VITE_CLOUDFRONT_URL=https://gameportal-assets.s3.us-east-1.amazonaws.com
VITE_AWS_REGION=us-east-1
```

### 2. `src/config/index.js`
```javascript
aws: {
  cloudFrontUrl: getEnvVar('VITE_CLOUDFRONT_URL', 
    'https://gameportal-assets.s3.us-east-1.amazonaws.com'), // S3 direct
  region: getEnvVar('VITE_AWS_REGION', 'us-east-1'),
}
```

### 3. `src/utils/apiConfig.js`
```javascript
const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL || 
  'https://gameportal-assets.s3.us-east-1.amazonaws.com'; // S3 direct
```

## 🔄 To Switch to CloudFront Later

When CloudFront is ready:

1. **Get new CloudFront URL:**
   ```
   https://YOUR-NEW-DISTRIBUTION.cloudfront.net
   ```

2. **Update `.env.local`:**
   ```env
   VITE_CLOUDFRONT_URL=https://YOUR-NEW-DISTRIBUTION.cloudfront.net
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## ✅ Current Asset URLs

All assets now load from:
```
https://gameportal-assets.s3.us-east-1.amazonaws.com/public/thumbnail/game.png
https://gameportal-assets.s3.us-east-1.amazonaws.com/public/games/game-folder/
https://gameportal-assets.s3.us-east-1.amazonaws.com/public/gif/game.gif
```

## 🔍 Verify Configuration

**In browser console:**
```javascript
console.log(import.meta.env.VITE_CLOUDFRONT_URL)
// Should output: https://gameportal-assets.s3.us-east-1.amazonaws.com
```

## 📝 Notes

- S3 direct URLs require proper CORS configuration
- S3 bucket must have public read access for assets
- Bucket policy must allow `s3:GetObject` for public/*
- No CDN caching (slower than CloudFront)
- Direct S3 access (no edge locations)

---

**Last Updated:** 2025-01-15
**Status:** ✅ S3 Direct Active | ❌ CloudFront Disabled

