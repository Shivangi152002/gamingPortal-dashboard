import axios from '../utils/axios'
import { config } from '../config'

// Analytics and Tracking Operations
export const analyticsService = {
  // Get game performance data
  getGameAnalytics: async (gameId, timeRange = '30d') => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/analytics/games/${gameId}`, {
        timeout: config.api.timeout,
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
      const response = await axios.get(`${config.api.baseUrl}/analytics/users`, {
        timeout: config.api.timeout,
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
      const response = await axios.get(`${config.api.baseUrl}/analytics/traffic`, {
        timeout: config.api.timeout,
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
      const response = await axios.post(`${config.api.baseUrl}/analytics/event`, eventData, {
        withCredentials: true,
        timeout: config.api.timeout
      })
      return response.data
    } catch (error) {
      console.error('Error tracking event:', error)
      throw error
    }
  },

  // Get dashboard summary
  getDashboardSummary: async () => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/analytics/dashboard`, {
        timeout: config.api.timeout
      })
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      throw error
    }
  },

  // Get top performing games
  getTopGames: async (limit = 10, timeRange = '30d') => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/analytics/top-games`, {
        timeout: config.api.timeout,
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
      const response = await axios.get(`${config.api.baseUrl}/analytics/devices`, {
        timeout: config.api.timeout,
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
