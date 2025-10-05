// Error handling utilities

export const errorHandler = {
  // Handle API errors
  handleApiError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      switch (status) {
        case 400:
          return {
            message: data.message || 'Bad request. Please check your input.',
            type: 'validation',
          }
        case 401:
          return {
            message: 'Unauthorized. Please log in again.',
            type: 'auth',
          }
        case 403:
          return {
            message: 'Access denied. You do not have permission.',
            type: 'permission',
          }
        case 404:
          return {
            message: 'Resource not found.',
            type: 'notfound',
          }
        case 413:
          return {
            message: 'File too large. Please reduce file size.',
            type: 'filesize',
          }
        case 429:
          return {
            message: 'Too many requests. Please try again later.',
            type: 'ratelimit',
          }
        case 500:
          return {
            message: 'Server error. Please try again later.',
            type: 'server',
          }
        default:
          return {
            message: data.message || 'An error occurred. Please try again.',
            type: 'unknown',
          }
      }
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Check your internet connection.',
        type: 'network',
      }
    } else {
      // Error in request setup
      return {
        message: error.message || 'An unexpected error occurred.',
        type: 'client',
      }
    }
  },

  // Log error
  logError: (error, context = '') => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    }

    console.error('Error logged:', errorInfo)

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Send to Sentry, LogRocket, etc.
    }

    return errorInfo
  },

  // Format error for user display
  formatErrorMessage: (error) => {
    const errorInfo = errorHandler.handleApiError(error)
    return errorInfo.message
  },
}

export default errorHandler
