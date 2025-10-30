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
  const [togglingBanner, setTogglingBanner] = useState({}) // Track which banners are being toggled

  const [formData, setFormData] = useState({
    position: 'left',
    type: '',
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
      // Detect type from existing banner
      let detectedType = banner.type || 'image'
      // Check if URL type (external URL not uploaded file)
      if (banner.url && banner.url.startsWith('http') && !banner.url.includes('/banners/')) {
        detectedType = 'url'
      }
      
      setFormData({
        position: banner.position,
        type: detectedType,
        title: banner.title,
        url: banner.url || '',
        content: banner.content || '',
        link: banner.link || '',
        active: banner.active !== undefined ? banner.active : true
      })
      
      // Set preview URL
      if (banner.url && !banner.url.startsWith('<')) {
        if (detectedType === 'url') {
          setPreviewUrl(banner.url)
        } else {
          setPreviewUrl(banner.url.startsWith('http') ? banner.url : config.aws.getAssetUrl(banner.url, 'banners'))
        }
      }
    } else {
      setEditingBanner(null)
      setFormData({
        position: 'left',
        type: '', // User must select first
        title: '',
        url: '',
        content: '',
        link: '',
        active: true
      })
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
    if (formData.type === 'image' || formData.type === 'gif') {
      if (!file.type.startsWith('image/')) {
        enqueueSnackbar('Please select an image file', { variant: 'error' })
        return
      }
      // For GIF, validate it's actually a GIF
      if (formData.type === 'gif' && !file.type.includes('gif')) {
        enqueueSnackbar('Please select a GIF file', { variant: 'error' })
        return
      }
    } else if (formData.type === 'mp4' || formData.type === 'video') {
      if (!file.type.startsWith('video/')) {
        enqueueSnackbar('Please select a video file', { variant: 'error' })
        return
      }
      // For MP4, validate it's MP4
      if (formData.type === 'mp4' && !file.type.includes('mp4')) {
        enqueueSnackbar('Please select an MP4 video file', { variant: 'error' })
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

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      url: '',
      content: ''
    }))
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleUrlChange = (url) => {
    setFormData(prev => ({ ...prev, url }))
    // Auto-set preview for URL type
    if (formData.type === 'url' && url) {
      setPreviewUrl(url)
    }
  }

  const handleSaveBanner = async () => {
    // Validation
    if (!formData.type) {
      enqueueSnackbar('Please select a banner type first', { variant: 'error' })
      return
    }

    if (!formData.title.trim()) {
      enqueueSnackbar('Please enter a banner title', { variant: 'error' })
      return
    }

    // Type-specific validation
    if (formData.type === 'url' && !formData.url.trim()) {
      enqueueSnackbar('Please enter a valid URL', { variant: 'error' })
      return
    }

    if ((formData.type === 'image' || formData.type === 'gif' || formData.type === 'mp4') && !selectedFile && !formData.url) {
      enqueueSnackbar(`Please upload a ${formData.type.toUpperCase()} file or enter URL`, { variant: 'error' })
      return
    }

    if (formData.type === 'code' && !formData.content.trim()) {
      enqueueSnackbar('Please enter HTML code', { variant: 'error' })
      return
    }

    try {
      setUploadingFile(true)

      let fileUrl = formData.url
      let fileContent = formData.content
      
      // Normalize type for backend (image/gif -> image, mp4 -> video)
      let backendType = formData.type
      if (formData.type === 'gif') {
        backendType = 'image'
      } else if (formData.type === 'mp4') {
        backendType = 'video'
      }

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
        type: backendType,
        title: formData.title,
        url: formData.type === 'code' ? fileContent : fileUrl,
        content: formData.type === 'code' ? fileContent : '',
        link: formData.link || '#',
        active: formData.active
      }

      let response
      if (editingBanner) {
        // Update existing banner
        response = await axios.put(
          config.api.getFullUrl(config.api.endpoints.banners.update(editingBanner.id)),
          bannerData,
          { withCredentials: true }
        )
      } else {
        // Create new banner
        response = await axios.post(
          config.api.getFullUrl(config.api.endpoints.banners.create),
          bannerData,
          { withCredentials: true }
        )
      }

      if (response.data.success) {
        enqueueSnackbar(`Banner ${editingBanner ? 'updated' : 'created'} successfully!`, { variant: 'success' })
        fetchBanners()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      enqueueSnackbar(error.response?.data?.message || `Failed to ${editingBanner ? 'update' : 'create'} banner`, { variant: 'error' })
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

  const getBannerIcon = (type) => {
    switch (type) {
      case 'image':
      case 'gif':
        return <ImageIcon />
      case 'video':
      case 'mp4':
        return <VideoIcon />
      case 'code':
        return <CodeIcon />
      case 'url':
        return <LinkIcon />
      default:
        return <BannerIcon />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'url':
        return 'External URL'
      case 'image':
        return 'Image'
      case 'gif':
        return 'GIF'
      case 'mp4':
        return 'MP4 Video'
      case 'video':
        return 'Video'
      case 'code':
        return 'HTML Code'
      default:
        return type
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ ml: 2 }}
        >
          Add New Banner
        </Button>
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
                {/* Image/GIF/URL Banner Preview */}
                {(banner.type === 'image' || banner.type === 'gif') && banner.url && (
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
                {banner.type === 'url' && banner.url && banner.url.startsWith('http') && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={banner.url}
                    alt={banner.title}
                    sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                    onError={(e) => {
                      e.target.parentElement.innerHTML = '<div style="height:200px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;"><LinkIcon style="fontSize:48;color:#999" /></div>'
                    }}
                  />
                )}
                {(banner.type === 'image' || banner.type === 'gif' || banner.type === 'url') && !banner.url && (
                  <Box sx={{ height: 200, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                  </Box>
                )}
                
                {/* Video/MP4 Banner Preview */}
                {(banner.type === 'video' || banner.type === 'mp4') && banner.url && (
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
                {(banner.type === 'video' || banner.type === 'mp4') && !banner.url && (
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

      {/* Add/Edit Banner Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBanner ? 'Update Banner' : 'Add New Banner'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {/* Step 1: Banner Type Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Banner Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Banner Type"
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    <MenuItem value="url">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon />
                        External URL
                      </Box>
                    </MenuItem>
                    <MenuItem value="image">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImageIcon />
                        Image (JPG/PNG)
                      </Box>
                    </MenuItem>
                    <MenuItem value="gif">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImageIcon />
                        GIF Animation
                      </Box>
                    </MenuItem>
                    <MenuItem value="mp4">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VideoIcon />
                        MP4 Video
                      </Box>
                    </MenuItem>
                    <MenuItem value="code">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CodeIcon />
                        HTML Code
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                {!formData.type && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Please select a banner type first
                  </Typography>
                )}
              </Grid>

              {/* Step 2: Show fields based on selected type */}
              {formData.type && (
                <>
                  {/* Title - Always show */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Banner Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Enter banner title"
                    />
                  </Grid>

                  {/* Position Selection - Only for new banners */}
                  {!editingBanner && (
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Banner Position</InputLabel>
                        <Select
                          value={formData.position}
                          label="Banner Position"
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        >
                          <MenuItem value="left">Left Sidebar</MenuItem>
                          <MenuItem value="right">Right Sidebar</MenuItem>
                          <MenuItem value="bottom">Bottom Banner</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {/* Position Display - For editing */}
                  {editingBanner && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Position"
                        value={formData.position.charAt(0).toUpperCase() + formData.position.slice(1) + ' Banner'}
                        disabled
                        helperText="Position cannot be changed"
                      />
                    </Grid>
                  )}

                  {/* URL Input for 'url' type */}
                  {formData.type === 'url' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="External Image/Video URL"
                        value={formData.url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://example.com/image.jpg or https://example.com/video.mp4"
                        required
                        helperText="Enter full URL to an image or video"
                      />
                    </Grid>
                  )}

                  {/* File Upload for Image */}
                  {formData.type === 'image' && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Upload Image (JPG/PNG)
                        <input
                          type="file"
                          hidden
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleFileSelect}
                        />
                      </Button>
                      {selectedFile && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                      )}
                      {!editingBanner && (
                        <TextField
                          fullWidth
                          label="Or Enter Image URL (Optional)"
                          value={formData.url}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          sx={{ mt: 1 }}
                        />
                      )}
                      {editingBanner && !selectedFile && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Leave empty to keep existing file
                        </Typography>
                      )}
                    </Grid>
                  )}

                  {/* File Upload for GIF */}
                  {formData.type === 'gif' && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Upload GIF Animation
                        <input
                          type="file"
                          hidden
                          accept="image/gif"
                          onChange={handleFileSelect}
                        />
                      </Button>
                      {selectedFile && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                      )}
                      {!editingBanner && (
                        <TextField
                          fullWidth
                          label="Or Enter GIF URL (Optional)"
                          value={formData.url}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          placeholder="https://example.com/animation.gif"
                          sx={{ mt: 1 }}
                        />
                      )}
                      {editingBanner && !selectedFile && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Leave empty to keep existing file
                        </Typography>
                      )}
                    </Grid>
                  )}

                  {/* File Upload for MP4 */}
                  {formData.type === 'mp4' && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Upload MP4 Video
                        <input
                          type="file"
                          hidden
                          accept="video/mp4"
                          onChange={handleFileSelect}
                        />
                      </Button>
                      {selectedFile && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                      )}
                      {!editingBanner && (
                        <TextField
                          fullWidth
                          label="Or Enter Video URL (Optional)"
                          value={formData.url}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          placeholder="https://example.com/video.mp4"
                          sx={{ mt: 1 }}
                        />
                      )}
                      {editingBanner && !selectedFile && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Leave empty to keep existing file
                        </Typography>
                      )}
                    </Grid>
                  )}

                  {/* HTML Code for 'code' type */}
                  {formData.type === 'code' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={8}
                        label="HTML Code"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="<div style='width:100%;height:100%;'>Your HTML code here...</div>"
                        required
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Use responsive CSS (width:100%, height:100%) for best results
                      </Typography>
                    </Grid>
                  )}

                  {/* Click Target URL - Always show */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Click Target URL"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://example.com (leave blank for no link)"
                      helperText="Where to redirect when banner is clicked"
                    />
                  </Grid>

                  {/* Active Toggle */}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                      }
                      label="Active"
                    />
                  </Grid>

                  {/* Preview Card */}
                  {(previewUrl || (formData.type === 'url' && formData.url) || (formData.type === 'code' && formData.content)) && (
                    <Grid item xs={12}>
                      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                          Preview:
                        </Typography>
                        <Box sx={{ 
                          height: 200, 
                          backgroundColor: formData.type === 'code' ? '#f5f5f5' : '#000',
                          borderRadius: 1,
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          {/* Image/GIF/URL Preview */}
                          {(formData.type === 'image' || formData.type === 'gif' || formData.type === 'url') && (previewUrl || formData.url) && (
                            <Box
                              component="img"
                              src={previewUrl || formData.url}
                              alt="Preview"
                              sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.innerHTML = '<div style="height:200px;display:flex;align-items:center;justify-content:center;color:#999;">Preview not available</div>'
                              }}
                            />
                          )}
                          
                          {/* Video/MP4 Preview */}
                          {(formData.type === 'mp4' || formData.type === 'video') && (previewUrl || formData.url) && (
                            <Box
                              component="video"
                              src={previewUrl || formData.url}
                              controls
                              muted
                              sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.innerHTML = '<div style="height:200px;display:flex;align-items:center;justify-content:center;color:#999;">Preview not available</div>'
                              }}
                            />
                          )}
                          
                          {/* Code Preview */}
                          {formData.type === 'code' && formData.content && (
                            <Box
                              sx={{ 
                                height: '100%',
                                overflow: 'auto',
                                p: 1
                              }}
                              dangerouslySetInnerHTML={{ __html: formData.content }}
                            />
                          )}
                          
                          {/* No Preview */}
                          {!previewUrl && !formData.url && formData.type !== 'code' && (
                            <Box sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'text.secondary'
                            }}>
                              {getBannerIcon(formData.type)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                No preview available
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveBanner}
            disabled={uploadingFile || !formData.type}
            startIcon={uploadingFile ? <CircularProgress size={20} /> : null}
          >
            {uploadingFile ? (editingBanner ? 'Updating...' : 'Creating...') : (editingBanner ? 'Update Banner' : 'Create Banner')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BannerManagement

