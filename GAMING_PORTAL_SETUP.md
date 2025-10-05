# 🎮 Gaming Portal Configuration

## Update gamingPortal to Use CloudFront/S3

Once your admin dashboard is working and uploading games to S3, you need to update your gaming portal to fetch from the CloudFront URL.

---

## 📝 Update Configuration

Edit this file: `d:\GAMELAUNCHER\gamingPortal\src\config\api.js`

### Current Configuration
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://d1xtpep1y73br3.cloudfront.net',
  ENDPOINTS: {
    GAMES_DATA: '/public/game-data.json'
  },
  PATHS: {
    GAMES: '/public/games/',
    THUMBNAILS: '/public/thumbnail/',
    GIFS: '/public/gif/',
    IMAGES: '/public/',
    ASSETS: '/public/'
  }
};
```

### Update BASE_URL

Replace `BASE_URL` with your CloudFront URL from the admin dashboard:

```javascript
export const API_CONFIG = {
  BASE_URL: 'https://YOUR-CLOUDFRONT-DOMAIN.cloudfront.net',
  // ... rest stays the same
};
```

Or if not using CloudFront, use your S3 bucket URL:

```javascript
export const API_CONFIG = {
  BASE_URL: 'https://YOUR-BUCKET-NAME.s3.YOUR-REGION.amazonaws.com',
  // ... rest stays the same
};
```

---

## 🔍 Where to Find Your URLs

### CloudFront URL (Recommended)
1. Go to AWS CloudFront console
2. Find your distribution
3. Copy the "Domain name" (e.g., `d1xtpep1y73br3.cloudfront.net`)
4. Use with `https://` prefix

### S3 Direct URL (Alternative)
1. Go to AWS S3 console
2. Open your bucket
3. Go to Properties tab
4. Find "Bucket website endpoint" or use:
   - Format: `https://BUCKET-NAME.s3.REGION.amazonaws.com`
   - Example: `https://my-game-bucket.s3.us-east-1.amazonaws.com`

---

## 🔄 Complete Integration Flow

```
┌─────────────────────────────────────────────────────┐
│  Admin Dashboard (Dashboard)                        │
│  - Upload games                                     │
│  - Update game-data.json                            │
│                                                     │
│            ↓ Uploads to                             │
│                                                     │
│  AWS S3 Bucket                                      │
│  - public/game-data.json                            │
│  - public/games/                                    │
│  - public/thumbnail/                                │
│  - public/gif/                                      │
│                                                     │
│            ↓ Served via                             │
│                                                     │
│  CloudFront CDN                                     │
│  https://dxxxxxxxx.cloudfront.net                   │
│                                                     │
│            ↓ Fetched by                             │
│                                                     │
│  Gaming Portal (Public Website)                     │
│  - Displays games                                   │
│  - Loads from CloudFront                            │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Verification Steps

### 1. Check Admin Dashboard

After uploading a game in admin dashboard:

```
https://YOUR-CLOUDFRONT.cloudfront.net/public/game-data.json
```

Should show your games in JSON format.

### 2. Check Gaming Portal

Your gaming portal should now fetch games from the same URL.

Open browser console and verify the API calls are going to CloudFront.

---

## 🎯 Example Setup

### Admin Dashboard `.env`:
```env
CLOUDFRONT_URL=https://d1xtpep1y73br3.cloudfront.net
AWS_S3_BUCKET=my-game-bucket
```

### Gaming Portal `api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://d1xtpep1y73br3.cloudfront.net',
  // ...
};
```

**Both should use the SAME CloudFront URL!**

---

## 🔐 S3 Bucket Policy

Make sure your S3 bucket allows public read access for the `/public/*` folder:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/public/*"
    }
  ]
}
```

---

## 🚀 Quick Test

### Test game-data.json is accessible:

```bash
curl https://YOUR-CLOUDFRONT-URL/public/game-data.json
```

Should return:
```json
{
  "games": [...]
}
```

### Test an uploaded image:

```bash
curl -I https://YOUR-CLOUDFRONT-URL/public/thumbnail/some-image.jpg
```

Should return HTTP 200 OK.

---

## 🛠️ Troubleshooting

### Error: "Access Denied"
- Check S3 bucket policy allows public read
- Verify CloudFront origin is correctly set to S3 bucket

### Error: "NoSuchKey"
- File doesn't exist in S3
- Check the path is correct
- Verify upload succeeded in admin dashboard

### Images not loading
- Check CORS settings on S3 bucket
- Verify CloudFront cache behavior
- Check browser console for errors

---

## 📚 Summary

1. **Admin Dashboard** uploads to S3
2. **S3** stores all files
3. **CloudFront** serves files (CDN)
4. **Gaming Portal** fetches from CloudFront

All three components use the **same CloudFront URL**!

---

**Once configured, your gaming portal will automatically show all games uploaded through the admin dashboard! 🎉**
