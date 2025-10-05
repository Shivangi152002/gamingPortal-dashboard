import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={fullScreen ? 60 : 40} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  )

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {content}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      {content}
    </Box>
  )
}

export default LoadingSpinner
