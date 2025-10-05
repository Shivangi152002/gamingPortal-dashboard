# 🎮 Game Admin Dashboard - Complete Setup Guide (Updated)

## 🆕 What's New

✅ **Session-Based Authentication** - No JWT tokens, simple session management  
✅ **Root User System** - Root credentials stored in .env file  
✅ **User Management** - Root user can add/edit users from dashboard  
✅ **AWS S3 Integration** - All files uploaded to S3 (no local storage)  
✅ **Dynamic game-data.json** - Fetched and updated directly in S3  

---

## 📋 Prerequisites

- Node.js 18+ installed
- AWS Account with S3 bucket created
- AWS Access Keys (Access Key ID + Secret Access Key)
- CloudFront distribution (optional but recommended)

---

## 🚀 Quick Start Guide

### Step 1: Install Backend Dependencies

```bash
cd D:\GAMELAUNCHER\dashboard\server
npm install
```

### Step 2: Configure AWS S3 Bucket

1. **Create S3 Bucket** in AWS Console
2. **Create folders** in your bucket:
   - `public/games/`
   - `public/thumbnail/`
   - `public/gif/`
3. **Set bucket policy** to allow public read access (for game assets)
4. **Get your AWS credentials:**
   - Access Key ID
   - Secret Access Key
5. **(Optional)** Set up CloudFront distribution pointing to your S3 bucket

### Step 3: Configure Backend Environment

Edit `server/.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Session Secret - Change this!
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Root User Credentials - Change these!
ROOT_USERNAME=root
ROOT_EMAIL=root@admin.com
ROOT_PASSWORD=root123

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET=your-bucket-name

# CloudFront URL (if using CloudFront)
CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net

# File Upload Settings
MAX_FILE_SIZE=52428800
```

**⚠️ IMPORTANT:**
- Replace `YOUR_AWS_ACCESS_KEY_ID` with your actual AWS Access Key ID
- Replace `YOUR_AWS_SECRET_ACCESS_KEY` with your actual AWS Secret Access Key
- Replace `your-bucket-name` with your S3 bucket name
- Change `SESSION_SECRET` to a random string
- Change root user credentials

### Step 4: Install Frontend Dependencies

```bash
cd D:\GAMELAUNCHER\dashboard
npm install
```

### Step 5: Configure Frontend Environment

Create `.env` file in dashboard root:

```env
VITE_API_BASE_URL=http://85.209.95.229:3000/api
```

### Step 6: Initialize S3 game-data.json

Create an empty `game-data.json` file in your S3 bucket at:
```
s3://your-bucket-name/public/game-data.json
```

Content:
```json
{
  "games": []
}
```

### Step 7: Start Backend Server

```bash
cd D:\GAMELAUNCHER\dashboard\server
npm start
```

You should see:
```
🚀 Server running on port 3000
📝 Environment: development
🔐 Root User: root
☁️  S3 Bucket: your-bucket-name
🌐 CloudFront: https://your-cloudfront-domain.cloudfront.net
```

### Step 8: Start Frontend Dashboard

Open a **NEW terminal** window:

```bash
cd D:\GAMELAUNCHER\dashboard
npm run dev
```

### Step 9: Login as Root User

1. Open browser: `http://localhost:5173`
2. Login with root credentials from `.env`:
   - Email: `root@admin.com`
   - Password: `root123`

---

## 👥 User Management

### Root User (You)

- Credentials stored in `server/.env` file
- Full access to everything
- Can add/edit/delete other users
- Cannot be deleted

### Adding New Users

1. **Login as root user**
2. **Navigate to** "User Management" in sidebar
3. **Click** "Add User"
4. **Fill in:**
   - Username
   - Email
   - Password
   - Role (User or Admin)
5. **Click** "Create"

### Editing Users

- Only root can edit users
- Go to User Management
- Click edit icon next to user
- Leave password empty to keep current password

---

## 📤 Upload Games to S3

### Upload Flow

1. **Navigate** to "Upload Game"
2. **Fill game details** (name, category, description, etc.)
3. **Upload files:**
   - Thumbnail (required) → Goes to `s3://bucket/public/thumbnail/`
   - Game ZIP/HTML → Goes to `s3://bucket/public/games/`
   - Logo → Goes to `s3://bucket/public/thumbnail/`
   - Preview GIF → Goes to `s3://bucket/public/gif/`
4. **Click "Upload Game"**
   - Files uploaded to S3
   - game-data.json in S3 automatically updated

### Files Location in S3

```
your-bucket-name/
└── public/
    ├── game-data.json          ← Auto-updated
    ├── games/
    │   └── game-files-*.zip
    ├── thumbnail/
    │   ├── logo-*.png
    │   └── thumb-*.jpg
    └── gif/
        └── preview-*.gif
```

---

## 📊 game-data.json Structure

Stored in S3 at: `s3://your-bucket/public/game-data.json`

```json
{
  "games": [
    {
      "id": "game_1696234567890",
      "name": "My Awesome Game",
      "description": "<p>Game description</p>",
      "category": "Action",
      "thumbnail": "/public/thumbnail/thumb-123.jpg",
      "gif": "/public/gif/preview-456.gif",
      "logo": "/public/thumbnail/logo-789.png",
      "htmlFile": "/public/games/game-111.zip",
      "tags": ["action", "adventure"],
      "developer": "Your Name",
      "releaseDate": "2024-10-04",
      "ageRating": "All Ages",
      "languages": ["English"],
      "createdAt": "2024-10-04T10:30:00.000Z",
      "updatedAt": "2024-10-04T10:30:00.000Z",
      "createdBy": "user@example.com"
    }
  ]
}
```

---

## 🔐 Security Features

### Session-Based Authentication
- No JWT tokens to manage
- Sessions stored server-side
- Automatic session expiry (24 hours)
- Secure cookies (HTTPS in production)

### Root User
- Credentials in `.env` file (never in database)
- Can't be deleted or locked out
- Full administrative access
- Can manage all users

### Regular Users
- Passwords hashed with bcrypt
- Stored in `server/data/users.json`
- Can be added/edited/deleted by root
- Role-based permissions

---

## 🛠️ Troubleshooting

### AWS S3 Errors

**Error: "Access Denied"**
- Check AWS credentials in `.env`
- Verify IAM user has S3 permissions
- Check bucket policy allows PutObject/GetObject

**Error: "Bucket not found"**
- Verify `AWS_S3_BUCKET` name is correct
- Check AWS region matches `AWS_REGION`

### Authentication Issues

**Can't login as root**
- Check `ROOT_EMAIL` and `ROOT_PASSWORD` in `server/.env`
- Restart backend server after changing .env

**Session expired**
- Sessions last 24 hours
- Login again to create new session

### File Upload Issues

**Files not uploading**
- Check AWS credentials are valid
- Verify S3 bucket exists
- Check file size under MAX_FILE_SIZE limit
- Ensure you're logged in

**game-data.json not updating**
- Check S3 bucket permissions
- Verify `public/game-data.json` exists in S3
- Check backend logs for errors

---

## 📞 API Endpoints

### Authentication (Session-Based)
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and destroy session
- `GET /api/auth/me` - Get current user

### User Management (Root Only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

### Games
- `GET /api/games` - Get all games from S3
- `POST /api/games` - Create game (auth required)
- `PUT /api/games/:id` - Update game (auth required)
- `DELETE /api/games/:id` - Delete game (auth required)

### Upload to S3
- `POST /api/upload/files` - Upload multiple files to S3
- `POST /api/upload/file` - Upload single file to S3
- `DELETE /api/upload/file` - Delete file from S3

---

## 🎯 AWS S3 Bucket Policy Example

Add this policy to your S3 bucket to allow public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/public/*"
    }
  ]
}
```

---

## 🔄 CloudFront Setup (Optional)

If using CloudFront:

1. Create CloudFront distribution pointing to S3 bucket
2. Update `CLOUDFRONT_URL` in `server/.env`
3. Update `BASE_URL` in `gamingPortal/src/config/api.js`

Benefits:
- Faster content delivery (CDN)
- HTTPS support
- Better caching
- Lower S3 costs

---

## 💡 Best Practices

1. **Change default credentials** immediately
2. **Use strong passwords** for root and users
3. **Enable MFA** on AWS account
4. **Use IAM user** (not root AWS account) for S3 access
5. **Set up CloudFront** for better performance
6. **Regular backups** of game-data.json from S3
7. **Monitor S3 costs** in AWS console

---

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx        ← Session-based auth
│   ├── components/
│   │   ├── UserManagement/
│   │   │   └── UserManager.jsx    ← User management UI
│   │   └── GameManagement/
│   │       ├── GameUpload.jsx     ← S3 uploads
│   │       └── GameDataViewer.jsx ← View S3 data
│   └── pages/
│       ├── Login.jsx              ← Email-based login
│       └── UserManagement.jsx     ← Root only
└── server/
    ├── server.js                  ← Express + sessions
    ├── utils/
    │   ├── userManager.js         ← User CRUD
    │   └── s3Manager.js           ← S3 operations
    ├── routes/
    │   ├── auth.js                ← Session auth
    │   ├── users.js               ← User management
    │   ├── games.js               ← S3 game data
    │   └── upload.js              ← S3 file uploads
    └── data/
        └── users.json             ← User database
```

---

## ✅ Success Checklist

- [ ] AWS S3 bucket created
- [ ] AWS credentials configured in `.env`
- [ ] Root user credentials changed
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can login as root user
- [ ] Can add new users
- [ ] Files upload to S3 successfully
- [ ] game-data.json updates in S3
- [ ] Games appear in Game Data viewer

---

**🎉 You're all set! Start managing your games with AWS S3! 🚀**
