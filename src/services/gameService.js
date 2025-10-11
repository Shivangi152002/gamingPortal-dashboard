import axios from '../utils/axios'
import { config } from '../config'

// Game CRUD Operations
export const gameService = {
  // Get all games
  getAllGames: async (filters = {}) => {
    try {
      const response = await axios.get(config.api.getFullUrl(config.api.endpoints.games.list), { 
        params: filters,
        timeout: config.api.timeout
      })
      return response.data
    } catch (error) {
      console.error('Error fetching games:', error)
      throw error
    }
  },

  // Get single game by ID
  getGameById: async (gameId) => {
    try {
      const response = await axios.get(config.api.getFullUrl(config.api.endpoints.games.single(gameId)), {
        timeout: config.api.timeout
      })
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

      const response = await axios.post(`${config.api.baseUrl}/games/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60 seconds for uploads
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
      const response = await axios.put(config.api.getFullUrl(config.api.endpoints.games.update(gameId)), gameData, {
        withCredentials: true,
        timeout: config.api.timeout
      })
      return response.data
    } catch (error) {
      console.error('Error updating game:', error)
      throw error
    }
  },

  // Delete game
  deleteGame: async (gameId) => {
    try {
      const response = await axios.delete(config.api.getFullUrl(config.api.endpoints.games.delete(gameId)), {
        withCredentials: true,
        timeout: config.api.timeout
      })
      return response.data
    } catch (error) {
      console.error('Error deleting game:', error)
      throw error
    }
  },

  // Publish game
  publishGame: async (gameId) => {
    try {
      const response = await axios.post(`${config.api.baseUrl}/games/${gameId}/publish`, {}, {
        withCredentials: true,
        timeout: config.api.timeout
      })
      return response.data
    } catch (error) {
      console.error('Error publishing game:', error)
      throw error
    }
  },

  // Bulk operations
  bulkUpload: async (gamesData) => {
    try {
      const response = await axios.post(`${config.api.baseUrl}/games/bulk-upload`, gamesData, {
        withCredentials: true,
        timeout: 60000 // 60 seconds for bulk uploads
      })
      return response.data
    } catch (error) {
      console.error('Error bulk uploading games:', error)
      throw error
    }
  },
}

export default gameService
