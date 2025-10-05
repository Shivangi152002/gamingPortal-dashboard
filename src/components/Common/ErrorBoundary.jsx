import React, { Component } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'background.default',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon 
              sx={{ 
                fontSize: 80, 
                color: 'error.main',
                mb: 2 
              }} 
            />
            <Typography variant="h4" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry for the inconvenience. An unexpected error has occurred.
            </Typography>
            {this.state.error && (
              <Box
                sx={{
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  mb: 3,
                  textAlign: 'left',
                }}
              >
                <Typography variant="body2" component="pre" sx={{ fontSize: 12 }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleReset}
            >
              Return to Dashboard
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
