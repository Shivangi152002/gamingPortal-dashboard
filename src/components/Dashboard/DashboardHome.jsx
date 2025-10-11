import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material'
import { 
  Games as GamesIcon, 
  Upload as UploadIcon, 
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon 
} from '@mui/icons-material'
import axios from '../../utils/axios'
import { config } from '../../config'

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    recentUploads: 0,
    loading: true
  })

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(config.api.getFullUrl(config.api.endpoints.games.list), {
        timeout: config.api.timeout
      })
      
      if (response.data.success) {
        const games = response.data.data.games || []
        const totalGames = games.length
        
        // Count games uploaded in the last 7 days (if created_at exists)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        const recentUploads = games.filter(game => {
          if (game.created_at) {
            return new Date(game.created_at) > sevenDaysAgo
          }
          return false
        }).length
        
        setStats({
          totalGames,
          recentUploads,
          loading: false
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  if (stats.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Welcome to Gaming Portal Admin
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your games, monitor performance, and track analytics from one central dashboard.
      </Typography>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GamesIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Games
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {stats.totalGames}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Games in your library
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <UploadIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Recent Uploads
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {stats.recentUploads}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 7 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingIcon sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Active Games
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                {stats.totalGames}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published games
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScheduleIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Newest First
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                ✓
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latest games shown first
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Info Panel */}
      <Paper elevation={2} sx={{ p: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          🎯 Dashboard Features
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip label="Newest games first" color="secondary" size="small" />
          <Chip label="Recent uploads tracking" color="secondary" size="small" />
          <Chip label="Real-time game library" color="secondary" size="small" />
          <Chip label="Quick access to games" color="secondary" size="small" />
        </Box>
      </Paper>
    </Box>
  )
}

export default DashboardHome
