# 🎮 Game Admin Dashboard

Complete admin dashboard for managing games with AWS S3 integration, session-based authentication, and user management.

## 🚨 **IMPORTANT: Dashboard Not Loading?**

**📖 Read the comprehensive guides:**
- ⚡ **[QUICK_FIX.md](./QUICK_FIX.md)** - Fix dashboard in 2 minutes
- 🔄 **[LOCAL_VS_DEPLOY_GUIDE.md](./LOCAL_VS_DEPLOY_GUIDE.md)** - Local vs Deploy configuration
- 📋 **[QUICK_REFERENCE_CARD.md](./QUICK_REFERENCE_CARD.md)** - Print & keep handy!
- 🔧 **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues & solutions
- 📖 **[CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md)** - Complete setup guide (50+ pages)
- 🎓 **[DETAILED_API_EXPLANATION.md](./DETAILED_API_EXPLANATION.md)** - How API works (Hindi/English)
- 🎨 **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** - Diagrams & visual explanations
- 📝 **[README_HINDI.md](./README_HINDI.md)** - Pure Hindi documentation
- ⚙️ **[ENV_TEMPLATE.md](./ENV_TEMPLATE.md)** - Environment variables template
- 📁 **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - File locations & structure

## 🎯 **NEW: Centralized Configuration System**

- 🔧 **[CONFIGURATION_SETUP.md](./CONFIGURATION_SETUP.md)** - Complete configuration guide
- 🚀 **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - 5-minute quick setup
- 🔄 **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Migrate existing code
- 📄 **`src/config/index.js`** - Single source of truth for all URLs

**✨ NEW FEATURE:** All URLs now managed in ONE place! Automatically switches between development and production.

**⚠️ Most Common Issue:** Backend server is not running. See **QUICK_FIX.md** for immediate solution.

---

## ✨ Features

- ✅ **Session Authentication** - Simple, secure session-based login
- ✅ **Root User System** - Root credentials in .env file
- ✅ **User Management** - Root can add/manage users from dashboard
- ✅ **AWS S3 Storage** - All files stored in S3 (no local storage)
- ✅ **Dynamic game-data.json** - Fetched and updated in S3
- ✅ **File Upload** - GIFs, logos, thumbnails, HTML/ZIP games
- ✅ **CloudFront Ready** - Optimized for CDN delivery
- ✅ **Newest First Sorting** - Latest games shown first in library and dashboard
- ✅ **Upload Tracking** - Recent uploads displayed on dashboard
- ✅ **User Profile** - Shows username/email in header with logout functionality

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

### 2. Configure Backend

Edit `server/.env`:

```env
# Root User (Change these!)
ROOT_EMAIL=root@admin.com
ROOT_PASSWORD=root123

# AWS S3 (Required!)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-bucket-name
CLOUDFRONT_URL=https://your-cloudfront.net
```

### 3. Configure Frontend

Create `.env` in dashboard root:

```env
VITE_API_BASE_URL=http://85.209.95.229:3000/api
```

### 4. Start Servers

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd ..
npm run dev
```

### 5. Login

Open `http://localhost:5173` and login with:
- Email: `root@admin.com`
- Password: `root123`

---

## 📚 Documentation

- **[UPDATED_SETUP_GUIDE.md](./UPDATED_SETUP_GUIDE.md)** - Complete setup guide
- **[server/README.md](./server/README.md)** - Backend API documentation
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide

---

## 🎯 Key Changes from Previous Version

| Old | New |
|-----|-----|
| JWT Authentication | Session-based auth |
| Admin user in code | Root user in .env |
| No user management | Root can add users |
| Local file storage | AWS S3 storage |
| Static game-data.json | Dynamic from S3 |

---

## 📁 System Overview

```
┌─────────────────────────────────────────────┐
│  Frontend (React)                           │
│  - Login page (email/password)              │
│  - Game management                          │
│  - User management (root only)              │
│  - Game data viewer                         │
└─────────────────────────────────────────────┘
                    ↓ Session Cookie
┌─────────────────────────────────────────────┐
│  Backend (Express + Sessions)               │
│  - Session authentication                   │
│  - User management                          │
│  - S3 file uploads                          │
│  - game-data.json in S3                     │
└─────────────────────────────────────────────┘
                    ↓ AWS SDK
┌─────────────────────────────────────────────┐
│  AWS S3 Bucket                              │
│  public/                                    │
│  ├── game-data.json                         │
│  ├── games/                                 │
│  ├── thumbnail/                             │
│  └── gif/                                   │
└─────────────────────────────────────────────┘
```

---

## 👥 User System

### Root User
- **Where:** `server/.env` file
- **Access:** Full control
- **Can:** Manage all users, upload games, edit everything

### Regular Users
- **Where:** `server/data/users.json`
- **Created by:** Root user via dashboard
- **Can:** Upload games, edit game data

---

## 🔧 Configuration

### Server Environment (`server/.env`)

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=change-this-secret

# Root User - Change these!
ROOT_USERNAME=root
ROOT_EMAIL=root@admin.com
ROOT_PASSWORD=root123

# AWS S3 - Required!
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
CLOUDFRONT_URL=https://your-cloudfront.net

# Upload
MAX_FILE_SIZE=52428800
```

### Frontend Environment (`.env`)

```env
VITE_API_BASE_URL=http://85.209.95.229:3000/api
```

---

## 📤 Workflow

### Upload a Game

1. Login as root or user
2. Go to "Upload Game"
3. Fill game details
4. Upload files (thumbnail, game ZIP, logo, GIF)
5. Click "Upload Game"
6. Files → S3, game-data.json → Updated in S3

### Manage Users (Root Only)

1. Login as root
2. Go to "User Management"
3. Click "Add User"
4. Enter username, email, password, role
5. User can now login and upload games

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login as root | Check `ROOT_EMAIL` and `ROOT_PASSWORD` in `server/.env` |
| AWS upload fails | Verify AWS credentials and bucket permissions |
| Session expires | Sessions last 24 hours, login again |
| game-data.json not updating | Check S3 permissions and bucket policy |

---

## 📞 Support

1. Check server logs
2. Check browser console (F12)
3. Read `UPDATED_SETUP_GUIDE.md`
4. Verify AWS credentials
5. Ensure S3 bucket has correct permissions

---

## 🎉 Success Indicators

Everything works when:
- ✅ Backend shows "S3 Bucket: your-bucket-name"
- ✅ Can login with root credentials
- ✅ User Management page visible (root only)
- ✅ Files upload to S3
- ✅ Games appear in Game Data viewer
- ✅ game-data.json updates in S3

---

## 📊 Tech Stack

- **Frontend:** React 18, Material-UI, Axios
- **Backend:** Express, express-session, bcrypt
- **Storage:** AWS S3, AWS SDK v3
- **CDN:** CloudFront (optional)

---

**Made with ❤️ for easy game management**