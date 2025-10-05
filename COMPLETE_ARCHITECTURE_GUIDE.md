# 🎮 Complete Game Portal Architecture Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [API Endpoints](#api-endpoints)
3. [Data Flow](#data-flow)
4. [Current Issues & Solutions](#current-issues--solutions)
5. [AWS Configuration](#aws-configuration)
6. [Frontend-Backend Communication](#frontend-backend-communication)
7. [File Upload Process](#file-upload-process)
8. [Game Data Management](#game-data-management)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🏗️ System Overview

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   Backend API   │    │   AWS S3        │
│   (Port 5173)   │◄──►│   (Port 3000)   │◄──►│   Bucket        │
│                 │    │                 │    │                 │
│ - Game Upload   │    │ - File Upload   │    │ - game-data.json│
│ - Game Library  │    │ - Game CRUD     │    │ - Game Files    │
│ - User Mgmt     │    │ - Auth          │    │ - Images        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Gaming Portal │    │   CloudFront    │    │   Global CDN    │
│   (Port 3000)   │◄──►│   Distribution  │◄──►│   Delivery      │
│                 │    │                 │    │                 │
│ - Game Display  │    │ - Cached Files  │    │ - Fast Loading  │
│ - Game Play     │    │ - HTTPS         │    │ - Global Access │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Components
- **Dashboard Frontend**: React app for admin management
- **Backend API**: Express.js server handling file operations
- **AWS S3**: Cloud storage for games and metadata
- **CloudFront**: CDN for fast global delivery
- **Gaming Portal**: Public-facing game library

---

## 🔗 API Endpoints

### Authentication Endpoints
```
POST /api/auth/login
- Description: Login with root credentials
- Body: { email, password }
- Response: { success, user, message }

GET /api/auth/me
- Description: Get current user info
- Response: { success, user }

POST /api/auth/logout
- Description: Logout current user
- Response: { success, message }
```

### Game Management Endpoints
```
GET /api/games
- Description: Fetch all games from S3
- Response: { success, data: { games: [] } }

POST /api/games
- Description: Create new game entry
- Body: { name, category, description, etc. }
- Response: { success, game }

PUT /api/games/:id
- Description: Update existing game
- Body: { name, category, description, etc. }
- Response: { success, game }

DELETE /api/games/:id
- Description: Delete game from S3
- Response: { success, message }
```

### File Upload Endpoints
```
POST /api/upload/files
- Description: Upload game files to S3
- Content-Type: multipart/form-data
- Files: gameFile, thumbnail, gif
- Response: { success, files: { gameFile, thumbnail, gif } }
```

### User Management Endpoints (Root Only)
```
GET /api/users
- Description: Get all users
- Response: { success, users }

POST /api/users
- Description: Create new user
- Body: { email, password, role }
- Response: { success, user }

PUT /api/users/:id
- Description: Update user
- Response: { success, user }

DELETE /api/users/:id
- Description: Delete user
- Response: { success, message }
```

### Health Check
```
GET /api/health
- Description: Server status and configuration
- Response: { status, message, timestamp, s3Configured, rootUser }
```

---

## 🔄 Data Flow

### 1. Game Upload Flow
```
Dashboard → Backend API → AWS S3 → CloudFront → Gaming Portal
```

**Detailed Steps:**
1. **Dashboard**: User uploads game files (ZIP, PNG, GIF)
2. **Backend**: Receives files via multer middleware
3. **AWS S3**: Files uploaded to specific folders
4. **JSON Update**: game-data.json updated with new game info
5. **CloudFront**: Files cached and distributed globally
6. **Gaming Portal**: Reads updated JSON and displays new games

### 2. Game Fetch Flow
```
Gaming Portal → CloudFront → AWS S3 → JSON Response
```

**Detailed Steps:**
1. **Gaming Portal**: Requests game data
2. **CloudFront**: Serves cached game-data.json
3. **AWS S3**: Source of truth for game data
4. **Response**: JSON with all game information

### 3. Real-time Updates
```
Dashboard Upload → S3 Update → CloudFront Invalidation → Gaming Portal Refresh
```

---

## 🚨 Current Issues & Solutions

### Issue 1: S3 Bucket Error
**Error**: `S3 Error: No value provided for input HTTP label: Bucket.`

**Root Cause**: AWS credentials are dummy values, but the system is still trying to make real S3 calls.

**Solution**: Update `.env` file with real AWS credentials:

```env
# Current (WRONG)
AWS_ACCESS_KEY_ID=dummy-key
AWS_SECRET_ACCESS_KEY=dummy-secret
AWS_S3_BUCKET=your-existing-bucket

# Should be (CORRECT)
AWS_ACCESS_KEY_ID=AKIA...YOUR_REAL_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_REAL_SECRET_KEY
AWS_S3_BUCKET=your-actual-bucket-name
```

### Issue 2: Fallback System Not Working
**Problem**: Even with dummy credentials, the system should return empty data gracefully.

**Current Status**: ✅ FIXED - The fallback system is working, but you're seeing the error logs.

---

## ☁️ AWS Configuration

### Required AWS Services
1. **S3 Bucket**: For file storage
2. **CloudFront**: For CDN delivery
3. **IAM User**: For API access

### S3 Bucket Structure
```
your-bucket-name/
└── public/
    ├── game-data.json          ← Main game metadata
    ├── games/                  ← Game ZIP files
    │   ├── game1.zip
    │   └── game2.zip
    ├── thumbnail/              ← Game logos/thumbnails
    │   ├── game1.png
    │   └── game2.png
    └── gif/                    ← Preview animations
        ├── game1.gif
        └── game2.gif
```

### CloudFront Configuration
```
Distribution URL: https://d1xtpep1y73br3.cloudfront.net
Origin: your-s3-bucket-name.s3.amazonaws.com
Cache Behavior: Cache based on selected request headers
Default TTL: 86400 (24 hours)
```

---

## 🌐 Frontend-Backend Communication

### Dashboard Frontend (Port 5173)
```javascript
// API Configuration
const API_BASE_URL = 'http://85.209.95.229:3000/api'

// Example: Fetch Games
const fetchGames = async () => {
  const response = await axios.get(`${API_BASE_URL}/games`)
  return response.data
}

// Example: Upload Game
const uploadGame = async (gameData) => {
  const response = await axios.post(`${API_BASE_URL}/games`, gameData)
  return response.data
}
```

### Backend API (Port 3000)
```javascript
// Routes Configuration
app.use('/api/auth', authRoutes)      // Authentication
app.use('/api/games', gameRoutes)     // Game management
app.use('/api/upload', uploadRoutes)  // File uploads
app.use('/api/users', userRoutes)     // User management

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

---

## 📤 File Upload Process

### 1. Frontend Upload Component
```javascript
// GameUpload.jsx
const handleSubmit = async (formData) => {
  // Upload files first
  const filesResponse = await fetch('/api/upload/files', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  
  // Then create game entry
  const gameResponse = await fetch('/api/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData),
    credentials: 'include'
  })
}
```

### 2. Backend Upload Handler
```javascript
// routes/upload.js
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET,
    key: (req, file, cb) => {
      const folder = getFolderByFileType(file.fieldname)
      const fileName = generateFileName(file.originalname)
      cb(null, `public/${folder}/${fileName}`)
    }
  })
})

app.post('/files', upload.fields([
  { name: 'gameFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gif', maxCount: 1 }
]), async (req, res) => {
  // Handle uploaded files
})
```

### 3. S3 Upload Process
```javascript
// utils/s3Manager.js
export const uploadFileToS3 = async (file, folder = '') => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: `public/${folder}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: 'public, max-age=31536000'
    }
  })
  
  await upload.done()
  
  return {
    key: `public/${folder}/${fileName}`,
    url: `${cloudFrontUrl}/public/${folder}/${fileName}`,
    path: `/public/${folder}/${fileName}`
  }
}
```

---

## 📊 Game Data Management

### game-data.json Structure
```json
{
  "games": [
    {
      "id": "unique-game-id",
      "name": "Game Name",
      "slug": "game-name",
      "description": "Game description",
      "thumb_url": "public/thumbnail/game.png",
      "logo_url": "public/thumbnail/game.png",
      "gif_url": "public/gif/game.gif",
      "play_url": "games/Game Name/",
      "size": "small|medium|large",
      "category": "Arcade|Puzzle|Action",
      "featured": true|false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "developer": "Developer Name"
    }
  ]
}
```

### Data Flow for Updates
```javascript
// When new game is added:
1. Upload files to S3
2. Get file URLs from S3
3. Read current game-data.json
4. Add new game to games array
5. Write updated JSON back to S3
6. CloudFront cache invalidation (optional)
```

---

## 🔧 Troubleshooting Guide

### Common Issues

#### 1. "S3 Error: No value provided for input HTTP label: Bucket"
**Cause**: Dummy AWS credentials
**Solution**: 
```bash
# Check current credentials
Get-Content .env | Select-String "AWS_"

# Update with real credentials
notepad .env
```

#### 2. "Failed to load games from S3"
**Cause**: Network/authentication issues
**Solution**:
```bash
# Test API directly
Invoke-WebRequest -Uri "http://85.209.95.229:3000/api/games"

# Check server logs
npm start
```

#### 3. "CORS error" in browser
**Cause**: Frontend/backend port mismatch
**Solution**:
```javascript
// Backend CORS config
app.use(cors({
  origin: 'http://localhost:5173', // Match your frontend port
  credentials: true
}))
```

#### 4. "401 Unauthorized" on API calls
**Cause**: Session not established
**Solution**:
```javascript
// Ensure credentials are included
fetch('/api/games', {
  credentials: 'include' // Important!
})
```

### Debug Commands
```bash
# Check if server is running
netstat -ano | findstr :3000

# Test health endpoint
Invoke-WebRequest -Uri "http://85.209.95.229:3000/api/health"

# Check environment variables
Get-Content .env

# Restart server
taskkill /F /IM node.exe
npm start
```

---

## 🚀 Next Steps

### Immediate Actions Required:
1. **Get real AWS credentials** from AWS Console
2. **Update .env file** with actual values
3. **Restart server** to load new credentials
4. **Test file upload** functionality

### Long-term Improvements:
1. **Set up CloudFront invalidation** for real-time updates
2. **Implement user roles** and permissions
3. **Add game analytics** and statistics
4. **Set up automated backups** of game data

---

## 📞 Support

If you encounter issues:
1. Check the server console for error messages
2. Verify your `.env` file has correct values
3. Test API endpoints directly with PowerShell
4. Ensure both frontend and backend are running on correct ports

**Remember**: The system is designed to work with real AWS credentials. The dummy values are only for testing the basic structure.
