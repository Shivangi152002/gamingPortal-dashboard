import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// AWS S3 and CloudFront Operations
export const awsService = {
  // S3 Operations
  s3: {
    // Get bucket status
    getBucketStatus: async (bucketName) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/aws/s3/status`, {
          params: { bucket: bucketName },
        })
        return response.data
      } catch (error) {
        console.error('Error fetching S3 status:', error)
        throw error
      }
    },

    // List objects in bucket
    listObjects: async (bucketName, prefix = '') => {
      try {
        const response = await axios.get(`${API_BASE_URL}/aws/s3/list`, {
          params: { bucket: bucketName, prefix },
        })
        return response.data
      } catch (error) {
        console.error('Error listing S3 objects:', error)
        throw error
      }
    },

    // Upload to S3
    uploadToS3: async (file, path, onProgress) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('path', path)

        const response = await axios.post(`${API_BASE_URL}/aws/s3/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            if (onProgress) onProgress(percentCompleted)
          },
        })

        return response.data
      } catch (error) {
        console.error('Error uploading to S3:', error)
        throw error
      }
    },

    // Delete from S3
    deleteFromS3: async (bucketName, key) => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/aws/s3/delete`, {
          data: { bucket: bucketName, key },
        })
        return response.data
      } catch (error) {
        console.error('Error deleting from S3:', error)
        throw error
      }
    },

    // Get storage analytics
    getStorageAnalytics: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/aws/s3/analytics`)
        return response.data
      } catch (error) {
        console.error('Error fetching storage analytics:', error)
        throw error
      }
    },
  },

  // CloudFront Operations
  cloudfront: {
    // Get distribution statistics
    getStats: async (distributionId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/aws/cloudfront/stats`, {
          params: { distributionId },
        })
        return response.data
      } catch (error) {
        console.error('Error fetching CloudFront stats:', error)
        throw error
      }
    },

    // Invalidate cache
    invalidateCache: async (distributionId, paths) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/aws/cloudfront/invalidate`, {
          distributionId,
          paths: Array.isArray(paths) ? paths : [paths],
        })
        return response.data
      } catch (error) {
        console.error('Error invalidating CloudFront cache:', error)
        throw error
      }
    },

    // Get invalidation status
    getInvalidationStatus: async (distributionId, invalidationId) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/aws/cloudfront/invalidation/${invalidationId}`,
          {
            params: { distributionId },
          }
        )
        return response.data
      } catch (error) {
        console.error('Error fetching invalidation status:', error)
        throw error
      }
    },

    // Get performance metrics
    getPerformanceMetrics: async (distributionId, timeRange = '24h') => {
      try {
        const response = await axios.get(`${API_BASE_URL}/aws/cloudfront/metrics`, {
          params: { distributionId, timeRange },
        })
        return response.data
      } catch (error) {
        console.error('Error fetching CloudFront metrics:', error)
        throw error
      }
    },
  },
}

export default awsService
