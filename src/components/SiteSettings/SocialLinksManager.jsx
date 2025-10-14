import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from '../../utils/axios';
import { config } from '../../config';
import { getImageUrl } from '../../utils/apiConfig';

const SocialLinksManager = ({ socialLinks = {}, onChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Convert socialLinks object to array for easier management
  const socialLinksArray = Object.entries(socialLinks).map(([platform, data]) => {
    // Handle both old format (just URL string) and new format (object with url, icon, active)
    if (typeof data === 'string') {
      return {
        platform,
        url: data,
        icon: '', // No default - must be uploaded or loaded from AWS
        active: !!data, // Active if URL exists
        label: platform.charAt(0).toUpperCase() + platform.slice(1)
      };
    } else if (typeof data === 'object' && data !== null) {
      return {
        platform,
        url: data.url || '',
        icon: data.icon || '', // Icon must come from AWS
        active: data.active !== undefined ? data.active : !!data.url,
        label: data.label || platform.charAt(0).toUpperCase() + platform.slice(1)
      };
    }
    return {
      platform,
      url: '',
      icon: '', // No default - must be uploaded to AWS
      active: false,
      label: platform.charAt(0).toUpperCase() + platform.slice(1)
    };
  });

  // Common social platforms
  const defaultPlatforms = ['linkedin', 'instagram', 'twitter', 'facebook', 'youtube', 'tiktok', 'pinterest', 'discord'];

  // Ensure all default platforms are present
  defaultPlatforms.forEach(platform => {
    if (!socialLinksArray.find(link => link.platform === platform)) {
      socialLinksArray.push({
        platform,
        url: '',
        icon: `/public/assets/social-icon/${platform}.png`,
        active: false,
        label: platform.charAt(0).toUpperCase() + platform.slice(1)
      });
    }
  });

  const handleEdit = (link) => {
    setCurrentLink({ ...link });
    setEditDialogOpen(true);
  };

  const handleSaveLink = () => {
    if (!currentLink) return;

    const updatedLinks = { ...socialLinks };
    updatedLinks[currentLink.platform] = {
      url: currentLink.url,
      icon: currentLink.icon,
      active: currentLink.active,
      label: currentLink.label
    };

    onChange(updatedLinks);
    setEditDialogOpen(false);
    setCurrentLink(null);
    enqueueSnackbar('Social link updated successfully', { variant: 'success' });
  };

  const handleToggleActive = (platform, active) => {
    const updatedLinks = { ...socialLinks };
    const linkData = socialLinks[platform];
    
    if (typeof linkData === 'string') {
      updatedLinks[platform] = {
        url: linkData,
        icon: linkData.icon || '', // Keep existing icon or empty
        active: active
      };
    } else if (typeof linkData === 'object') {
      updatedLinks[platform] = {
        ...linkData,
        active: active
      };
    } else {
      updatedLinks[platform] = {
        url: '',
        icon: '', // No default - must be uploaded to AWS
        active: active
      };
    }

    onChange(updatedLinks);
    enqueueSnackbar(`${platform} ${active ? 'shown' : 'hidden'}`, { variant: 'info' });
  };

  const handleIconUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please upload an image file', { variant: 'error' });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      enqueueSnackbar('File size must be less than 2MB', { variant: 'error' });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'social-icons');

      const response = await axios.post(
        config.api.getFullUrl('/upload/file'),
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setCurrentLink({
          ...currentLink,
          icon: response.data.data.path
        });
        enqueueSnackbar('Icon uploaded successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
      enqueueSnackbar('Failed to upload icon', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddCustomPlatform = () => {
    const customName = `custom_${Date.now()}`;
    setCurrentLink({
      platform: customName,
      url: '',
      icon: '', // No default - user must upload icon to AWS
      active: true,
      label: 'Custom Link'
    });
    setEditDialogOpen(true);
  };

  const handleDeleteCustomLink = (platform) => {
    if (!platform.startsWith('custom_')) {
      enqueueSnackbar('Cannot delete default social platforms', { variant: 'warning' });
      return;
    }

    const updatedLinks = { ...socialLinks };
    delete updatedLinks[platform];
    onChange(updatedLinks);
    enqueueSnackbar('Custom link deleted', { variant: 'success' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Social Media Links
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddCustomPlatform}
        >
          Add Custom Link
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Upload custom icons and manage your social media links. Toggle visibility to show/hide links on your website footer.
      </Alert>

      <Grid container spacing={2}>
        {socialLinksArray.map((link) => (
          <Grid item xs={12} sm={6} md={4} key={link.platform}>
            <Card elevation={2}>
              <CardMedia
                component="div"
                sx={{
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  position: 'relative'
                }}
              >
                <img
                  src={getImageUrl(link.icon)}
                  alt={link.label}
                  style={{
                    maxWidth: '50px',
                    maxHeight: '50px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JY29uPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                {!link.active && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <VisibilityOffIcon sx={{ color: 'white' }} />
                  </Box>
                )}
              </CardMedia>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
                  {link.label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {link.url || 'No URL set'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={link.active}
                      onChange={(e) => handleToggleActive(link.platform, e.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="caption">
                      {link.active ? 'Visible' : 'Hidden'}
                    </Typography>
                  }
                />
                <Box>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(link)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {link.platform.startsWith('custom_') && (
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCustomLink(link.platform)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit {currentLink?.label || 'Social Link'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Icon Preview and Upload */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Icon
              </Typography>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}
              >
                {currentLink?.icon && (
                  <img
                    src={getImageUrl(currentLink.icon)}
                    alt="Social Icon"
                    style={{
                      maxWidth: '80px',
                      maxHeight: '80px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ob0ljb248L3RleHQ+PC9zdmc+';
                    }}
                  />
                )}
              </Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Icon'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleIconUpload}
                />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Max 2MB, PNG/JPG/SVG recommended (50x50px)
              </Typography>
            </Box>

            {/* Label */}
            <TextField
              fullWidth
              label="Label"
              value={currentLink?.label || ''}
              onChange={(e) => setCurrentLink({ ...currentLink, label: e.target.value })}
              sx={{ mb: 2 }}
              helperText="Display name for this social link"
            />

            {/* URL */}
            <TextField
              fullWidth
              label="URL"
              value={currentLink?.url || ''}
              onChange={(e) => setCurrentLink({ ...currentLink, url: e.target.value })}
              placeholder="https://example.com/yourprofile"
              sx={{ mb: 2 }}
              helperText="Full URL to your social media profile"
            />

            {/* Active Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={currentLink?.active || false}
                  onChange={(e) => setCurrentLink({ ...currentLink, active: e.target.checked })}
                />
              }
              label="Show on website"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveLink}
            disabled={!currentLink?.url}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialLinksManager;

