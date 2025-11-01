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
  IconButton,
  Divider,
  InputAdornment
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CloudUpload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { config } from '../config'
import axios from '../utils/axios'

const AboutManagement = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [aboutData, setAboutData] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingAbout, setEditingAbout] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [expandedGames, setExpandedGames] = useState({})

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    developer: '',
    rating: 0,
    votes: 0,
    description: '',
    logo: '',
    hidden: false,
    sections: [],
    categories: []
  })

  const [sectionForm, setSectionForm] = useState({
    heading: '',
    description: '',
    items: [],
    controls: {},
    details: {}
  })

  const [currentSectionIndex, setCurrentSectionIndex] = useState(null)
  const [sectionType, setSectionType] = useState('text')

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(config.api.getFullUrl(config.api.endpoints.about.list), {
        withCredentials: true,
        timeout: config.api.timeout
      })

      if (response.data.success) {
        setAboutData(response.data.data.games || [])
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
      enqueueSnackbar('Failed to load about information', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (aboutInfo = null) => {
    if (aboutInfo) {
      setEditingAbout(aboutInfo)
      setFormData({
        id: aboutInfo.id,
        title: aboutInfo.title,
        developer: aboutInfo.developer,
        rating: aboutInfo.rating,
        votes: aboutInfo.votes,
        description: aboutInfo.description,
        logo: aboutInfo.logo,
        hidden: aboutInfo.hidden,
        sections: aboutInfo.sections || [],
        categories: aboutInfo.categories || []
      })
      if (aboutInfo.logo) {
        setPreviewUrl(config.aws.getAssetUrl(aboutInfo.logo, 'images'))
      }
    } else {
      setEditingAbout(null)
      setFormData({
        id: '',
        title: '',
        developer: '',
        rating: 0,
        votes: 0,
        description: '',
        logo: '',
        hidden: false,
        sections: [],
        categories: []
      })
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingAbout(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    setCurrentSectionIndex(null)
    setSectionType('text')
    setSectionForm({ heading: '', description: '', items: [], controls: {}, details: {} })
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('File size should be less than 5MB', { variant: 'error' })
      return
    }

    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please select an image file', { variant: 'error' })
      return
    }

    setSelectedFile(file)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveAbout = async () => {
    if (!formData.title.trim()) {
      enqueueSnackbar('Please enter a game title', { variant: 'error' })
      return
    }

    try {
      setUploadingFile(true)

      let logoUrl = formData.logo
      
      // Upload logo if a new one is selected
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)
        uploadFormData.append('folder', 'logos')

        const uploadResponse = await axios.post(
          config.api.getFullUrl('/upload'),
          uploadFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        )

        if (uploadResponse.data.success) {
          logoUrl = uploadResponse.data.data.path || uploadResponse.data.data.url
        } else {
          throw new Error('Logo upload failed')
        }
      }

      const aboutInfoData = {
        id: formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
        title: formData.title,
        developer: formData.developer,
        rating: formData.rating,
        votes: formData.votes,
        description: formData.description,
        logo: logoUrl,
        hidden: formData.hidden,
        sections: formData.sections,
        categories: formData.categories || []
      }

      let response
      if (editingAbout) {
        response = await axios.put(
          config.api.getFullUrl(config.api.endpoints.about.update(editingAbout.id)),
          aboutInfoData,
          { withCredentials: true }
        )
      } else {
        response = await axios.post(
          config.api.getFullUrl(config.api.endpoints.about.create),
          aboutInfoData,
          { withCredentials: true }
        )
      }

      if (response.data.success) {
        enqueueSnackbar(`About information ${editingAbout ? 'updated' : 'created'} successfully!`, { variant: 'success' })
        fetchAboutData()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving about info:', error)
      enqueueSnackbar(error.response?.data?.message || `Failed to ${editingAbout ? 'update' : 'create'} about information`, { variant: 'error' })
    } finally {
      setUploadingFile(false)
    }
  }

  const handleDeleteAbout = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this about information?')) {
      return
    }

    try {
      const response = await axios.delete(
        config.api.getFullUrl(config.api.endpoints.about.delete(gameId)),
        { withCredentials: true }
      )

      if (response.data.success) {
        enqueueSnackbar('About information deleted successfully!', { variant: 'success' })
        fetchAboutData()
      }
    } catch (error) {
      console.error('Error deleting about info:', error)
      enqueueSnackbar('Failed to delete about information', { variant: 'error' })
    }
  }

  const toggleGameExpand = (gameId) => {
    setExpandedGames(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }))
  }

  const addSection = () => {
    if (!sectionForm.heading.trim()) {
      enqueueSnackbar('Please enter a section heading', { variant: 'error' })
      return
    }

    let newSection
    if (sectionType === 'text') {
      newSection = {
        heading: sectionForm.heading,
        description: sectionForm.description
      }
    } else if (sectionType === 'modes') {
      newSection = {
        heading: sectionForm.heading,
        items: sectionForm.items
      }
    } else if (sectionType === 'controls') {
      newSection = {
        heading: sectionForm.heading,
        controls: sectionForm.controls
      }
    } else if (sectionType === 'developer') {
      newSection = {
        heading: sectionForm.heading,
        details: sectionForm.details
      }
    }

    setFormData({
      ...formData,
      sections: [...formData.sections, newSection]
    })

    setSectionForm({ heading: '', description: '', items: [], controls: {}, details: {} })
    setSectionType('text')
  }

  const editSection = (index) => {
    const section = formData.sections[index]
    setCurrentSectionIndex(index)
    
    if (section.items) {
      setSectionType('modes')
    } else if (section.controls) {
      setSectionType('controls')
    } else if (section.details) {
      setSectionType('developer')
    } else {
      setSectionType('text')
    }
    
    setSectionForm({
      heading: section.heading,
      description: section.description || '',
      items: section.items || [],
      controls: section.controls || {},
      details: section.details || {}
    })
  }

  const updateSection = () => {
    if (!sectionForm.heading.trim()) {
      enqueueSnackbar('Please enter a section heading', { variant: 'error' })
      return
    }

    let updatedSection
    if (sectionType === 'text') {
      updatedSection = {
        heading: sectionForm.heading,
        description: sectionForm.description
      }
    } else if (sectionType === 'modes') {
      updatedSection = {
        heading: sectionForm.heading,
        items: sectionForm.items
      }
    } else if (sectionType === 'controls') {
      updatedSection = {
        heading: sectionForm.heading,
        controls: sectionForm.controls
      }
    } else if (sectionType === 'developer') {
      updatedSection = {
        heading: sectionForm.heading,
        details: sectionForm.details
      }
    }

    const updatedSections = [...formData.sections]
    updatedSections[currentSectionIndex] = updatedSection

    setFormData({
      ...formData,
      sections: updatedSections
    })

    setCurrentSectionIndex(null)
    setSectionForm({ heading: '', description: '', items: [], controls: {}, details: {} })
    setSectionType('text')
  }

  const deleteSection = (index) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      sections: updatedSections
    })
  }

  const toggleHidden = async (aboutInfo) => {
    const newHiddenState = !aboutInfo.hidden
    
    try {
      const updatedData = {
        ...aboutInfo,
        hidden: newHiddenState
      }

      const response = await axios.put(
        config.api.getFullUrl(config.api.endpoints.about.update(aboutInfo.id)),
        updatedData,
        { withCredentials: true }
      )

      if (response.data.success) {
        enqueueSnackbar(`About information ${newHiddenState ? 'hidden' : 'shown'}!`, { variant: 'success' })
        fetchAboutData()
      }
    } catch (error) {
      enqueueSnackbar('Failed to update visibility', { variant: 'error' })
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading about information...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            📖 About Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage game about information and descriptions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ ml: 2 }}
        >
          Add New About
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total About Pages
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {aboutData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Visible Pages
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {aboutData.filter(a => !a.hidden).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Hidden Pages
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {aboutData.filter(a => a.hidden).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Sections
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {aboutData.reduce((sum, a) => sum + (a.sections?.length || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {aboutData.length === 0 ? (
        <Paper elevation={2} sx={{ p: 5, textAlign: 'center' }}>
          <InfoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No About Information Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get started by adding about information for a game.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {aboutData.map((aboutInfo) => (
            <Grid item xs={12} key={aboutInfo.id}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {aboutInfo.logo && (
                      <CardMedia
                        component="img"
                        sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover' }}
                        image={config.aws.getAssetUrl(aboutInfo.logo, 'images')}
                        alt={aboutInfo.title}
                      />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {aboutInfo.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            by {aboutInfo.developer || 'Unknown Developer'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {aboutInfo.rating > 0 && (
                            <Chip
                              label={`★ ${aboutInfo.rating.toFixed(1)}`}
                              size="small"
                              color="warning"
                            />
                          )}
                          <Chip
                            label={aboutInfo.hidden ? 'Hidden' : 'Visible'}
                            size="small"
                            color={aboutInfo.hidden ? 'default' : 'success'}
                          />
                        </Box>
                      </Box>
                      {aboutInfo.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {aboutInfo.description}
                        </Typography>
                      )}
                      
                      {/* Categories Display */}
                      {aboutInfo.categories && aboutInfo.categories.length > 0 && (
                        <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {aboutInfo.categories.map((cat, idx) => (
                            <Chip key={idx} label={cat} size="small" variant="outlined" />
                          ))}
                        </Box>
                      )}
                      
                      {/* Sections Preview */}
                      {aboutInfo.sections && aboutInfo.sections.length > 0 && (
                        <Box>
                          <Button
                            size="small"
                            endIcon={expandedGames[aboutInfo.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            onClick={() => toggleGameExpand(aboutInfo.id)}
                            sx={{ mb: 1 }}
                          >
                            {aboutInfo.sections.length} Section{aboutInfo.sections.length !== 1 ? 's' : ''}
                          </Button>
                          {expandedGames[aboutInfo.id] && (
                            <Box sx={{ mt: 1, ml: 1 }}>
                              {aboutInfo.sections.map((section, idx) => (
                                <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                  <Typography variant="caption" fontWeight="bold">
                                    {section.heading}
                                  </Typography>
                                  {section.description && (
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      {section.description.substring(0, 100)}{section.description.length > 100 ? '...' : ''}
                                    </Typography>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(aboutInfo)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={aboutInfo.hidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    onClick={() => toggleHidden(aboutInfo)}
                  >
                    {aboutInfo.hidden ? 'Show' : 'Hide'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteAbout(aboutInfo.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAbout ? 'Edit About Information' : 'Add New About Information'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Game Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Developer"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Rating"
                  type="number"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Votes"
                  type="number"
                  value={formData.votes}
                  onChange={(e) => setFormData({ ...formData, votes: parseInt(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Categories (comma separated)"
                  value={formData.categories?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    categories: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                  })}
                  placeholder="PUZZLE GAMES, ARCADE GAMES, POPULAR GAMES"
                  helperText="Enter game categories separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Upload Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Selected: {selectedFile.name}
                  </Typography>
                )}
                {previewUrl && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                      src={previewUrl}
                      alt="Logo preview"
                      style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: 8 }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Sections
                </Typography>
              </Grid>
              {formData.sections.map((section, idx) => (
                <Grid item xs={12} key={idx}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {section.heading}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => editSection(idx)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => deleteSection(idx)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    {section.description && (
                      <Typography variant="caption" color="text.secondary">
                        {section.description.substring(0, 100)}{section.description.length > 100 ? '...' : ''}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {currentSectionIndex !== null ? 'Edit Section' : 'Add New Section'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Section Type</InputLabel>
                  <Select
                    value={sectionType}
                    label="Section Type"
                    onChange={(e) => setSectionType(e.target.value)}
                  >
                    <MenuItem value="text">Text Section</MenuItem>
                    <MenuItem value="modes">Game Modes</MenuItem>
                    <MenuItem value="controls">How to Play (Controls)</MenuItem>
                    <MenuItem value="developer">Developer Info</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Heading"
                  value={sectionForm.heading}
                  onChange={(e) => setSectionForm({ ...sectionForm, heading: e.target.value })}
                  required
                />
              </Grid>
              {sectionType === 'text' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={sectionForm.description}
                    onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  />
                </Grid>
              )}
              {currentSectionIndex === null ? (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addSection}
                    fullWidth
                  >
                    Add Section
                  </Button>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={updateSection}
                    fullWidth
                  >
                    Update Section
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setCurrentSectionIndex(null)
                      setSectionForm({ heading: '', description: '', items: [], controls: {}, details: {} })
                      setSectionType('text')
                    }}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Cancel
                  </Button>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.hidden}
                      onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })}
                    />
                  }
                  label="Hidden"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveAbout}
            disabled={uploadingFile}
            startIcon={uploadingFile ? <CircularProgress size={20} /> : null}
          >
            {uploadingFile ? (editingAbout ? 'Updating...' : 'Creating...') : (editingAbout ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AboutManagement

