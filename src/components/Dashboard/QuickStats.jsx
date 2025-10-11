import React, { useState, useEffect } from 'react'
import { Grid, Paper, Box, Typography } from '@mui/material'
import {
  SportsEsports as GamesIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
} from '@mui/icons-material'
import axios from '../../utils/axios'
import { config } from '../../config'

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      height: '100%',
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="success.main">
          {subtitle}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 32, color: color } })}
      </Box>
    </Box>
  </Paper>
)

const QuickStats = () => {
  const [gameCount, setGameCount] = useState(0)
  const [totalSize, setTotalSize] = useState(0)
  const [categories, setCategories] = useState({})
  const [apiStatus, setApiStatus] = useState('Offline')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch games data
        const gamesResponse = await axios.get(config.api.getFullUrl(config.api.endpoints.games.list), {
          timeout: config.api.timeout
        })
        if (gamesResponse.data.success) {
          const games = gamesResponse.data.data.games || []
          setGameCount(games.length)
          
          // Calculate total size based on game sizes
          const sizeMap = { small: 50, medium: 150, large: 300 } // MB per size
          const totalSizeMB = games.reduce((total, game) => {
            return total + (sizeMap[game.size] || 50)
          }, 0)
          setTotalSize(totalSizeMB)
          
          // Count categories
          const categoryCount = games.reduce((acc, game) => {
            acc[game.category] = (acc[game.category] || 0) + 1
            return acc
          }, {})
          setCategories(categoryCount)
        }
        
        // Test API status
        const healthResponse = await axios.get(`${config.api.baseUrl}/health`, {
          timeout: config.api.timeout
        })
        if (healthResponse.data.status === 'OK') {
          setApiStatus('Online')
        }
        
      } catch (error) {
        console.error('Error fetching stats:', error)
        setApiStatus('Error')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
 
  const formatSize = (sizeInMB) => {
    if (sizeInMB < 1024) {
      return `${sizeInMB} MB`
    } else {
      return `${(sizeInMB / 1024).toFixed(1)} GB`
    }
  }

  const getCategoryCount = () => {
    return Object.keys(categories).length
  }

  const stats = [
    {
      title: 'Total Games',
      value: loading ? '...' : gameCount.toString(),
      subtitle: `${getCategoryCount()} categories`,
      icon: <GamesIcon />,
      color: '#1976d2',
    },
    {
      title: 'Storage Used',
      value: loading ? '...' : formatSize(totalSize),
      subtitle: 'Estimated from games',
      icon: <StorageIcon />,
      color: '#388e3c',
    },
    // {
    //   title: 'CloudFront CDN',
    //   value: apiStatus === 'Online' ? 'Active' : 'Offline',
    //   subtitle: apiStatus === 'Online' ? 'Global Delivery' : 'Check connection',
    //   icon: <TrendingIcon />,
    //   color: apiStatus === 'Online' ? '#f57c00' : '#f44336',
    // },
    // {
    //   title: 'API Status',
    //   value: apiStatus,
    //   subtitle: apiStatus === 'Online' ? 'Backend Connected' : 'Connection Error',
    //   icon: <PeopleIcon />,
    //   color: apiStatus === 'Online' ? '#7b1fa2' : '#f44336',
    // },
  ]

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  )
}

export default QuickStats
