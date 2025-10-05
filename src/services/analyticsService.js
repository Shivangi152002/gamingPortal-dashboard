import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://85.209.95.229:3000/api'

// Analytics and Tracking Operations
export const analyticsService = {
  // Get game performance data
  getGameAnalytics: async (gameId, timeRange = '30d') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/games/${gameId}`, {
        params: { timeRange },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching game analytics:', error)
      throw error
    }
  },

  // Get user engagement data
  getUserAnalytics: async (timeRange = '30d') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/users`, {
        params: { timeRange },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      throw error
    }
  },

  // Get traffic analytics
  getTrafficAnalytics: async (timeRange = '30d') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/traffic`, {
        params: { timeRange },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching traffic analytics:', error)
      throw error
    }
  },

  // Track event
  trackEvent: async (eventData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/analytics/event`, eventData)
      return response.data
    } catch (error) {
      console.error('Error tracking event:', error)
      throw error
    }
  },

  // Get dashboard summary
  getDashboardSummary: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`)
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      throw error
    }
  },

  // Get top performing games
  getTopGames: async (limit = 10, timeRange = '30d') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/top-games`, {
        params: { limit, timeRange },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching top games:', error)
      throw error
    }
  },

  // Get device breakdown
  getDeviceBreakdown: async (timeRange = '30d') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/devices`, {
        params: { timeRange },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching device breakdown:', error)
      throw error
    }
  },
}

export default analyticsService
