import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
} from '@mui/material'
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Preview as PreviewIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  ArrowBack as ArrowBackIcon,
  Image as ImageIcon,
  VideogameAsset as GameIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useSnackbar } from 'notistack'
import { useDropzone } from 'react-dropzone'
import axios from '../../utils/axios'
import { config } from '../../config'

const categories = ['Action', 'Adventure', 'Puzzle', 'Racing', 'Sports', 'Strategy', 'RPG', 'Card', 'Arcade', 'Board', 'Casino', 'Educational', 'Music', 'Simulation', 'Trivia', 'Word']
const sizes = ['small', 'medium', 'large']

// File Upload Zone Component
const FileUploadZone = ({ onDrop, accept, label, icon, file, isUploading }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled: isUploading,
  })

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.300',
        borderRadius: 2,
         p: 2,
        textAlign: 'center',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.3s',
        opacity: isUploading ? 0.6 : 1,
        '&:hover': {
          borderColor: isUploading ? 'grey.300' : 'primary.main',
          backgroundColor: isUploading ? 'background.paper' : 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />
      {icon}
      <Typography variant="body2" sx={{ mt: 1, mb: 0 }}>
        {label}
      </Typography>
      {file && (
        <Chip
          label={file.name}
          size="xsmall"
          color="primary"
          sx={{ mt: 1 }}
        />
      )}
      <Typography variant="caption" color="text.secondary">
        {isUploading ? 'Uploading...' : (isDragActive ? 'Drop file here' : '')}
      </Typography>
    </Box>
  )
}

const GameEditor = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { isAuthenticated, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    size: 'small',
    thumb_url: '',
    play_url: '',
  })

  const [cloudFrontUrl, setCloudFrontUrl] = useState(null)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newFiles, setNewFiles] = useState({
    thumbnail: null,
    icon: null,
    gif: null,
    htmlZip: null,
  })
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)

  // Load game data when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please login to edit games')
      setLoading(false)
      return
    }
    
    if (gameId) {
      fetchGameData()
    } else {
      setLoading(false)
    }
  }, [gameId, isAuthenticated])

  const fetchGameData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(config.api.getFullUrl(config.api.endpoints.games.single(gameId)), {
        timeout: config.api.timeout
      })
      
      if (response.data.success) {
        const game = response.data.data
        setFormData({
          name: game.name || '',
          description: game.description || '',
          category: game.category || '',
          size: game.size || 'small',
          thumb_url: game.thumb_url || '',
          play_url: game.play_url || '',
        })
        
        // Set CloudFront URL from centralized config
        setCloudFrontUrl(config.aws.cloudFrontUrl)
        
        console.log('🎮 Loaded game for editing:', game)
      }
    } catch (error) {
      console.error('Error fetching game:', error)
      setError('Failed to load game data. Please check your connection and try again.')
      enqueueSnackbar('Failed to load game data', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please login to save games', { variant: 'error' })
      navigate('/login')
      return
    }

    try {
      setSaving(true)
      
      // Prepare the data to send
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        size: formData.size,
      }
      
      console.log('Saving game data:', updateData)
      console.log('User authenticated:', isAuthenticated, 'User:', user)
      
      const response = await axios.put(config.api.getFullUrl(config.api.endpoints.games.update(gameId)), updateData, {
        withCredentials: true,
        timeout: config.api.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Save response:', response.data)
      
      if (response.data.success) {
        enqueueSnackbar('Game saved successfully!', { variant: 'success' })
        // Refresh the game data to show updated info
        await fetchGameData()
      } else {
        enqueueSnackbar(response.data.message || 'Failed to save game', { variant: 'error' })
      }
    } catch (error) {
      console.error('Error saving game:', error)
      
      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        enqueueSnackbar('Session expired. Please login again.', { variant: 'error' })
        navigate('/login')
        return
      }
      
      if (error.response?.data?.message) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' })
      } else {
        enqueueSnackbar('Failed to save game. Please check your connection and try again.', { variant: 'error' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = () => {
    handleInputChange('status', 'published')
    enqueueSnackbar('Game published successfully', { variant: 'success' })
  }

  const handlePreview = () => {
    if (formData.play_url) {
      const gameUrl = getGameUrl(formData.play_url, cloudFrontUrl)
      window.open(gameUrl, '_blank')
      enqueueSnackbar('Opening game preview...', { variant: 'info' })
    } else {
      enqueueSnackbar('No game URL available for preview', { variant: 'warning' })
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      try {
        const response = await axios.delete(config.api.getFullUrl(config.api.endpoints.games.delete(gameId)), {
          withCredentials: true,
          timeout: config.api.timeout
        })
        
        console.log('Delete response:', response.data)
        
        if (response.data.success) {
          enqueueSnackbar('Game deleted successfully', { variant: 'success' })
          navigate('/games/library')
        } else {
          enqueueSnackbar(response.data.message || 'Failed to delete game', { variant: 'error' })
        }
      } catch (error) {
        console.error('Error deleting game:', error)
        if (error.response?.data?.message) {
          enqueueSnackbar(error.response.data.message, { variant: 'error' })
        } else {
          enqueueSnackbar('Failed to delete game. Please check your connection and try again.', { variant: 'error' })
        }
      }
    }
  }

  const handleBack = () => {
    navigate('/games/library')
  }

  const handleFileUpload = (type) => (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setNewFiles((prev) => ({ ...prev, [type]: acceptedFiles[0] }))
      enqueueSnackbar(`${type} file selected for update`, { variant: 'info' })
    }
  }

  const handleUpdateFiles = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please login to update game assets', { variant: 'error' })
      navigate('/login')
      return
    }

    const filesToUpload = Object.entries(newFiles).filter(([_, file]) => file !== null)
    
    if (filesToUpload.length === 0) {
      enqueueSnackbar('No files selected for update', { variant: 'warning' })
      return
    }

    try {
      setUploadingFiles(true)
      setUploadProgress(0)
      setUploadModalOpen(true)

      // Create FormData with only the files that were selected
      const uploadFormData = new FormData()
      filesToUpload.forEach(([type, file]) => {
        uploadFormData.append(type, file)
      })

      setUploadProgress(30)
      const uploadResponse = await axios.post(config.api.getFullUrl(config.api.endpoints.upload.files), uploadFormData, {
        withCredentials: true,
        timeout: 60000, // 60 seconds for file uploads
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (!uploadResponse.data.success) {
        throw new Error('File upload failed')
      }

      const uploadData = uploadResponse.data.data
      setUploadProgress(60)

      // Update game data with new file URLs
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        size: formData.size,
      }

      // Update URLs for uploaded files
      if (uploadData.thumbnail) {
        updateData.thumb_url = uploadData.thumbnail.path
        updateData.logo_url = uploadData.thumbnail.path
      }
      if (uploadData.icon) {
        updateData.logo_url = uploadData.icon.path
      }
      if (uploadData.gif) {
        updateData.gif_url = uploadData.gif.path
      }
      if (uploadData.htmlZip) {
        // Extract folder name from ZIP file for play_url
        const zipName = uploadData.htmlZip.originalName
        const playUrlFolder = zipName.replace(/\.zip$/i, '')
        updateData.play_url = `games/${playUrlFolder}/`
      }

      setUploadProgress(80)
      const gameResponse = await axios.put(config.api.getFullUrl(config.api.endpoints.games.update(gameId)), updateData, {
        withCredentials: true,
        timeout: config.api.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!gameResponse.data.success) {
        throw new Error('Failed to update game data')
      }

      setUploadProgress(100)
      
      // Close upload modal and show success modal
      setUploadModalOpen(false)
      setSuccessModalOpen(true)
      
      // Clear uploaded files and refresh game data
      setNewFiles({ thumbnail: null, icon: null, gif: null, htmlZip: null })
      await fetchGameData()
      
      // Auto close success modal and redirect after 3 seconds
      setTimeout(() => {
        setSuccessModalOpen(false)
        navigate('/games/library')
      }, 3000)
    } catch (error) {
      console.error('Update error:', error)
      
      // Close upload modal on error
      setUploadModalOpen(false)
      
      // Handle authentication errors specifically
      if (error.response?.status === 401) {
        enqueueSnackbar('Session expired. Please login again.', { variant: 'error' })
        navigate('/login')
        return
      }
      
      enqueueSnackbar(error.response?.data?.message || error.message || 'Failed to update game assets', { variant: 'error' })
    } finally {
      setUploadingFiles(false)
    }
  }

  // Helper function to get full image URL from S3 path
  const getImageUrl = (imagePath, cloudFrontUrl) => {
    if (!imagePath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath
    
    // Clean the path - remove leading slash and public/ if present
    let cleanPath = imagePath.replace(/^\/?public\//, '')
    
    // Use CloudFront URL if available
    if (cloudFrontUrl) {
      return `${cloudFrontUrl}/public/${cleanPath}`
    }
    
    // Fallback to direct S3 URL
    return `https://gameportal-assets.s3.amazonaws.com/public/${cleanPath}`
  }

  // Helper function to get game play URL
  const getGameUrl = (playUrl, cloudFrontUrl) => {
    if (!playUrl) return '#'
    
    // If it's already a full URL, return as is
    if (playUrl.startsWith('http')) return playUrl
    
    // Clean the path - remove leading slash and public/ if present
    let cleanPath = playUrl.replace(/^\/?public\//, '')
    
    // Use CloudFront URL if available
    if (cloudFrontUrl) {
      return `${cloudFrontUrl}/public/${cleanPath}`
    }
    
    // Fallback to direct S3 URL
    return `https://gameportal-assets.s3.amazonaws.com/public/${cleanPath}`
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading game data...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        {error === 'Please login to edit games' ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
            <Button variant="outlined" onClick={() => navigate('/games/library')}>
              Back to Library
            </Button>
          </Box>
        ) : (
          <Button variant="contained" onClick={fetchGameData}>
            Retry
          </Button>
        )}
      </Box>
    )
  }

  if (!gameId) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No game ID provided. Please select a game from the library to edit.
        </Alert>
        <Button variant="contained" onClick={handleBack}>
          Back to Library
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            ✏️ Edit Game {formData.name && `- ${formData.name}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
          >
            Preview
          </Button>
          {/* <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="contained"
            startIcon={<PublishIcon />}
            onClick={handlePublish}
          >
            Publish
          </Button> */}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Game Preview Section */}
        <Grid item xs={12} md={4}>
          {/* <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              🎮 Game Preview
            </Typography>
            <Box
              sx={{
                width: '100%',
           
                backgroundColor: 'grey.200',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <img
                src={getImageUrl(formData.thumb_url, cloudFrontUrl)}
                alt={formData.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.200'
                }}
              >
                <Button variant="contained" size="large" startIcon={<PreviewIcon />}>
                  Play Game
                </Button>
              </Box>
            </Box>
          </Paper> */}

          {/* File Upload Section */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
              📁 Update Assets
            </Typography>

            {uploadingFiles && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Uploading files... {uploadProgress}%
                </Typography>
                <Box sx={{ width: '100%', mt: 1 }}>
                  <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1 }}>
                    <Box 
                      sx={{ 
                        width: `${uploadProgress}%`, 
                        bgcolor: 'primary.main', 
                        height: 8, 
                        borderRadius: 1,
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </Box>
                </Box>
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FileUploadZone
                  onDrop={handleFileUpload('thumbnail')}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                  label="Update Thumbnail"
                  icon={<ImageIcon sx={{ fontSize: 32, color: 'primary.main' }} />}
                  file={newFiles.thumbnail}
                  isUploading={uploadingFiles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FileUploadZone
                  onDrop={handleFileUpload('icon')}
                  accept={{ 'image/*': ['.png', '.svg', '.jpg', '.jpeg'] }}
                  label="Update Icon"
                  icon={<ImageIcon sx={{ fontSize: 32, color: 'secondary.main' }} />}
                  file={newFiles.icon}
                  isUploading={uploadingFiles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FileUploadZone
                  onDrop={handleFileUpload('gif')}
                  accept={{ 'image/gif': ['.gif'] }}
                  label="Update GIF"
                  icon={<ImageIcon sx={{ fontSize: 32, color: 'warning.main' }} />}
                  file={newFiles.gif}
                  isUploading={uploadingFiles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FileUploadZone
                  onDrop={handleFileUpload('htmlZip')}
                  accept={{ 'application/zip': ['.zip'] }}
                  label="Update(ZIP)"
                  icon={<GameIcon sx={{ fontSize: 32, color: 'success.main' }} />}
                  file={newFiles.htmlZip}
                  isUploading={uploadingFiles}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleUpdateFiles}
                disabled={uploadingFiles || Object.values(newFiles).every(file => file === null)}
                startIcon={<UploadIcon />}
                size="large"
              >
                {uploadingFiles ? 'Uploading...' : 'Update Assets'}
              </Button>
            </Box>
          </Paper>

          {/* Game Info Section */}
          {/* <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              🎮 Game Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Game ID
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {gameId}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Category
              </Typography>
              <Chip label={formData.category} color="primary" size="small" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Size
              </Typography>
              <Chip label={formData.size} color="secondary" size="small" />
            </Box>
            <Button 
              fullWidth 
              variant="outlined" 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ mt: 2 }}
            >
              Delete Game
            </Button>
          </Paper> */}
        </Grid>

        {/* Metadata Editor Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              📝 Game Information
            </Typography>

             <TextField
               fullWidth
               label="Game Name"
               value={formData.name}
               onChange={(e) => handleInputChange('name', e.target.value)}
               disabled={uploadingFiles}
               sx={{ mb: 2 }}
             />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={Array.isArray(formData.category) ? formData.category : [formData.category].filter(Boolean)}
                label="Categories"
                onChange={(e) => handleInputChange('category', e.target.value)}
                disabled={uploadingFiles}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                Select one or more categories
              </Typography>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={formData.size}
                label="Size"
                onChange={(e) => handleInputChange('size', e.target.value)}
                disabled={uploadingFiles}
              >
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={3}
              disabled={uploadingFiles}
              sx={{ mb: 2 }}
            />


            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                size="large"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Paper>

          {/* Analytics Preview */}
          {/* <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              📊 Game Analytics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Plays
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  12,543
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Rating
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  4.7/5
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Avg. Session
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  8.5m
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Completion
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  67%
                </Typography>
              </Grid>
            </Grid>
          </Paper> */}
         </Grid>
       </Grid>

       {/* Upload Progress Modal */}
       <Dialog open={uploadModalOpen} maxWidth="sm" fullWidth>
         <DialogContent sx={{ textAlign: 'center', py: 4 }}>
           <CloudUploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
           <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
             Uploading Game Assets
           </Typography>
           <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
             Please wait while we upload your files to the cloud...
           </Typography>
           
           <Box sx={{ width: '100%', mb: 2 }}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography variant="body2" color="text.secondary">
                 Upload Progress
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 {uploadProgress}%
               </Typography>
             </Box>
             <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1 }}>
               <Box 
                 sx={{ 
                   width: `${uploadProgress}%`, 
                   bgcolor: 'primary.main', 
                   height: 8, 
                   borderRadius: 1,
                   transition: 'width 0.3s ease'
                 }} 
               />
             </Box>
           </Box>
           
           <CircularProgress sx={{ color: 'primary.main' }} />
         </DialogContent>
       </Dialog>

       {/* Success Modal */}
       <Dialog open={successModalOpen} maxWidth="sm" fullWidth>
         <DialogContent sx={{ textAlign: 'center', py: 4 }}>
           <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
           <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
             Upload Successful!
           </Typography>
           <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
             Your game assets have been successfully updated and saved.
           </Typography>
           <Typography variant="body2" color="text.secondary">
             Redirecting to Game Library...
           </Typography>
           
           <CircularProgress size={24} sx={{ color: 'primary.main', mt: 2 }} />
         </DialogContent>
       </Dialog>
     </Box>
   )
 }
 
 export default GameEditor
