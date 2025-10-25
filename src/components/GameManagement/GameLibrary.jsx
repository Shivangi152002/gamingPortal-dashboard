import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Search as SearchIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import axios from '../../utils/axios'
import { config } from '../../config'
import { getThumbnailUrl, getImageUrl as getApiImageUrl, handleImageError as apiHandleImageError, getGamePlayUrl } from '../../utils/apiConfig'

// Helper function to get full image URL from S3 path using your API config
const getImageUrl = (imagePath) => {
  console.log('🖼️ getImageUrl called with:', imagePath);
  
  if (!imagePath) {
    console.log('❌ No imagePath provided, using placeholder');
    // Return a data URI placeholder instead of external URL
    const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#cccccc"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666666" text-anchor="middle" dy=".3em">No Image</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    console.log('✅ Already full URL:', imagePath);
    return imagePath;
  }
  
  // Use your API config system for thumbnails
  const thumbnailUrl = getThumbnailUrl(imagePath);
  const imageUrl = getApiImageUrl(imagePath);
  const finalUrl = thumbnailUrl || imageUrl;
  
  console.log('🔧 URL construction:', {
    original: imagePath,
    thumbnailUrl,
    imageUrl,
    finalUrl
  });
  
  return finalUrl;
}

// Helper function to get game play URL using your API config
const getGameUrl = (playUrl) => {
  if (!playUrl) return '#'
  
  // Use your API config system for game URLs
  return getGamePlayUrl(playUrl) || '#'
}

const GameCard = ({ game, onEdit, onDelete, onToggleFeatured, viewMode = 'grid' }) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const navigate = useNavigate()

  const handlePreviewOpen = () => {
    setPreviewOpen(true)
  }

  const handlePreviewClose = () => {
    console.log('Closing preview dialog') // Debug log
    setPreviewOpen(false)
  }

  const thumbnailUrl = getImageUrl(game.thumb_url)
  const gameUrl = getGameUrl(game.play_url)

  return (
    <Card
      elevation={2}
      onClick={handlePreviewOpen}
      sx={{
        height: viewMode === 'list' ? 'auto' : '100%',
        width: viewMode === 'grid' ? 200 : '100%',
        maxWidth: viewMode === 'grid' ? 200 : 'none',
        display: 'flex',
        flexDirection: viewMode === 'list' ? 'row' : 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          '&::before': {
      
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 12,
            zIndex: 1
          }
        },
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <CardMedia
          component="img"
          height={viewMode === 'list' ? 120 : 200}
          width={viewMode === 'list' ? 120 : 200}
          image={thumbnailUrl}
          alt={game.name}
          sx={{ 
            objectFit: 'cover',
            width: viewMode === 'list' ? 120 : 200,
            height: viewMode === 'list' ? 120 : 200,
            minWidth: viewMode === 'list' ? 120 : 200,
            minHeight: viewMode === 'list' ? 120 : 200
          }}
          onError={(e) => apiHandleImageError(e)}
        />
        {/* Floating Action Buttons */}
        {/* <Box sx={{ 
          position: 'absolute', 
          // top: 8, 
          bottom: 8,
          right: 8, 
          display: 'flex', 
          gap: 1 
        }}>
          <IconButton
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'white' },
              width: 32,
              height: 32
            }}
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFeatured(game.id)
            }}
          >
            {game.featured ? (
              <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
            ) : (
              <StarBorderIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: 'rgba(25, 118, 210, 0.9)',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.main' },
              width: 32,
              height: 32
            }}
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(game.id)
            }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: 'rgba(211, 47, 47, 0.9)',
              color: 'white',
              '&:hover': { backgroundColor: 'error.main' },
              width: 32,
              height: 32
            }}
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(game.id)
            }}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box> */}
        <Chip
          label="Published"
          size="xsmall"
          color="success"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
          }}
        />
      </Box>

              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                p: viewMode === 'grid' ? 1.5 : 1.5,
                minHeight: viewMode === 'list' ? 120 : 'auto',
                width: viewMode === 'grid' ? '100%' : 'auto'
              }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600, 
                    fontSize: viewMode === 'list' ? 18 : 14,
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {game.name}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',   
                    gap: 0.5,
                    mb: 1,
                    flexWrap: 'wrap',
                    justifyContent: viewMode === 'list' ? 'flex-start' : 'flex-start',
                    alignItems: 'center'
                  }}>
                    {/* Rank Chip */}
                    <Chip 
                      label={`#${game.rank || 'N/A'}`} 
                      size="small" 
                      variant="filled" 
                      color="primary"
                      sx={{ 
                        fontSize: 9,
                        height: 20,
                        minWidth: 'auto',
                        flexShrink: 0,
                        fontWeight: 'bold'
                      }} 
                    />
                    {/* Category Chips - handle both array and string */}
                    {Array.isArray(game.category) ? (
                      game.category.map((cat, idx) => (
                        <Chip 
                          key={idx}
                          label={cat} 
                          size="small" 
                          variant="outlined" 
                          sx={{ 
                            fontSize: 9,
                            height: 20,
                            minWidth: 'auto',
                            flexShrink: 0
                          }} 
                        />
                      ))
                    ) : (
                      <Chip 
                        label={game.category} 
                        size="small" 
                        variant="outlined" 
                        sx={{ 
                          fontSize: 9,
                          height: 20,
                          minWidth: 'auto',
                          flexShrink: 0
                        }} 
                      />
                    )}
                    <Chip 
                      label={game.size} 
                      size="small" 
                      variant="outlined" 
                      color="secondary" 
                      sx={{ 
                        fontSize: 9,
                        height: 20,
                        minWidth: 'auto',
                        flexShrink: 0
                      }} 
                    />
                    {/* Play Count Chip */}
                    <Chip 
                      label={`${game.playCount || 0} plays`} 
                      size="small" 
                      variant="outlined" 
                      color="success"
                      sx={{ 
                        fontSize: 9,
                        height: 20,
                        minWidth: 'auto',
                        flexShrink: 0
                      }} 
                    />
                    {game.featured && (
                      <Chip 
                        label="Featured" 
                        size="small" 
                        variant="outlined"
                        color="warning"
                        sx={{ 
                          fontSize: 9,
                          height: 20,
                          minWidth: 'auto',
                          flexShrink: 0
                        }}
                      />
                    )}
                  </Box>
                  
                  {/* Action Buttons */}
                  {viewMode === 'grid' && (
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(25, 118, 210, 0.9)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'primary.main' },
                          width: 24,
                          height: 24
                        }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(game.id)
                        }}
                      >
                        <EditIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(211, 47, 47, 0.9)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.main' },
                          width: 24,
                          height: 24
                        }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(game.id)
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  )}
                  
                  {viewMode === 'list' && (
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(25, 118, 210, 0.9)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'primary.main' },
                          width: 24,
                          height: 24
                        }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(game.id)
                        }}
                      >
                        <EditIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(211, 47, 47, 0.9)',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.main' },
                          width: 24,
                          height: 24
                        }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(game.id)
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  )}
           
                  {/* {game.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 1.5, 
                      fontSize: viewMode === 'grid' ? 10 : 12,
                      display: '-webkit-box',
                      WebkitLineClamp: viewMode === 'list' ? 3 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.4
                    }}>
                      {game.description}
                    </Typography>
                  )} */}
                  
                </Box>
                
              </CardContent>


              {/* Preview Dialog */}
              <Dialog 
                key={`dialog-${game.id}-${previewOpen}`}
                open={previewOpen} 
                onClose={handlePreviewClose}
                maxWidth="lg"
                fullWidth
                disableEscapeKeyDown={false}
                PaperProps={{
                  sx: { height: '90vh' }
                }}
              >
                <DialogTitle>
                  {game.name} - Preview
                </DialogTitle>
                <DialogContent sx={{ p: 0, height: '100%' }}>
                  <iframe
                    src={gameUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', minHeight: '70vh' }}
                    title={`${game.name} Preview`}
                  />
                </DialogContent>
                <DialogActions>
                  <Button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handlePreviewClose()
                    }}
                    variant="outlined"
                  >
                    Close
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => window.open(gameUrl, '_blank')}
                  >
                    Open Full Screen
                  </Button>
                </DialogActions>
              </Dialog>
    </Card>
  )
}

const GameLibrary = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [gameToDelete, setGameToDelete] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')

          // Fetch games from S3 via API
          const fetchGames = async () => {
            try {
              setLoading(true)
              setError(null)
              
              const response = await axios.get(config.api.getFullUrl(config.api.endpoints.games.list), {
                timeout: config.api.timeout
              })
              
              if (response.data.success) {
                const gamesData = response.data.data.games || []
                // Sort games by creation date (newest first) - assuming games have created_at or similar field
                // If no date field, we'll sort by ID in descending order (assuming higher IDs are newer)
                const sortedGames = gamesData.sort((a, b) => {
                  // Try to sort by created_at if available, otherwise by id
                  if (a.created_at && b.created_at) {
                    return new Date(b.created_at) - new Date(a.created_at)
                  } else if (a.id && b.id) {
                    return parseInt(b.id) - parseInt(a.id)
                  }
                  return 0
                })
                setGames(sortedGames)
                
                console.log('📊 Loaded games:', gamesData.length)
                console.log('🎮 First game:', gamesData[0])
                console.log('🌐 CloudFront URL:', config.aws.cloudFrontUrl)
                
                enqueueSnackbar(`Loaded ${gamesData.length} games from S3`, { 
                  variant: 'success' 
                })
              }
            } catch (error) {
              console.error('Error fetching games:', error)
              setError('Failed to load games from S3. Please check your backend server and AWS configuration.')
              enqueueSnackbar('Failed to load games from S3', { variant: 'error' })
            } finally {
              setLoading(false)
            }
          }

  useEffect(() => {
    fetchGames()
  }, [])

  const handleEdit = (gameId) => {
    navigate(`/games/editor/${gameId}`)
  }

  const handleDelete = async (gameId) => {
    setGameToDelete(gameId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(config.api.getFullUrl(config.api.endpoints.games.delete(gameToDelete)), {
        withCredentials: true,
        timeout: config.api.timeout
      })
      setGames(games.filter(game => game.id !== gameToDelete))
      enqueueSnackbar('Game deleted successfully from S3', { variant: 'success' })
    } catch (error) {
      console.error('Error deleting game:', error)
      enqueueSnackbar('Failed to delete game', { variant: 'error' })
    } finally {
      setDeleteDialogOpen(false)
      setGameToDelete(null)
    }
  }

  const handleToggleFeatured = (gameId) => {
    // For now, just show a message since we don't have featured status in the API
    enqueueSnackbar('Featured status update not implemented yet', { variant: 'info' })
  }

          const filteredGames = games.filter(game => {
            // Search filter
            const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
            
            // Status filter
            let matchesFilter = true
            switch (selectedFilter) {
              case 'published':
                matchesFilter = true // All games are published in S3
                break
              case 'draft':
                matchesFilter = false // No drafts in current setup
                break
              case 'featured':
                matchesFilter = game.featured === true
                break
              default: // 'all'
                matchesFilter = true
            }
            
            return matchesSearch && matchesFilter
          })

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading games from S3...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchGames}
        >
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          📚 Game Library ({games.length} games)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchGames}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/games/upload')}
            size="large"
          >
            Upload New Game
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="grid">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ListViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Chip 
            label="All Games" 
            color={selectedFilter === 'all' ? 'primary' : 'default'}
            variant={selectedFilter === 'all' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFilter('all')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip 
            label="Published" 
            color={selectedFilter === 'published' ? 'primary' : 'default'}
            variant={selectedFilter === 'published' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFilter('published')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip 
            label="Draft" 
            color={selectedFilter === 'draft' ? 'primary' : 'default'}
            variant={selectedFilter === 'draft' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFilter('draft')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip 
            label="Featured" 
            color={selectedFilter === 'featured' ? 'primary' : 'default'}
            variant={selectedFilter === 'featured' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFilter('featured')}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      </Paper>

      {/* Game Grid/List */}
      <Grid container spacing={3}>
        {filteredGames.map((game) => (
          <Grid 
            item 
            xs={viewMode === 'grid' ? 12 : 12} 
            sm={viewMode === 'grid' ? 6 : 6} 
            md={viewMode === 'grid' ? 4 : 6} 
            lg={viewMode === 'grid' ? 3 : 6} 
            xl={viewMode === 'grid' ? 2 : 6}
            key={game.id}
          >
            <GameCard
              game={game}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              viewMode={viewMode}
            />
          </Grid>
        ))}
      </Grid>

      {filteredGames.length === 0 && !loading && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: 'grey.50',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {games.length === 0 ? 'No games found in S3' : 'No games match your search'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {games.length === 0 
              ? 'Upload your first game to get started!' 
              : 'Try adjusting your search or filters'
            }
          </Typography>
          {games.length === 0 && (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/games/upload')}
            >
              Upload Your First Game
            </Button>
          )}
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Game</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this game? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GameLibrary
