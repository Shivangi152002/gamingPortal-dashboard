# 🚀 Quick Start Guide

Get your Gaming Portal Admin Dashboard up and running in 5 minutes!

## ⚡ Fast Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18.2
- Material-UI v5
- React Router v6
- Recharts for analytics
- AWS SDK v3
- And more...

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
# Minimal configuration to get started
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AWS_REGION=us-east-1
```

For full AWS integration, see `.env.example` for all configuration options.

### 3. Start Development Server

```bash
npm run dev
```

Your dashboard will open at: **http://localhost:3000**

## 🎯 What You'll See

### Main Features Available:

1. **📊 Dashboard** (`/dashboard`)
   - Quick stats overview
   - Performance charts
   - Recent games
   - System health status

2. **🎮 Game Management**
   - **Library** (`/games/library`) - Browse and manage all games
   - **Upload** (`/games/upload`) - Upload new HTML5 games
   - **Editor** (`/games/editor`) - Edit game metadata and assets

3. **☁️ AWS Console**
   - **S3 Manager** (`/aws/s3`) - File management
   - **CloudFront** (`/aws/cloudfront`) - CDN management
   - **Performance** (`/aws/performance`) - Storage analytics

4. **📈 Analytics** (`/analytics`)
   - User engagement metrics
   - Top performing games
   - Traffic sources
   - Device breakdown

## 🎨 Default Theme

The dashboard uses Material-UI with a custom color scheme:
- Primary: Blue (#1976d2)
- Secondary: Green (#388e3c)
- Accent: Orange (#f57c00)

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Testing on Mobile

The dashboard is fully responsive. To test on your device:

1. Find your local IP address:
   ```bash
   ipconfig
   ```

2. Access from mobile:
   ```
   http://YOUR_LOCAL_IP:3000
   ```

## 🚀 Next Steps

### For Development:
1. Customize the theme in `src/theme.js`
2. Add your API endpoints in `src/services/`
3. Modify components in `src/components/`
4. Update mock data with real API calls

### For Production:
1. Set up AWS S3, CloudFront, Lambda, and DynamoDB
2. Configure environment variables for production
3. Build the project: `npm run build`
4. Deploy to your hosting platform

## 💡 Pro Tips

1. **Mock Data**: The dashboard currently uses mock data. Replace it with real API calls in the service files.

2. **AWS Integration**: To enable full AWS functionality:
   - Create S3 buckets
   - Set up CloudFront distribution
   - Create Lambda functions
   - Configure DynamoDB tables
   - See `README.md` for detailed AWS setup

3. **Customization**: 
   - Theme: `src/theme.js`
   - Layout: `src/components/Common/Layout.jsx`
   - Sidebar menu: `src/components/Common/Sidebar.jsx`

4. **File Upload**: The drag-and-drop upload is implemented in:
   - `src/components/GameManagement/GameUpload.jsx`
   - Uses `react-dropzone` for functionality

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001, // Change to available port
}
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check for linting errors
npm run lint

# Clear Vite cache
rm -rf node_modules/.vite
```

## 📚 Additional Resources

- [Full README](README.md) - Complete documentation
- [Material-UI Docs](https://mui.com/) - Component documentation
- [React Router Docs](https://reactrouter.com/) - Routing guide
- [Vite Docs](https://vitejs.dev/) - Build tool documentation

## 🎉 You're Ready!

Your Gaming Portal Admin Dashboard is now set up and running!

Start by:
1. Exploring the dashboard features
2. Uploading a test game
3. Checking the analytics
4. Customizing to your needs

**Happy Coding! 🚀**
