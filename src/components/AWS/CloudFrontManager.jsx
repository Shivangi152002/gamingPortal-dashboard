import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import {
  CloudQueue as CloudIcon,
  Refresh as RefreshIcon,
  Delete as InvalidateIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const performanceData = [
  { time: '00:00', requests: 1200, dataTransfer: 45, cacheHit: 94 },
  { time: '04:00', requests: 800, dataTransfer: 32, cacheHit: 96 },
  { time: '08:00', requests: 2400, dataTransfer: 89, cacheHit: 93 },
  { time: '12:00', requests: 3200, dataTransfer: 122, cacheHit: 95 },
  { time: '16:00', requests: 2800, dataTransfer: 105, cacheHit: 94 },
  { time: '20:00', requests: 2100, dataTransfer: 78, cacheHit: 92 },
]

const geoData = [
  { region: 'US East', avgLatency: '45ms', requests: 8234, percentage: 42 },
  { region: 'Europe', avgLatency: '78ms', requests: 4123, percentage: 28 },
  { region: 'Asia', avgLatency: '112ms', requests: 2987, percentage: 18 },
  { region: 'South America', avgLatency: '95ms', requests: 1543, percentage: 12 },
]

const CloudFrontManager = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [invalidatePath, setInvalidatePath] = useState('')
  const [isInvalidating, setIsInvalidating] = useState(false)

  const handleInvalidate = () => {
    if (!invalidatePath.trim()) {
      enqueueSnackbar('Please enter a path to invalidate', { variant: 'error' })
      return
    }
    setIsInvalidating(true)
    setTimeout(() => {
      enqueueSnackbar('Cache invalidation started', { variant: 'success' })
      setIsInvalidating(false)
      setInvalidatePath('')
    }, 2000)
  }

  const handleInvalidateAll = () => {
    setIsInvalidating(true)
    setTimeout(() => {
      enqueueSnackbar('All cache invalidated', { variant: 'success' })
      setIsInvalidating(false)
    }, 2000)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        🌐 CloudFront Distribution
      </Typography>

      {/* Distribution Status */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  d1xtpep1y73br3.cloudfront.net
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Origin: gameportal-assets.s3.amazonaws.com
                </Typography>
              </Box>
              <Chip
                icon={<CheckIcon />}
                label="Deployed"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Last deployed: 2 hours ago • Created: Jan 10, 2024
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => enqueueSnackbar('Refreshing status...', { variant: 'info' })}
              >
                Refresh Status
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 24h Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Requests
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                15,423
              </Typography>
              <Chip label="+12.5%" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Data Transfer
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                1.2 GB
              </Typography>
              <Chip label="+8.3%" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Cache Hit Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                94.2%
              </Typography>
              <Chip label="Excellent" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Error Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                0.01%
              </Typography>
              <Chip label="Healthy" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Chart */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          📈 24-Hour Performance
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="requests" stroke="#1976d2" strokeWidth={2} name="Requests" />
            <Line type="monotone" dataKey="dataTransfer" stroke="#388e3c" strokeWidth={2} name="Data Transfer (MB)" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Geographic Performance */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          🌍 Geographic Performance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Region</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Avg Latency</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Requests</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Traffic</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {geoData.map((row) => (
                <TableRow key={row.region}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SpeedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      {row.region}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.avgLatency}
                      size="small"
                      color={parseInt(row.avgLatency) < 60 ? 'success' : parseInt(row.avgLatency) < 100 ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{row.requests.toLocaleString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.percentage}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 40 }}>
                        {row.percentage}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Cache Management */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          🔄 Cache Management
        </Typography>

        {isInvalidating && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Invalidating cache...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Invalidation Path"
              placeholder="/public/games/* or * for all"
              value={invalidatePath}
              onChange={(e) => setInvalidatePath(e.target.value)}
              helperText="Use wildcards (*) to invalidate multiple paths"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, height: '100%' }}>
              <Button
                variant="contained"
                startIcon={<InvalidateIcon />}
                onClick={handleInvalidate}
                disabled={isInvalidating}
                fullWidth
              >
                Invalidate
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleInvalidateAll}
            disabled={isInvalidating}
          >
            Invalidate All Cache
          </Button>
          <Button variant="outlined">
            View Invalidation History
          </Button>
          <Button variant="outlined">
            Cache Statistics
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: 'info.dark' }}>
            ℹ️ Note: Cache invalidation may take 5-15 minutes to complete. You'll be notified when finished.
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default CloudFrontManager
