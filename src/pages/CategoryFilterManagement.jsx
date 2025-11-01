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
  Switch,
  FormControlLabel,
  CircularProgress,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  CloudUpload as UploadIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Image as ImageIcon
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { config } from '../config'
import axios from '../utils/axios'

const CategoryFilterManagement = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [tabValue, setTabValue] = useState(0)

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '',
    enabled: true,
    sortOrder: 0,
    translations: {
      en: '',
      hi: '',
      es: '',
      fr: ''
    }
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get(config.api.getFullUrl(config.api.endpoints.categoryFilters.list), {
        withCredentials: true,
        timeout: config.api.timeout
      })

      if (response.data.success) {
        const categoriesData = response.data.data.categories || []
        setCategories(categoriesData.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      enqueueSnackbar('Failed to load category filters', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        id: category.id,
        name: category.name,
        icon: category.icon,
        enabled: category.enabled !== undefined ? category.enabled : true,
        sortOrder: category.sortOrder || 0,
        translations: category.translations || { en: '', hi: '', es: '', fr: '' }
      })
      if (category.icon) {
        setPreviewUrl(config.aws.getAssetUrl(category.icon, 'images'))
      }
    } else {
      setEditingCategory(null)
      setFormData({
        id: '',
        name: '',
        icon: '',
        enabled: true,
        sortOrder: categories.length,
        translations: { en: '', hi: '', es: '', fr: '' }
      })
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingCategory(null)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      enqueueSnackbar('File size should be less than 2MB', { variant: 'error' })
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

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      enqueueSnackbar('Please enter a category name', { variant: 'error' })
      return
    }

    if (!formData.id.trim()) {
      enqueueSnackbar('Please enter a category ID', { variant: 'error' })
      return
    }

    try {
      setUploadingFile(true)

      let iconPath = formData.icon
      
      // Upload icon if a new one is selected
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)
        uploadFormData.append('folder', 'categoryFilters')

        const uploadResponse = await axios.post(
          config.api.getFullUrl('/upload'),
          uploadFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        )

        if (uploadResponse.data.success) {
          iconPath = uploadResponse.data.data.path || uploadResponse.data.data.url
        } else {
          throw new Error('Icon upload failed')
        }
      }

      const categoryData = {
        id: formData.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: formData.name,
        icon: iconPath,
        enabled: formData.enabled,
        sortOrder: formData.sortOrder,
        translations: formData.translations
      }

      let response
      if (editingCategory) {
        response = await axios.put(
          config.api.getFullUrl(config.api.endpoints.categoryFilters.update(editingCategory.id)),
          categoryData,
          { withCredentials: true }
        )
      } else {
        response = await axios.post(
          config.api.getFullUrl(config.api.endpoints.categoryFilters.create),
          categoryData,
          { withCredentials: true }
        )
      }

      if (response.data.success) {
        enqueueSnackbar(`Category ${editingCategory ? 'updated' : 'created'} successfully!`, { variant: 'success' })
        fetchCategories()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving category:', error)
      enqueueSnackbar(error.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`, { variant: 'error' })
    } finally {
      setUploadingFile(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category filter?')) {
      return
    }

    try {
      const response = await axios.delete(
        config.api.getFullUrl(config.api.endpoints.categoryFilters.delete(categoryId)),
        { withCredentials: true }
      )

      if (response.data.success) {
        enqueueSnackbar('Category deleted successfully!', { variant: 'success' })
        fetchCategories()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      enqueueSnackbar('Failed to delete category', { variant: 'error' })
    }
  }

  const handleToggleEnabled = async (category) => {
    try {
      const updatedData = {
        ...category,
        enabled: !category.enabled
      }

      const response = await axios.put(
        config.api.getFullUrl(config.api.endpoints.categoryFilters.update(category.id)),
        updatedData,
        { withCredentials: true }
      )

      if (response.data.success) {
        enqueueSnackbar(`Category ${updatedData.enabled ? 'enabled' : 'disabled'}!`, { variant: 'success' })
        fetchCategories()
      }
    } catch (error) {
      enqueueSnackbar('Failed to update category status', { variant: 'error' })
    }
  }

  const handleReorder = async (categoryId, direction) => {
    const currentIndex = categories.findIndex(c => c.id === categoryId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= categories.length) return

    const newCategories = [...categories]
    const [movedCategory] = newCategories.splice(currentIndex, 1)
    newCategories.splice(newIndex, 0, movedCategory)

    // Update sortOrder for all categories
    const updatedCategories = newCategories.map((cat, index) => ({
      ...cat,
      sortOrder: index
    }))

    setCategories(updatedCategories)

    try {
      // Update sortOrder on server
      await axios.post(
        config.api.getFullUrl(config.api.endpoints.categoryFilters.reorder),
        { categories: updatedCategories.map(c => ({ id: c.id, sortOrder: c.sortOrder })) },
        { withCredentials: true }
      )
      enqueueSnackbar('Category order updated!', { variant: 'success' })
    } catch (error) {
      console.error('Error reordering categories:', error)
      enqueueSnackbar('Failed to update category order', { variant: 'error' })
      fetchCategories() // Reload on error
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading category filters...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            🎯 Category Filter Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage category filters displayed on the gaming portal
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ ml: 2 }}
        >
          Add New Category
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Categories
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Enabled
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {categories.filter(c => c.enabled).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Disabled
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {categories.filter(c => !c.enabled).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleReorder(category.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleReorder(category.id, 'down')}
                      disabled={index === categories.length - 1}
                    >
                      <ArrowDownIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  {category.icon ? (
                    <Box
                      component="img"
                      src={config.aws.getAssetUrl(category.icon, 'images')}
                      alt={category.name}
                      sx={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 1 }}
                    />
                  ) : (
                    <ImageIcon sx={{ width: 40, height: 40, color: 'action.disabled' }} />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {category.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.enabled ? 'Enabled' : 'Disabled'}
                    size="small"
                    color={category.enabled ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleToggleEnabled(category)}
                    color={category.enabled ? 'warning' : 'success'}
                  >
                    {category.enabled ? '👁️' : '👁️‍🗨️'}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog - Simplified */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? `Edit Category: ${editingCategory.id}` : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Category ID - Only for new categories */}
              {!editingCategory && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Category ID"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    required
                    helperText="Lowercase, no spaces (e.g., action, adventure) - Cannot be changed later"
                  />
                </Grid>
              )}

              {/* Category Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  helperText="Display name for this category"
                />
              </Grid>

              {/* Enable/Disable Toggle */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">
                        {formData.enabled ? 'Enabled (Visible on portal)' : 'Disabled (Hidden from portal)'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Toggle to show/hide this category filter
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              {/* Icon Upload Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Category Icon
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {editingCategory ? 'Change Icon' : 'Upload Icon'} (PNG, 80x80px)
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Button>
                
                {/* Preview */}
                {previewUrl && (
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {selectedFile ? `New: ${selectedFile.name}` : 'Current Icon'}
                    </Typography>
                    <img
                      src={previewUrl}
                      alt="Icon preview"
                      style={{ 
                        maxWidth: '80px', 
                        maxHeight: '80px', 
                        borderRadius: 8,
                        border: '2px solid #e0e0e0'
                      }}
                    />
                  </Box>
                )}
              </Grid>

              {/* Info Alert */}
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>Note:</strong> Use the ↑↓ arrows in the table to reorder categories. Translations are managed automatically.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCategory}
            disabled={uploadingFile}
            startIcon={uploadingFile ? <CircularProgress size={20} /> : null}
          >
            {uploadingFile ? (editingCategory ? 'Updating...' : 'Creating...') : (editingCategory ? 'Save Changes' : 'Create Category')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CategoryFilterManagement

