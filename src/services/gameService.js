import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Game CRUD Operations
export const gameService = {
  // Get all games
  getAllGames: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/games`, { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching games:', error)
      throw error
    }
  },

  // Get single game by ID
  getGameById: async (gameId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/games/${gameId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching game:', error)
      throw error
    }
  },

  // Upload new game
  uploadGame: async (gameData, files, onProgress) => {
    try {
      const formData = new FormData()
      
      // Append metadata
      Object.keys(gameData).forEach((key) => {
        if (Array.isArray(gameData[key])) {
          formData.append(key, JSON.stringify(gameData[key]))
        } else {
          formData.append(key, gameData[key])
        }
      })

      // Append files
      if (files.game) formData.append('game', files.game)
      if (files.thumbnail) formData.append('thumbnail', files.thumbnail)
      if (files.icon) formData.append('icon', files.icon)
      if (files.preview) formData.append('preview', files.preview)

      const response = await axios.post(`${API_BASE_URL}/games/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (onProgress) onProgress(percentCompleted)
        },
      })

      return response.data
    } catch (error) {
      console.error('Error uploading game:', error)
      throw error
    }
  },

  // Update game
  updateGame: async (gameId, gameData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/games/${gameId}`, gameData)
      return response.data
    } catch (error) {
      console.error('Error updating game:', error)
      throw error
    }
  },

  // Delete game
  deleteGame: async (gameId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/games/${gameId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting game:', error)
      throw error
    }
  },

  // Publish game
  publishGame: async (gameId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/games/${gameId}/publish`)
      return response.data
    } catch (error) {
      console.error('Error publishing game:', error)
      throw error
    }
  },

  // Bulk operations
  bulkUpload: async (gamesData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/games/bulk-upload`, gamesData)
      return response.data
    } catch (error) {
      console.error('Error bulk uploading games:', error)
      throw error
    }
  },
}

export default gameService
