import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import DashboardHome from '../components/Dashboard/DashboardHome'
import QuickStats from '../components/Dashboard/QuickStats'
import PerformanceChart from '../components/Dashboard/PerformanceChart'
import SystemStatus from '../components/Dashboard/SystemStatus'
import RecentGames from '../components/Dashboard/RecentGames'
import TopGamesRanking from '../components/Dashboard/TopGamesRanking'

const AdminDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        📊 Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Stats Cards */}
        <Grid item xs={12}>
          <QuickStats />
        </Grid>

        {/* Recent Games and System Status */}
        {/* <Grid item xs={12} md={12}>
          <RecentGames />
        </Grid> */}
        {/* <Grid item xs={12} md={4}>
          <SystemStatus />
        </Grid> */}

        {/* Top Games Ranking */}
        <Grid item xs={12}>
          <TopGamesRanking />
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12}>
          <PerformanceChart />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
