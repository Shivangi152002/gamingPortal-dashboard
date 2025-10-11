import axios from '../utils/axios'
import { config } from '../config'

// AWS S3 and CloudFront Operations
export const awsService = {
  // S3 Operations
  s3: {
    // Get bucket status
    getBucketStatus: async (bucketName) => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/aws/s3/status`, {
          params: { bucket: bucketName },
          timeout: config.api.timeout
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
        const response = await axios.get(`${config.api.baseUrl}/aws/s3/list`, {
          params: { bucket: bucketName, prefix },
          timeout: config.api.timeout
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

        const response = await axios.post(`${config.api.baseUrl}/aws/s3/upload`, formData, {
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
        console.error('Error uploading to S3:', error)
        throw error
      }
    },

    // Delete from S3
    deleteFromS3: async (bucketName, key) => {
      try {
        const response = await axios.delete(`${config.api.baseUrl}/aws/s3/delete`, {
          withCredentials: true,
          data: { bucket: bucketName, key },
          timeout: config.api.timeout
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
        const response = await axios.get(`${config.api.baseUrl}/aws/s3/analytics`, {
          timeout: config.api.timeout
        })
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
        const response = await axios.get(`${config.api.baseUrl}/aws/cloudfront/stats`, {
          params: { distributionId },
          timeout: config.api.timeout
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
        const response = await axios.post(`${config.api.baseUrl}/aws/cloudfront/invalidate`, {
          distributionId,
          paths: Array.isArray(paths) ? paths : [paths],
        }, {
          withCredentials: true,
          timeout: config.api.timeout
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
          `${config.api.baseUrl}/aws/cloudfront/invalidation/${invalidationId}`,
          {
            params: { distributionId },
            timeout: config.api.timeout
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
        const response = await axios.get(`${config.api.baseUrl}/aws/cloudfront/metrics`, {
          params: { distributionId, timeRange },
          timeout: config.api.timeout
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
