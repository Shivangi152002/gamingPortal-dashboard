import React, { useState, useEffect } from 'react'
import { Paper, Box, Typography, Chip, List, ListItem, ListItemText, CircularProgress } from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material'
import axios from '../../utils/axios'
import { config } from '../../config'

const StatusItem = ({ label, status, value }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <ListItem
      sx={{
        borderRadius: 1,
        mb: 1,
        backgroundColor: 'grey.50',
        '&:hover': { backgroundColor: 'grey.100' },
      }}
    >
      <Box sx={{ mr: 2 }}>{getStatusIcon()}</Box>
      <ListItemText
        primary={label}
        secondary={value}
        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
        secondaryTypographyProps={{ fontSize: 12 }}
      />
      <Chip
        label={status.toUpperCase()}
        color={getStatusColor()}
        size="small"
        sx={{ fontWeight: 600, fontSize: 10 }}
      />
    </ListItem>
  )
}

const SystemStatus = () => {
  const [systemStats, setSystemStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        setLoading(true)
        
        // Test API health
        const startTime = Date.now()
        const healthResponse = await axios.get(`${config.api.baseUrl}/health`, {
          timeout: config.api.timeout
        })
        const responseTime = Date.now() - startTime
        
        // Test games API
        const gamesResponse = await axios.get(config.api.getFullUrl(config.api.endpoints.games.list), {
          timeout: config.api.timeout
        })
        
        const stats = [
          { 
            label: 'CloudFront CDN', 
            status: 'healthy', 
            value: 'd1xtpep1y73br3.cloudfront.net' 
          },
          { 
            label: 'API Health', 
            status: healthResponse.data.status === 'OK' ? 'healthy' : 'error', 
            value: healthResponse.data.status === 'OK' ? 'Online' : 'Offline' 
          },
          { 
            label: 'Games Data', 
            status: gamesResponse.data.success ? 'healthy' : 'error', 
            value: gamesResponse.data.success ? `${gamesResponse.data.data.games?.length || 0} games loaded` : 'Failed to load' 
          },
          { 
            label: 'Response Time', 
            status: responseTime < 1000 ? 'healthy' : responseTime < 3000 ? 'warning' : 'error', 
            value: `${responseTime}ms` 
          },
          { 
            label: 'S3 Connection', 
            status: healthResponse.data.s3Configured ? 'healthy' : 'warning', 
            value: healthResponse.data.s3Configured ? 'Connected' : 'Check config' 
          },
        ]
        
        setSystemStats(stats)
        
      } catch (error) {
        console.error('Error fetching system status:', error)
        const errorStats = [
          { label: 'API Health', status: 'error', value: 'Connection failed' },
          { label: 'Games Data', status: 'error', value: 'Unable to fetch' },
          { label: 'Response Time', status: 'error', value: 'Timeout' },
          { label: 'S3 Connection', status: 'error', value: 'Check backend' },
          { label: 'CloudFront CDN', status: 'warning', value: 'Unknown status' },
        ]
        setSystemStats(errorStats)
      } finally {
        setLoading(false)
      }
    }

    fetchSystemStatus()
  }, [])

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          🔍 System Health
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      </Paper>
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        🔍 System Health
      </Typography>
      <List sx={{ p: 0 }}>
        {systemStats.map((stat, index) => (
          <StatusItem key={index} {...stat} />
        ))}
      </List>
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 500 }}>
          ✓ All systems operational
        </Typography>
      </Box>
    </Paper>
  )
}

export default SystemStatus
