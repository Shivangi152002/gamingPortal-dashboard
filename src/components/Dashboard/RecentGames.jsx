import React, { useState, useEffect } from 'react'
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from '@mui/material'
import { Visibility as ViewIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import axios from '../../utils/axios'
import { config } from '../../config'

const RecentGames = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGames = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(config.api.getFullUrl(config.api.endpoints.games.list), {
        timeout: config.api.timeout
      })
      
      if (response.data.success) {
        const gamesData = response.data.data.games || []
        // Sort games by creation date (newest first) and get the 5 most recent
        const sortedGames = gamesData.sort((a, b) => {
          // Try to sort by created_at if available, otherwise by id
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at)
          } else if (a.id && b.id) {
            return parseInt(b.id) - parseInt(a.id)
          }
          return 0
        })
        // Get the 5 most recent games (newest first)
        const recentGames = sortedGames.slice(0, 5)
        setGames(recentGames)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
      setError('Failed to load recent games')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchGames}>
          Retry
        </Button>
      </Paper>
    )
  }
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        🎮 Recent Games
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Game</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Size</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Uploaded</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.length > 0 ? games.map((game) => (
              <TableRow
                key={game.id}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  cursor: 'pointer',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: 14,
                      }}
                    >
                      {game.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {game.name}
                      </Typography>
                      {game.description && (
                        <Typography variant="caption" color="text.secondary">
                          {game.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={game.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label={game.size} size="small" variant="outlined" color="secondary" />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {game.created_at 
                      ? new Date(game.created_at).toLocaleDateString()
                      : 'Recently'
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label="Published"
                    size="small"
                    color="success"
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => {
                      const gameUrl = `https://d1xtpep1y73br3.cloudfront.net/public/games/${game.play_url.replace('games/', '')}`
                      window.open(gameUrl, '_blank')
                    }}
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No games found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default RecentGames
