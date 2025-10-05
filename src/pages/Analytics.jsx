import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
  Chip,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const engagementData = [
  { date: 'Jan 1', plays: 1200, users: 450, sessions: 680 },
  { date: 'Jan 8', plays: 1900, users: 680, sessions: 920 },
  { date: 'Jan 15', plays: 3200, users: 1100, sessions: 1450 },
  { date: 'Jan 22', plays: 2800, users: 950, sessions: 1280 },
  { date: 'Jan 29', plays: 3500, users: 1200, sessions: 1580 },
]

const topGames = [
  { name: 'Super Mario Adventure', plays: 12543, avgSession: '12.5m', completion: 67, trend: '+15%' },
  { name: 'Puzzle Master', plays: 8721, avgSession: '8.2m', completion: 82, trend: '+8%' },
  { name: 'Space Shooter Pro', plays: 6432, avgSession: '15.3m', completion: 45, trend: '+22%' },
  { name: 'Racing Legends', plays: 5123, avgSession: '10.8m', completion: 71, trend: '+5%' },
  { name: 'Chess Master 3D', plays: 4987, avgSession: '18.4m', completion: 88, trend: '+12%' },
]

const trafficSources = [
  { name: 'Direct', value: 45, color: '#1976d2' },
  { name: 'Search', value: 32, color: '#388e3c' },
  { name: 'Social', value: 18, color: '#f57c00' },
  { name: 'Referral', value: 5, color: '#7b1fa2' },
]

const deviceBreakdown = [
  { device: 'Desktop', users: 23456, percentage: 52 },
  { device: 'Mobile', users: 15789, percentage: 35 },
  { device: 'Tablet', users: 5867, percentage: 13 },
]

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          📈 Analytics Dashboard
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button variant={timeRange === '7d' ? 'contained' : 'outlined'} onClick={() => setTimeRange('7d')}>
            7 Days
          </Button>
          <Button variant={timeRange === '30d' ? 'contained' : 'outlined'} onClick={() => setTimeRange('30d')}>
            30 Days
          </Button>
          <Button variant={timeRange === '90d' ? 'contained' : 'outlined'} onClick={() => setTimeRange('90d')}>
            90 Days
          </Button>
        </ButtonGroup>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon sx={{ color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                45.1K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="success.main">
                  +12.5% vs last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ViewIcon sx={{ color: 'secondary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Plays
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                128K
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="success.main">
                  +23.4% vs last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TimeIcon sx={{ color: 'warning.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Avg. Session
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                12.5m
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="success.main">
                  +5.2% vs last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'error.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Bounce Rate
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
                23.4%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', transform: 'rotate(180deg)' }} />
                <Typography variant="body2" color="success.main">
                  -3.2% vs last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Engagement Chart */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          📊 User Engagement Trends
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="plays"
              stackId="1"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.6}
              name="Game Plays"
            />
            <Area
              type="monotone"
              dataKey="users"
              stackId="2"
              stroke="#388e3c"
              fill="#388e3c"
              fillOpacity={0.6}
              name="Active Users"
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stackId="3"
              stroke="#f57c00"
              fill="#f57c00"
              fillOpacity={0.6}
              name="Sessions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Top Games */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              🎯 Top Performing Games
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Game</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Plays
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Avg. Session
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Completion
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Trend
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topGames.map((game, index) => (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'primary.main',
                              width: 24,
                              height: 24,
                              backgroundColor: 'primary.light',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                            }}
                          >
                            {index + 1}
                          </Typography>
                          {game.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{game.plays.toLocaleString()}</TableCell>
                      <TableCell align="right">{game.avgSession}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${game.completion}%`}
                          size="small"
                          color={game.completion > 70 ? 'success' : game.completion > 50 ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                          {game.trend}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Traffic Sources */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              🌐 Traffic Sources
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {trafficSources.map((source) => (
                <Box
                  key={source.name}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: source.color,
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="body2">{source.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {source.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Device Breakdown */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          📱 Device Analytics
        </Typography>
        <Grid container spacing={3}>
          {deviceBreakdown.map((device) => (
            <Grid item xs={12} md={4} key={device.device}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {device.percentage}%
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {device.device}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {device.users.toLocaleString()} users
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  )
}

export default Analytics
