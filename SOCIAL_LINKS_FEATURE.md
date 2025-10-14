# Social Links Management Feature

## Overview
The Social Links Management feature allows administrators to fully customize social media links displayed in the website footer. This includes uploading custom icons, editing URLs, and showing/hiding individual social links.

## Features

### ✨ Key Capabilities
1. **Upload Custom Icons** - Upload your own social media icons to AWS S3
2. **Edit URLs** - Add or update social media profile URLs
3. **Show/Hide Links** - Toggle visibility of individual social links
4. **Add Custom Platforms** - Add custom social platforms beyond the defaults
5. **Drag-free Management** - Visual card-based interface for easy management
6. **AWS Integration** - All icons stored in AWS S3 and served via CloudFront

### 🎯 Default Platforms
- LinkedIn
- Instagram
- Twitter/X
- Facebook
- YouTube
- TikTok
- Pinterest
- Discord

## How to Use

### Accessing Social Links Manager
1. Log in to the dashboard at `http://localhost:5174`
2. Navigate to **Site Settings** from the sidebar
3. Click on the **Social Links** tab

### Managing Social Links

#### 1. Edit a Social Link
1. Click the **Edit** button (pencil icon) on any social link card
2. In the dialog:
   - **Upload Icon**: Click "Upload Icon" to upload a custom icon (PNG/JPG/SVG, max 2MB, recommended 50x50px)
   - **Label**: Change the display name (e.g., "LinkedIn" → "Connect on LinkedIn")
   - **URL**: Enter the full URL to your social profile
   - **Show on website**: Toggle to show/hide this link on the website
3. Click **Save Changes**

#### 2. Show/Hide Social Links
- Use the **Visible/Hidden** toggle switch on each card
- Hidden links will appear grayed out with a dashed border
- Hidden links won't appear on the website footer

#### 3. Add Custom Social Platform
1. Click **Add Custom Link** button
2. Upload a custom icon
3. Enter a label (e.g., "Discord Server")
4. Enter the URL
5. Toggle active status
6. Save changes

#### 4. Delete Custom Links
- Only custom platforms can be deleted (not default platforms)
- Click the **Delete** button (trash icon) on custom platform cards
- Confirm deletion

### Saving Changes
1. Make all your changes in the Social Links Manager
2. Click the **Save All Changes** button at the bottom of the page
3. Changes are immediately reflected on the live website

## Technical Details

### Data Structure

#### Old Format (Still Supported)
```json
{
  "socialLinks": {
    "linkedin": "https://linkedin.com",
    "instagram": "https://instagram.com",
    "twitter": "https://x.com",
    "facebook": "",
    "youtube": ""
  }
}
```

#### New Format (Recommended)
```json
{
  "socialLinks": {
    "linkedin": {
      "url": "https://linkedin.com/company/yourcompany",
      "icon": "/public/social-icons/linkedin-1234567890.png",
      "active": true,
      "label": "LinkedIn"
    },
    "instagram": {
      "url": "https://instagram.com/yourprofile",
      "icon": "/public/social-icons/instagram-1234567890.png",
      "active": true,
      "label": "Instagram"
    },
    "custom_discord": {
      "url": "https://discord.gg/yourserver",
      "icon": "/public/social-icons/discord-1234567890.png",
      "active": true,
      "label": "Join Discord"
    }
  }
}
```

### File Upload Details
- **Location**: Dashboard → Site Settings → Social Links tab
- **Folder**: Icons are uploaded to `public/social-icons/` in AWS S3
- **Size Limit**: 2MB per icon
- **Formats**: PNG, JPG, JPEG, GIF, WebP, SVG
- **Recommended Size**: 50x50px for optimal display
- **Storage**: AWS S3 with CloudFront CDN for fast loading

### API Endpoints

#### Upload Social Icon
```
POST /api/upload/file
Headers: 
  - Cookie: session token (authentication required)
  - Content-Type: multipart/form-data
Body:
  - file: <image file>
  - folder: "social-icons"
Response:
  {
    "success": true,
    "data": {
      "path": "/public/social-icons/filename.png",
      "url": "https://cloudfront-url/public/social-icons/filename.png"
    }
  }
```

#### Update Site Settings
```
PUT /api/site-settings
Headers:
  - Cookie: session token (authentication required)
  - Content-Type: application/json
Body:
  {
    "socialLinks": { ... }
  }
Response:
  {
    "success": true,
    "message": "Site settings updated successfully"
  }
```

## Frontend Display

### Footer Component
The website footer automatically displays all active social links:
- Icons load dynamically from AWS CloudFront
- Only active links are shown
- Graceful fallback to default icons if custom icon fails
- Supports both old format (string URLs) and new format (object with url/icon/active)

### Example Display
```
┌─────────────────────────────────────┐
│         Footer Content               │
├─────────────────────────────────────┤
│  [LinkedIn] [Instagram] [Twitter]   │
│     [Facebook] [Discord]             │
└─────────────────────────────────────┘
```

## Best Practices

### Icon Design
1. **Size**: Create icons at 100x100px or larger, then let the system scale down
2. **Format**: Use PNG with transparency for best results
3. **Style**: Keep icons consistent in style (all flat, all colorful, etc.)
4. **Branding**: Use official brand colors/logos when possible

### URL Format
- Always use full URLs: `https://linkedin.com/company/name`
- Don't use shortened URLs (bit.ly, etc.)
- Test URLs before saving
- Use platform-specific profile/page URLs

### Organization
- Hide unused social platforms instead of leaving URLs empty
- Keep labels concise (1-2 words)
- Order custom platforms logically
- Review and update URLs regularly

## Troubleshooting

### Icon Not Displaying
1. Check if the icon was uploaded successfully
2. Verify the icon file format is supported
3. Try re-uploading the icon
4. Check browser console for errors

### Link Not Showing on Website
1. Verify the link is marked as "Active"
2. Check that the URL field is not empty
3. Ensure you clicked "Save Changes"
4. Clear browser cache and reload

### Upload Failed
1. Check file size (must be < 2MB)
2. Verify file format (PNG, JPG, SVG, etc.)
3. Ensure you're logged in
4. Check AWS S3 configuration

### Changes Not Saving
1. Verify you're authenticated (not logged out)
2. Check network connection
3. Review browser console for API errors
4. Ensure backend server is running

## Migration from Old Format

The system automatically handles both formats:

**Old Format (String)**:
```json
"linkedin": "https://linkedin.com"
```

**New Format (Object)**:
```json
"linkedin": {
  "url": "https://linkedin.com",
  "icon": "/public/social-icons/linkedin.png",
  "active": true,
  "label": "LinkedIn"
}
```

When you edit any social link in the dashboard, it automatically converts to the new format.

## Future Enhancements
- Drag-and-drop icon upload
- Icon preview before upload
- Bulk import/export of social links
- Analytics integration (click tracking)
- A/B testing for icon styles

## Support
For issues or questions:
1. Check AWS S3 bucket permissions
2. Verify CloudFront distribution is working
3. Review server logs for upload errors
4. Check browser console for frontend errors

---

**Version**: 1.0  
**Last Updated**: 2025-10-14  
**Component**: Social Links Management  
**Location**: `gamingPortal-dashboard/src/components/SiteSettings/SocialLinksManager.jsx`

