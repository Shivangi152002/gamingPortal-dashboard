import React from 'react'
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
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
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

const storageData = [
  { month: 'Jul', storage: 1.2, cost: 8.5 },
  { month: 'Aug', storage: 1.5, cost: 10.2 },
  { month: 'Sep', storage: 1.8, cost: 11.8 },
  { month: 'Oct', storage: 2.1, cost: 13.5 },
  { month: 'Nov', storage: 2.3, cost: 14.2 },
  { month: 'Dec', storage: 2.4, cost: 15.0 },
]

const bucketUsage = [
  { name: 'Games', value: 1800, color: '#1976d2' },
  { name: 'Assets', value: 600, color: '#388e3c' },
  { name: 'Backups', value: 2200, color: '#f57c00' },
]

const costBreakdown = [
  { service: 'S3 Storage', current: 12.50, projected: 15.80, change: +26.4 },
  { service: 'S3 Requests', current: 2.30, projected: 2.80, change: +21.7 },
  { service: 'CloudFront', current: 8.50, projected: 10.20, change: +20.0 },
  { service: 'Data Transfer', current: 3.20, projected: 4.10, change: +28.1 },
  { service: 'Lambda', current: 1.50, projected: 1.80, change: +20.0 },
]

const StorageAnalytics = () => {
  const totalCurrent = costBreakdown.reduce((sum, item) => sum + item.current, 0)
  const totalProjected = costBreakdown.reduce((sum, item) => sum + item.projected, 0)

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        📊 Storage & Performance Analytics
      </Typography>

      {/* Cost Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MoneyIcon sx={{ color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Current Month
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                ${totalCurrent.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'warning.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Projected Next Month
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                ${totalProjected.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Yearly Estimate
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                ${(totalProjected * 12).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Storage Growth Chart */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          📈 Storage Growth & Cost Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={storageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: 'Storage (GB)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Cost ($)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="storage"
              stroke="#1976d2"
              fill="#1976d2"
              fillOpacity={0.6}
              name="Storage (GB)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="cost"
              stroke="#f57c00"
              fill="#f57c00"
              fillOpacity={0.6}
              name="Cost ($)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Bucket Usage Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              💾 Storage Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bucketUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bucketUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {bucketUsage.map((bucket) => (
                <Box
                  key={bucket.name}
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
                        backgroundColor: bucket.color,
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="body2">{bucket.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {(bucket.value / 1000).toFixed(1)} GB
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Cost Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              💰 Cost Breakdown
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Current</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Projected</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {costBreakdown.map((row) => (
                    <TableRow key={row.service}>
                      <TableCell>{row.service}</TableCell>
                      <TableCell align="right">${row.current.toFixed(2)}</TableCell>
                      <TableCell align="right">${row.projected.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          {row.change > 0 ? (
                            <>
                              <TrendingUpIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                              <Typography variant="body2" color="warning.main">
                                +{row.change.toFixed(1)}%
                              </Typography>
                            </>
                          ) : (
                            <>
                              <TrendingDownIcon sx={{ fontSize: 16, color: 'success.main' }} />
                              <Typography variant="body2" color="success.main">
                                {row.change.toFixed(1)}%
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${totalCurrent.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${totalProjected.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      +{(((totalProjected - totalCurrent) / totalCurrent) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Optimization Recommendations */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          💡 Optimization Recommendations
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'success.dark' }}>
                ✓ High Cache Hit Rate
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.dark' }}>
                Your CloudFront cache hit rate of 94.2% is excellent. Keep current caching strategy.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, backgroundColor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'warning.dark' }}>
                ⚠ Storage Optimization
              </Typography>
              <Typography variant="caption" sx={{ color: 'warning.dark' }}>
                Consider enabling S3 Intelligent-Tiering to reduce costs by ~30% on infrequently accessed files.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'info.dark' }}>
                ℹ️ Backup Management
              </Typography>
              <Typography variant="caption" sx={{ color: 'info.dark' }}>
                Implement lifecycle policy to automatically delete backups older than 30 days.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default StorageAnalytics
