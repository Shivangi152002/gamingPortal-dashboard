import React, { useState, useCallback } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  OutlinedInput,
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  VideogameAsset as GameIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useSnackbar } from 'notistack'
import axios from '../../utils/axios'
import { config } from '../../config'

const categories = ['Action', 'Adventure', 'Puzzle', 'Racing', 'Sports', 'Strategy', 'RPG', 'Card', 'Arcade']
const sizes = ['small', 'medium', 'large']

const FileUploadZone = ({ onDrop, accept, label, icon, file, error }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  })

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: error 
            ? 'error.main' 
            : (isDragActive ? 'primary.main' : 'grey.300'),
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: error ? 'error.main' : 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
      <input {...getInputProps()} />
      {icon}
      <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
        {label}
      </Typography>
      {file && (
        <Chip
          label={file.name}
          onDelete={() => {}}
          deleteIcon={<DeleteIcon />}
          color="primary"
          sx={{ mt: 1 }}
        />
      )}
      <Typography variant="caption" color="text.secondary">
        {isDragActive ? 'Drop file here' : 'Click or drag to upload'}
      </Typography>
      </Box>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

const GameUpload = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [step, setStep] = useState(1) // 1: Upload files, 2: Enter details
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: [], // Changed to array for multiple categories
    size: '',
  })
  const [errors, setErrors] = useState({})
  const [files, setFiles] = useState({
    thumbnail: null,
    icon: null,
    gif: null,
    htmlZip: null,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Validation function
  const validateForm = () => {
    const newErrors = {}

    // Validate form fields
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Game name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Game name must be at least 2 characters'
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Game description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.category || formData.category.length === 0) {
      newErrors.category = 'At least one category is required'
    }

    if (!formData.size || formData.size === '') {
      newErrors.size = 'Game size is required'
    }

    // Validate files - all assets are now mandatory
    if (!files.thumbnail) {
      newErrors.thumbnail = 'Thumbnail is required'
    }

    if (!files.icon) {
      newErrors.icon = 'Game icon is required'
    }

    if (!files.gif) {
      newErrors.gif = 'Game GIF is required'
    }

    if (!files.htmlZip) {
      newErrors.htmlZip = 'HTML game file (ZIP) is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = (type) => (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [type]: acceptedFiles[0] }))
      enqueueSnackbar(`${type} file selected`, { variant: 'success' })
      
      // Clear error for this file type when user selects a file
      if (errors[type]) {
        setErrors((prev) => ({ ...prev, [type]: '' }))
      }
    }
  }

  const handleNextStep = () => {
    // Validate all required files for step 1
    const fileErrors = {}
    
    if (!files.thumbnail) {
      fileErrors.thumbnail = 'Thumbnail is required'
    }
    
    if (!files.icon) {
      fileErrors.icon = 'Game icon is required'
    }

    if (!files.gif) {
      fileErrors.gif = 'Game GIF is required'
    }
    
    if (!files.htmlZip) {
      fileErrors.htmlZip = 'HTML game file (ZIP) is required'
    }

    if (Object.keys(fileErrors).length > 0) {
      setErrors(fileErrors)
      enqueueSnackbar('Please upload all required assets before proceeding', { variant: 'error' })
      return
    }

    // Clear file errors and proceed to step 2
    setErrors({})
    setStep(2)
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async () => {
    // Validate the entire form
    if (!validateForm()) {
      enqueueSnackbar('Please fix all validation errors before submitting', { variant: 'error' })
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadModalOpen(true)

    try {
      // Step 1: Upload files
      const uploadFormData = new FormData()
      if (files.thumbnail) uploadFormData.append('thumbnail', files.thumbnail)
      if (files.icon) uploadFormData.append('icon', files.icon)
      if (files.gif) uploadFormData.append('gif', files.gif)
      if (files.htmlZip) uploadFormData.append('htmlZip', files.htmlZip)

      setUploadProgress(30)
      const uploadResponse = await fetch(config.api.getFullUrl(config.api.endpoints.upload.files), {
        method: 'POST',
        credentials: 'include', // Send session cookie
        body: uploadFormData
      })

      if (!uploadResponse.ok) {
        throw new Error('File upload failed')
      }

      const uploadData = await uploadResponse.json()
      setUploadProgress(60)
      
      // Show warnings if any problematic filenames detected
      if (uploadData.warnings && uploadData.warnings.length > 0) {
        uploadData.warnings.forEach(warning => {
          console.warn('⚠️ File naming issue:', warning);
          enqueueSnackbar(
            `${warning.file}: ${warning.issues.join(', ')}. ${warning.suggestion}`,
            { variant: 'warning', autoHideDuration: 8000 }
          );
        });
      }

      // Step 2: Create game entry with new format
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      
      // Extract folder name from ZIP file for play_url
      let playUrlFolder = '';
      if (uploadData.data.htmlZip?.originalName) {
        // Remove .zip extension to get folder name
        const zipName = uploadData.data.htmlZip.originalName;
        playUrlFolder = zipName.replace(/\.zip$/i, '');
      }
      
      const gameData = {
        id: slug,
        name: formData.name,
        slug: slug,
        description: formData.description,
        thumb_url: uploadData.data.thumbnail?.path || '',
        logo_url: uploadData.data.icon?.path || uploadData.data.thumbnail?.path || '',
        gif_url: uploadData.data.gif?.path || '',
        play_url: uploadData.data.htmlZip?.path ? `games/${playUrlFolder}/` : '',
        size: formData.size,
        category: formData.category
      }

      setUploadProgress(80)
      const gameResponse = await fetch(config.api.getFullUrl(config.api.endpoints.games.create), {
        method: 'POST',
        credentials: 'include', // Send session cookie
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      })

      if (!gameResponse.ok) {
        throw new Error('Failed to save game data')
      }

      const response = await gameResponse.json()
      setUploadProgress(100)
      
      // Close upload modal and show success modal
      setUploadModalOpen(false)
      setSuccessModalOpen(true)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        size: '',
      })
      setFiles({ thumbnail: null, icon: null, gif: null, htmlZip: null })
      setErrors({})
      setStep(1)
      
      // Auto close success modal and redirect after 3 seconds
      setTimeout(() => {
        setSuccessModalOpen(false)
        window.location.href = '/games/library'
      }, 3000)
    } catch (error) {
      console.error('Upload error:', error)
      
      // Close upload modal on error
      setUploadModalOpen(false)
      
      enqueueSnackbar(error.message || 'Upload failed', { variant: 'error' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        📁 Upload New Game
      </Typography>

      {/* Step Indicator */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip 
          label={`Step ${step}: ${step === 1 ? 'Upload Files' : 'Game Details'}`} 
          color={step === 1 ? 'primary' : 'secondary'} 
          variant="filled" 
        />
        <Typography variant="body2" color="text.secondary">
          {step === 1 ? 'Upload thumbnail, icon, gif, and HTML zip file' : 'Enter game details and publish'}
        </Typography>
      </Box>

      {uploading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Uploading game... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 1 }} />
        </Alert>
      )}

      {step === 1 && (
        <Grid container spacing={3}>
          {/* File Upload Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                📦 Upload Game Files (All Required)
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FileUploadZone
                    onDrop={handleFileUpload('thumbnail')}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    label="Upload Thumbnail *"
                    icon={<ImageIcon sx={{ fontSize: 48, color: 'primary.main' }} />}
                    file={files.thumbnail}
                    error={errors.thumbnail}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FileUploadZone
                    onDrop={handleFileUpload('icon')}
                    accept={{ 'image/*': ['.png', '.svg', '.jpg', '.jpeg'] }}
                    label="Upload Icon *"
                    icon={<ImageIcon sx={{ fontSize: 48, color: 'secondary.main' }} />}
                    file={files.icon}
                    error={errors.icon}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FileUploadZone
                    onDrop={handleFileUpload('gif')}
                    accept={{ 
                      'image/gif': ['.gif'],
                      'video/webm': ['.webm']
                    }}
                    label="Upload GIF/WebM *"
                    icon={<ImageIcon sx={{ fontSize: 48, color: 'warning.main' }} />}
                    file={files.gif}
                    error={errors.gif}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FileUploadZone
                    onDrop={handleFileUpload('htmlZip')}
                    accept={{ 'application/zip': ['.zip'] }}
                    label="Upload HTML Game (ZIP) *"
                    icon={<GameIcon sx={{ fontSize: 48, color: 'success.main' }} />}
                    file={files.htmlZip}
                    error={errors.htmlZip}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText" sx={{ mb: 1 }}>
                  <strong>Note:</strong> All assets (Thumbnail, Icon, GIF, and HTML ZIP) are required for game upload.
                </Typography>
                <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 500 }}>
                  ⚠️ <strong>Important:</strong> Avoid special characters (&, (), [], {}, etc.) in ZIP filenames. Use simple names like "Game-Name.zip" for best compatibility.
                </Typography>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  disabled={uploading}
                  startIcon={<UploadIcon />}
                >
                  Next Step
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {step === 2 && (
        <Grid container spacing={3}>
          {/* Game Information Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                📝 Game Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Game Name *"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={uploading}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                  />
                </Grid>


                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.category}>
                    <InputLabel>Categories *</InputLabel>
                    <Select
                      multiple
                      value={formData.category}
                      label="Categories *"
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={uploading}
                      input={<OutlinedInput label="Categories *" />}
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
                    {errors.category && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.category}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 2 }}>
                      Select one or more categories
                    </Typography>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.size}>
                    <InputLabel>Size *</InputLabel>
                    <Select
                      value={formData.size}
                      label="Size *"
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      disabled={uploading}
                    >
                      {sizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.size && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.size}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description *"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    multiline
                    rows={3}
                    disabled={uploading}
                    error={!!errors.description}
                    helperText={errors.description}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevStep}
                  size="large"
                >
                  Back: Upload Files
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={uploading}
                  size="large"
                >
                  {uploading ? 'Uploading...' : 'Upload Game'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Upload Progress Modal */}
      <Dialog open={uploadModalOpen} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CloudUploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Uploading New Game
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please wait while we upload your game files to the cloud...
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
            Game Uploaded Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your new game has been successfully uploaded and saved to the cloud.
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

export default GameUpload
