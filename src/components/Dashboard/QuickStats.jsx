import React, { useState, useEffect } from 'react'
import { Grid, Paper, Box, Typography } from '@mui/material'
import {
  SportsEsports as GamesIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material'
import axios from '../../utils/axios'
import { config } from '../../config'

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 4,
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, color: color, lineHeight: 1.2 }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}20`,
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 40, color: color, opacity: 0.8 } })}
      </Box>
    </Box>
  </Paper>
)

const QuickStats = () => {
  const [gameCount, setGameCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [totalPlays, setTotalPlays] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch games data
        const gamesResponse = await axios.get(config.api.getFullUrl(config.api.endpoints.games.list), {
          timeout: config.api.timeout
        })
        
        // Fetch ranking statistics
        const rankingResponse = await axios.get(config.api.getFullUrl(config.api.endpoints.ranking.statistics), {
          timeout: config.api.timeout
        })
        
        if (gamesResponse.data.success) {
          const games = gamesResponse.data.data.games || []
          setGameCount(games.length)
          
          // Count unique categories
          const uniqueCategories = new Set(games.map(game => game.category).filter(Boolean))
          setCategoryCount(uniqueCategories.size)
        }
        
        if (rankingResponse.data.success) {
          const stats = rankingResponse.data.data
          setTotalPlays(stats.totalPlays || 0)
        }
        
        // For now, set a mock user count (you can implement user tracking later)
        setUserCount(5) // This would come from your user management system
        
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
 
  const stats = [
    {
      title: 'Total Games',
      value: loading ? '...' : gameCount.toString(),
      icon: <GamesIcon />,
      color: '#9c27b0', // Purple
    },
    {
      title: 'Total Categories',
      value: loading ? '...' : categoryCount.toString(),
      icon: <CategoryIcon />,
      color: '#4caf50', // Green
    },
    {
      title: 'Total Users',
      value: loading ? '...' : userCount.toString(),
      icon: <PeopleIcon />,
      color: '#00bcd4', // Teal/Cyan
    },
  ]

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  )
}

export default QuickStats
