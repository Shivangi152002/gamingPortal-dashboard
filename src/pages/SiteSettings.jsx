import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Stack,
  Tooltip
} from '@mui/material'
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Article as ArticleIcon,
  Public as PublicIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import axios from '../utils/axios'
import { config } from '../config'

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const SiteSettings = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    faviconUrl: '',
    splashLogoUrl: '',
    footerText: '',
    footerLinks: {
      getToKnowUs: [],
      privacyAndTerms: [],
      helpAndSupport: [],
      additionalLinks: []
    },
    socialLinks: {
      linkedin: '',
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: ''
    },
    customMetaTags: []
  })

  // Fetch current settings
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(config.api.getFullUrl('/site-settings'))
      
      if (response.data.success) {
        const data = response.data.data
        // Ensure all required nested objects exist
        const normalizedSettings = {
          siteTitle: data.siteTitle || '',
          siteDescription: data.siteDescription || '',
          faviconUrl: data.faviconUrl || '',
          splashLogoUrl: data.splashLogoUrl || '',
          footerText: data.footerText || '',
          footerLinks: data.footerLinks || {
            getToKnowUs: [],
            privacyAndTerms: [],
            helpAndSupport: [],
            additionalLinks: []
          },
          socialLinks: data.socialLinks || {
            linkedin: '',
            instagram: '',
            twitter: '',
            facebook: '',
            youtube: ''
          },
          customMetaTags: data.customMetaTags || []
        }
        setSettings(normalizedSettings)
        enqueueSnackbar('Settings loaded successfully', { variant: 'success' })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      enqueueSnackbar('Failed to load settings', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await axios.put(
        config.api.getFullUrl('/site-settings'),
        settings,
        { withCredentials: true }
      )

      if (response.data.success) {
        enqueueSnackbar('Settings saved successfully!', { variant: 'success' })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      enqueueSnackbar('Failed to save settings', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: value
      }
    }))
  }

  const handleAddFooterLink = (section) => {
    setSettings(prev => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [section]: [...prev.footerLinks[section], { name: '', url: '', active: true }]
      }
    }))
  }

  const handleUpdateFooterLink = (section, index, field, value) => {
    const newLinks = [...settings.footerLinks[section]]
    newLinks[index][field] = value
    setSettings(prev => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [section]: newLinks
      }
    }))
  }

  const handleToggleFooterLinkActive = (section, index) => {
    const newLinks = [...settings.footerLinks[section]]
    newLinks[index].active = !newLinks[index].active
    setSettings(prev => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [section]: newLinks
      }
    }))
  }

  const handleRemoveFooterLink = (section, index) => {
    setSettings(prev => ({
      ...prev,
      footerLinks: {
        ...prev.footerLinks,
        [section]: prev.footerLinks[section].filter((_, i) => i !== index)
      }
    }))
  }

  const handleAddMetaTag = () => {
    setSettings(prev => ({
      ...prev,
      customMetaTags: [...(prev.customMetaTags || []), { property: '', content: '' }]
    }))
  }

  const handleUpdateMetaTag = (index, field, value) => {
    const newMetaTags = [...(settings.customMetaTags || [])]
    newMetaTags[index][field] = value
    setSettings(prev => ({ ...prev, customMetaTags: newMetaTags }))
  }

  const handleRemoveMetaTag = (index) => {
    setSettings(prev => ({
      ...prev,
      customMetaTags: (prev.customMetaTags || []).filter((_, i) => i !== index)
    }))
  }

  const handleFaviconUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please select an image file', { variant: 'error' })
      return
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      enqueueSnackbar('File size should be less than 1MB', { variant: 'error' })
      return
    }

    try {
      setUploading(true)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'assets') // Upload to assets folder
      formData.append('type', 'favicon')

      // Upload file to server
      const uploadResponse = await axios.post(
        config.api.getFullUrl('/upload'),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      )

      if (uploadResponse.data.success) {
        const { url, path } = uploadResponse.data.data
        
        // Update settings with new favicon URL
        setSettings(prev => ({
          ...prev,
          faviconUrl: path || url
        }))

        enqueueSnackbar('Favicon uploaded successfully!', { variant: 'success' })
        
        // Auto-save the settings
        setTimeout(() => {
          handleSave()
        }, 1000)
      }
    } catch (error) {
      console.error('Error uploading favicon:', error)
      enqueueSnackbar('Failed to upload favicon', { variant: 'error' })
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleSplashLogoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please select an image file', { variant: 'error' })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('File size should be less than 5MB', { variant: 'error' })
      return
    }

    try {
      setUploading(true)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'assets') // Upload to assets folder
      formData.append('type', 'splash-logo')

      // Upload file to server
      const uploadResponse = await axios.post(
        config.api.getFullUrl('/upload'),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      )

      if (uploadResponse.data.success) {
        const { url, path } = uploadResponse.data.data
        
        // Update settings with new splash logo URL
        setSettings(prev => ({
          ...prev,
          splashLogoUrl: path || url
        }))

        enqueueSnackbar('Splash logo uploaded successfully!', { variant: 'success' })
        
        // Auto-save the settings
        setTimeout(() => {
          handleSave()
        }, 1000)
      }
    } catch (error) {
      console.error('Error uploading splash logo:', error)
      enqueueSnackbar('Failed to upload splash logo', { variant: 'error' })
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading site settings...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Site Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your website's appearance and content
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSettings}
            disabled={saving}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            size="large"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Box>

      {/* Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Note:</strong> Changes will be reflected on the live website immediately after saving.
      </Alert>

      {/* Tabs */}
      <Paper elevation={2}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<InfoIcon />} label="Basic Info" />
          <Tab icon={<ArticleIcon />} label="Meta Tags" />
          <Tab icon={<LinkIcon />} label="Footer" />
          <Tab icon={<PublicIcon />} label="Social Links" />
        </Tabs>

        {/* Tab 1: Basic Info */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Site Title"
                  value={settings.siteTitle}
                  onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                  placeholder="GameLauncher - Bite-Sized Games Portal"
                  helperText="Title shown in browser tab and search results"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Site Description"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  placeholder="Play amazing HTML5 games instantly. No downloads, no ads, just pure gaming fun!"
                  helperText="Brief description shown in search results and social media"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Favicon URL"
                    value={settings.faviconUrl}
                    onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
                    placeholder="/public/vite.svg"
                    helperText="Small icon shown in browser tab (16x16 or 32x32)"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    style={{ display: 'none' }}
                    id="favicon-upload"
                  />
                  <Button
                    component="label"
                    htmlFor="favicon-upload"
                    variant="outlined"
                    startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
                    disabled={uploading}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Upload
                  </Button>
                </Box>
                {settings.faviconUrl && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Preview:
                    </Typography>
                    <img 
                      src={config.aws.getAssetUrl(settings.faviconUrl)} 
                      alt="Favicon" 
                      style={{ width: 32, height: 32, objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Splash Screen Logo URL"
                    value={settings.splashLogoUrl}
                    onChange={(e) => handleInputChange('splashLogoUrl', e.target.value)}
                    placeholder="/public/assets/Gamelauncher_logo.webp"
                    helperText="Logo shown on game loading screen"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSplashLogoUpload}
                    style={{ display: 'none' }}
                    id="splash-logo-upload"
                  />
                  <Button
                    component="label"
                    htmlFor="splash-logo-upload"
                    variant="outlined"
                    startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
                    disabled={uploading}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Upload
                  </Button>
                </Box>
                {settings.splashLogoUrl && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Preview:
                    </Typography>
                    <img 
                      src={config.aws.getAssetUrl(settings.splashLogoUrl)} 
                      alt="Splash Logo" 
                      style={{ width: 120, height: 'auto', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  <strong>Tip:</strong> Upload images to S3 first using the Upload section, then paste the URL here.
                  Use CloudFront URLs for faster loading.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Tab 2: Meta Tags */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Dynamic Meta Tags
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddMetaTag()}
                    variant="outlined"
                    size="small"
                  >
                    Add Meta Tag
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              {/* Meta Tag Examples */}
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Meta Tag Examples:</strong>
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>For SEO:</strong><br />
                    • name="keywords" → content="games, html5, online games"<br />
                    • name="author" → content="Your Name"<br />
                    • name="robots" → content="index, follow"<br /><br />
                    <strong>For Social Media:</strong><br />
                    • property="og:title" → content="GameLauncher - Play Games"<br />
                    • property="og:description" → content="Best HTML5 games..."<br />
                    • property="og:image" → content="https://yourdomain.com/image.jpg"<br />
                    • name="twitter:card" → content="summary_large_image"
                  </Typography>
                </Alert>
              </Grid>

              {/* Dynamic Meta Tags */}
              {settings.customMetaTags?.map((metaTag, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Property/Name"
                          value={metaTag.property}
                          onChange={(e) => handleUpdateMetaTag(index, 'property', e.target.value)}
                          placeholder="og:title or keywords"
                          size="small"
                          helperText="og:title, og:description, keywords, etc."
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          fullWidth
                          label="Content"
                          value={metaTag.content}
                          onChange={(e) => handleUpdateMetaTag(index, 'content', e.target.value)}
                          placeholder="Your meta tag content"
                          size="small"
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveMetaTag(index)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}

              {(!settings.customMetaTags || settings.customMetaTags.length === 0) && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    No custom meta tags added. Click "Add Meta Tag" to create SEO and social media tags.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </TabPanel>

        {/* Tab 3: Footer */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Footer Content
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Footer Text"
                  value={settings.footerText}
                  onChange={(e) => handleInputChange('footerText', e.target.value)}
                  placeholder="© 2024 GameLauncher. All rights reserved."
                  helperText="Copyright text shown in footer"
                />
              </Grid>

              {/* Get to Know Us Links */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Get to Know Us Links
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddFooterLink('getToKnowUs')}
                    variant="outlined"
                    size="small"
                  >
                    Add Link
                  </Button>
                </Box>

                {settings.footerLinks.getToKnowUs?.map((link, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: link.active === false ? 'action.hover' : 'background.default',
                    opacity: link.active === false ? 0.6 : 1,
                    border: link.active === false ? '1px dashed' : 'none',
                    borderColor: 'divider'
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={5}>
                        <TextField
                          fullWidth
                          label="Link Name"
                          value={link.name}
                          onChange={(e) => handleUpdateFooterLink('getToKnowUs', index, 'name', e.target.value)}
                          placeholder="About"
                          size="small"
                          disabled={link.active === false}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="URL"
                          value={link.url}
                          onChange={(e) => handleUpdateFooterLink('getToKnowUs', index, 'url', e.target.value)}
                          placeholder="/about"
                          size="small"
                          disabled={link.active === false}
                        />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <Tooltip title={link.active === false ? 'Activate Link' : 'Deactivate Link'}>
                          <IconButton
                            color={link.active === false ? 'success' : 'warning'}
                            onClick={() => handleToggleFooterLinkActive('getToKnowUs', index)}
                            size="small"
                          >
                            {link.active === false ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    {link.active === false && (
                      <Chip 
                        label="Inactive - Hidden on website" 
                        size="small" 
                        color="warning" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Paper>
                ))}
              </Grid>

              {/* Privacy and Terms Links */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Privacy and Terms Links
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddFooterLink('privacyAndTerms')}
                    variant="outlined"
                    size="small"
                  >
                    Add Link
                  </Button>
                </Box>

                {settings.footerLinks.privacyAndTerms?.map((link, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: link.active === false ? 'action.hover' : 'background.default',
                    opacity: link.active === false ? 0.6 : 1,
                    border: link.active === false ? '1px dashed' : 'none',
                    borderColor: 'divider'
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={5}>
                        <TextField
                          fullWidth
                          label="Link Name"
                          value={link.name}
                          onChange={(e) => handleUpdateFooterLink('privacyAndTerms', index, 'name', e.target.value)}
                          placeholder="Privacy Policy"
                          size="small"
                          disabled={link.active === false}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="URL"
                          value={link.url}
                          onChange={(e) => handleUpdateFooterLink('privacyAndTerms', index, 'url', e.target.value)}
                          placeholder="/privacy"
                          size="small"
                          disabled={link.active === false}
                        />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <Tooltip title={link.active === false ? 'Activate Link' : 'Deactivate Link'}>
                          <IconButton
                            color={link.active === false ? 'success' : 'warning'}
                            onClick={() => handleToggleFooterLinkActive('privacyAndTerms', index)}
                            size="small"
                          >
                            {link.active === false ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    {link.active === false && (
                      <Chip 
                        label="Inactive - Hidden on website" 
                        size="small" 
                        color="warning" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Paper>
                ))}
              </Grid>

              {/* Help and Support Links */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Help and Support Links
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddFooterLink('helpAndSupport')}
                    variant="outlined"
                    size="small"
                  >
                    Add Link
                  </Button>
                </Box>

                {settings.footerLinks.helpAndSupport?.map((link, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: link.active === false ? 'action.hover' : 'background.default',
                    opacity: link.active === false ? 0.6 : 1,
                    border: link.active === false ? '1px dashed' : 'none',
                    borderColor: 'divider'
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={5}>
                        <TextField
                          fullWidth
                          label="Link Name"
                          value={link.name}
                          onChange={(e) => handleUpdateFooterLink('helpAndSupport', index, 'name', e.target.value)}
                          placeholder="FAQ"
                          size="small"
                          disabled={link.active === false}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="URL"
                          value={link.url}
                          onChange={(e) => handleUpdateFooterLink('helpAndSupport', index, 'url', e.target.value)}
                          placeholder="/faq"
                          size="small"
                          disabled={link.active === false}
                        />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <Tooltip title={link.active === false ? 'Activate Link' : 'Deactivate Link'}>
                          <IconButton
                            color={link.active === false ? 'success' : 'warning'}
                            onClick={() => handleToggleFooterLinkActive('helpAndSupport', index)}
                            size="small"
                          >
                            {link.active === false ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    {link.active === false && (
                      <Chip 
                        label="Inactive - Hidden on website" 
                        size="small" 
                        color="warning" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Paper>
                ))}
              </Grid>

              {/* Additional Links */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Additional Links
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddFooterLink('additionalLinks')}
                    variant="outlined"
                    size="small"
                  >
                    Add Link
                  </Button>
                </Box>

                {settings.footerLinks.additionalLinks?.map((link, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    mb: 2, 
                    bgcolor: link.active === false ? 'action.hover' : 'background.default',
                    opacity: link.active === false ? 0.6 : 1,
                    border: link.active === false ? '1px dashed' : 'none',
                    borderColor: 'divider'
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={5}>
                        <TextField
                          fullWidth
                          label="Link Name"
                          value={link.name}
                          onChange={(e) => handleUpdateFooterLink('additionalLinks', index, 'name', e.target.value)}
                          placeholder="Custom Link"
                          size="small"
                          disabled={link.active === false}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="URL"
                          value={link.url}
                          onChange={(e) => handleUpdateFooterLink('additionalLinks', index, 'url', e.target.value)}
                          placeholder="/custom"
                          size="small"
                          disabled={link.active === false}
                        />
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <Tooltip title={link.active === false ? 'Activate Link' : 'Deactivate Link'}>
                          <IconButton
                            color={link.active === false ? 'success' : 'warning'}
                            onClick={() => handleToggleFooterLinkActive('additionalLinks', index)}
                            size="small"
                          >
                            {link.active === false ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    {link.active === false && (
                      <Chip 
                        label="Inactive - Hidden on website" 
                        size="small" 
                        color="warning" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Paper>
                ))}
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Tab 4: Social Links */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Social Media Links
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={settings.socialLinks?.linkedin || ''}
                  onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                  helperText="Your LinkedIn company/profile URL"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Facebook"
                  value={settings.socialLinks?.facebook || ''}
                  onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  helperText="Your Facebook page URL"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={settings.socialLinks?.twitter || ''}
                  onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                  placeholder="https://twitter.com/youraccount"
                  helperText="Your Twitter profile URL"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instagram"
                  value={settings.socialLinks?.instagram || ''}
                  onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/youraccount"
                  helperText="Your Instagram profile URL"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="YouTube"
                  value={settings.socialLinks?.youtube || ''}
                  onChange={(e) => handleNestedChange('socialLinks', 'youtube', e.target.value)}
                  placeholder="https://youtube.com/yourchannel"
                  helperText="Your YouTube channel URL"
                />
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  Leave blank if you don't want to show a particular social media link.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Save Button (Bottom) */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ minWidth: 200 }}
        >
          {saving ? 'Saving Changes...' : 'Save All Changes'}
        </Button>
      </Box>
    </Box>
  )
}

export default SiteSettings

