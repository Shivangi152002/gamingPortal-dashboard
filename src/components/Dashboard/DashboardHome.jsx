import React from 'react'
import { Box, Typography } from '@mui/material'

const DashboardHome = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Gaming Portal Admin
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your games, monitor performance, and track analytics from one central dashboard.
      </Typography>
    </Box>
  )
}

export default DashboardHome
