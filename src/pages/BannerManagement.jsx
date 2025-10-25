import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewCarousel as BannerIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Code as CodeIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  Preview as PreviewIcon
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { config } from '../config'
import axios from '../utils/axios'
import { useNavigate } from 'react-router-dom'

const BannerManagement = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [togglingBanner, setTogglingBanner] = useState({}) // Track which banners are being toggled

  const [formData, setFormData] = useState({
    position: 'left',
    type: 'image',
    title: '',
    url: '',
    content: '',
    link: '',
    active: true
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await axios.get(config.api.getFullUrl(config.api.endpoints.banners.list), {
        withCredentials: true,
        timeout: config.api.timeout
      })

      if (response.data.success) {
        setBanners(response.data.data.banners || [])
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      enqueueSnackbar('Failed to load banners', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (banner = null) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        position: banner.position,
        type: banner.type,
        title: banner.title,
        url: banner.url || '',
        content: banner.content || '',
        link: banner.link || '',
        active: banner.active !== undefined ? banner.active : true
      })
      setTabValue(banner.type === 'image' ? 0 : banner.type === 'video' ? 1 : 2)
      
      // Set preview if it's a URL
      if (banner.url && !banner.url.startsWith('<')) {
        setPreviewUrl(banner.url)
      }
    } else {
      setEditingBanner(null)
      setFormData({
        position: 'left',
        type: 'image',
        title: '',
        url: '',
        content: '',
        link: '',
        active: true
      })
      setTabValue(0)
      setPreviewUrl(null)
    }
    setSelectedFile(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingBanner(null)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      enqueueSnackbar('File size should be less than 10MB', { variant: 'error' })
      return
    }

    // Validate file type based on banner type
    if (formData.type === 'image') {
      if (!file.type.startsWith('image/')) {
        enqueueSnackbar('Please select an image file', { variant: 'error' })
        return
      }
    } else if (formData.type === 'video') {
      if (!file.type.startsWith('video/')) {
        enqueueSnackbar('Please select a video file', { variant: 'error' })
        return
      }
    }

    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveBanner = async () => {
    if (!editingBanner) {
      enqueueSnackbar('No banner selected for editing', { variant: 'error' })
      return
    }

    // Validation
    if (!formData.title.trim()) {
      enqueueSnackbar('Please enter a banner title', { variant: 'error' })
      return
    }

    // For code type, we need HTML content
    if (formData.type === 'code' && !formData.content.trim()) {
      enqueueSnackbar('Please enter HTML code', { variant: 'error' })
      return
    }

    try {
      setUploadingFile(true)

      let fileUrl = formData.url
      let fileContent = formData.content

      // Upload file if a new one is selected
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)
        uploadFormData.append('folder', 'banners')

        const uploadResponse = await axios.post(
          config.api.getFullUrl('/upload'),
          uploadFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          }
        )

        if (uploadResponse.data.success) {
          fileUrl = uploadResponse.data.data.path || uploadResponse.data.data.url
        } else {
          throw new Error('File upload failed')
        }
      }

      // Prepare banner data
      const bannerData = {
        position: formData.position,
        type: formData.type,
        title: formData.title,
        url: formData.type === 'code' ? fileContent : fileUrl,
        content: formData.type === 'code' ? fileContent : '',
        link: formData.link || '#',
        active: formData.active
      }

      // Update existing banner
      const response = await axios.put(
        config.api.getFullUrl(config.api.endpoints.banners.update(editingBanner.id)),
        bannerData,
        { withCredentials: true }
      )

      if (response.data.success) {
        enqueueSnackbar('Banner updated successfully!', { variant: 'success' })
        fetchBanners()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error updating banner:', error)
      enqueueSnackbar(error.response?.data?.message || 'Failed to update banner', { variant: 'error' })
    } finally {
      setUploadingFile(false)
    }
  }

  const handleToggleBannerStatus = async (banner) => {
    // Prevent multiple clicks
    if (togglingBanner[banner.id]) {
      return
    }

    // Optimistic update - update UI immediately
    const newActiveState = !banner.active
    setBanners(prevBanners =>
      prevBanners.map(b =>
        b.id === banner.id ? { ...b, active: newActiveState } : b
      )
    )

    // Mark as toggling
    setTogglingBanner(prev => ({ ...prev, [banner.id]: true }))

    try {
      const response = await axios.put(
        config.api.getFullUrl(config.api.endpoints.banners.update(banner.id)),
        { ...banner, active: newActiveState },
        { withCredentials: true }
      )

      if (response.data.success) {
        enqueueSnackbar(`Banner ${newActiveState ? 'activated' : 'deactivated'}!`, { variant: 'success' })
      }
    } catch (error) {
      // Revert on error
      setBanners(prevBanners =>
        prevBanners.map(b =>
          b.id === banner.id ? { ...b, active: banner.active } : b
        )
      )
      enqueueSnackbar('Failed to update banner status', { variant: 'error' })
    } finally {
      // Remove toggling state
      setTogglingBanner(prev => {
        const newState = { ...prev }
        delete newState[banner.id]
        return newState
      })
    }
  }

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return
    }

    try {
      const response = await axios.delete(
        config.api.getFullUrl(config.api.endpoints.banners.delete(bannerId)),
        { withCredentials: true }
      )

      if (response.data.success) {
        enqueueSnackbar('Banner deleted successfully!', { variant: 'success' })
        fetchBanners()
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      enqueueSnackbar('Failed to delete banner', { variant: 'error' })
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setFormData(prev => ({
      ...prev,
      type: newValue === 0 ? 'image' : newValue === 1 ? 'video' : 'code'
    }))
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const getBannerIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon />
      case 'video':
        return <VideoIcon />
      case 'code':
        return <CodeIcon />
      default:
        return <BannerIcon />
    }
  }

  const getPositionLabel = (position) => {
    return position.charAt(0).toUpperCase() + position.slice(1)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading banners...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            🎨 Banner Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage advertising banners for your gaming portal
          </Typography>
        </Box>
      </Box>

      {/* Banner Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Banners
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {banners.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active Banners
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {banners.filter(b => b.active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Left Position
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {banners.filter(b => b.position === 'left').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Bottom Position
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {banners.filter(b => b.position === 'bottom').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Banners List */}
      {banners.length === 0 ? (
        <Paper elevation={2} sx={{ p: 5, textAlign: 'center' }}>
          <BannerIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Banners Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            No banners available. Contact your administrator to add banners.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {banners.map((banner) => (
            <Grid item xs={12} md={6} lg={4} key={banner.id}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Image Banner Preview */}
                {banner.type === 'image' && banner.url && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={banner.url.startsWith('http') ? banner.url : config.aws.getAssetUrl(banner.url, 'banners')}
                    alt={banner.title}
                    sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                    onError={(e) => {
                      console.error('Failed to load banner image:', banner.url)
                      e.target.parentElement.innerHTML = '<div style="height:200px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#999;">Failed to load image</div>'
                    }}
                  />
                )}
                {banner.type === 'image' && !banner.url && (
                  <Box sx={{ height: 200, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  </Box>
                )}
                
                {/* Video Banner Preview */}
                {banner.type === 'video' && banner.url && (
                  <Box sx={{ height: 200, backgroundColor: '#000', position: 'relative' }}>
                    <video
                      src={banner.url.startsWith('http') ? banner.url : config.aws.getAssetUrl(banner.url, 'videos')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      muted
                      onError={(e) => {
                        console.error('Failed to load banner video:', banner.url)
                        e.target.parentElement.innerHTML = '<div style="height:200px;background:#000;display:flex;align-items:center;justify-content:center;color:#666;">Failed to load video</div>'
                      }}
                    />
                    <Box sx={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.7)', px: 1, py: 0.5, borderRadius: 1 }}>
                      <VideoIcon sx={{ fontSize: 16, color: 'white' }} />
                    </Box>
                  </Box>
                )}
                {banner.type === 'video' && !banner.url && (
                  <Box sx={{ height: 200, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <VideoIcon sx={{ fontSize: 48, color: 'grey.700' }} />
                  </Box>
                )}
                
                {/* Code Banner Preview */}
                {banner.type === 'code' && banner.content && (
                  <Box
                    sx={{ 
                      height: 200, 
                      overflow: 'hidden', 
                      backgroundColor: '#f5f5f5',
                      position: 'relative',
                      '&::after': {
                        content: '"HTML"',
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 1,
                        fontSize: '10px',
                        fontWeight: 600
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: banner.content }}
                  />
                )}
                {banner.type === 'code' && !banner.content && (
                  <Box sx={{ height: 200, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CodeIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {getBannerIcon(banner.type)}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {banner.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={getPositionLabel(banner.position)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={banner.type.toUpperCase()}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip
                      label={banner.active ? 'Active' : 'Inactive'}
                      size="small"
                      color={banner.active ? 'success' : 'default'}
                    />
                  </Box>
                  {banner.link && banner.link !== '#' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LinkIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                        {banner.link}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(banner)}
                  >
                    Update
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={banner.active}
                        onChange={() => handleToggleBannerStatus(banner)}
                        disabled={togglingBanner[banner.id]}
                        size="small"
                      />
                    }
                    label={banner.active ? 'Active' : 'Inactive'}
                    labelPlacement="start"
                    sx={{ m: 0 }}
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Banner Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Update Banner
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Banner Type Display (Read-only) */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Banner Type
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {formData.type === 'image' && <ImageIcon color="primary" />}
                {formData.type === 'video' && <VideoIcon color="primary" />}
                {formData.type === 'code' && <CodeIcon color="primary" />}
                <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {formData.type === 'image' ? 'Image/GIF' : formData.type === 'video' ? 'Video' : 'HTML Code'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Banner Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>

              {/* Position (Read-only) */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Position"
                  value={formData.position.charAt(0).toUpperCase() + formData.position.slice(1) + ' Banner'}
                  disabled
                  helperText="Position cannot be changed"
                />
              </Grid>

              {/* File Upload (for Image and Video) */}
              {(formData.type === 'image' || formData.type === 'video') && (
                <>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      Upload New {formData.type === 'image' ? 'Image/GIF' : 'Video'}
                      <input
                        type="file"
                        hidden
                        accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                        onChange={handleFileSelect}
                      />
                    </Button>
                    {selectedFile && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Leave empty to keep existing file
                    </Typography>
                  </Grid>
                </>
              )}

              {/* HTML Code (for Code type) */}
              {formData.type === 'code' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="HTML Code"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="<div>Your HTML code here...</div>"
                    required
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Use responsive CSS (width:100%, height:100%) for best results
                  </Typography>
                </Grid>
              )}

              {/* Link */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Click Target URL"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </Grid>

              {/* Preview */}
              {previewUrl && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Preview:
                  </Typography>
                  {formData.type === 'image' && (
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Preview"
                      sx={{ maxWidth: '100%', maxHeight: 300, borderRadius: 1 }}
                    />
                  )}
                  {formData.type === 'video' && (
                    <Box
                      component="video"
                      src={previewUrl}
                      controls
                      sx={{ maxWidth: '100%', maxHeight: 300, borderRadius: 1 }}
                    />
                  )}
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveBanner}
            disabled={uploadingFile}
            startIcon={uploadingFile ? <CircularProgress size={20} /> : null}
          >
            {uploadingFile ? 'Updating...' : 'Update Banner'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BannerManagement

