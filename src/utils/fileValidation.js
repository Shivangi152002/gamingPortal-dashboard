// File validation utilities

const MAX_FILE_SIZE = import.meta.env.VITE_MAX_UPLOAD_SIZE || 104857600 // 100MB default

export const fileValidation = {
  // Validate game ZIP file
  validateGameZip: (file) => {
    const errors = []

    if (!file) {
      errors.push('Game file is required')
      return { valid: false, errors }
    }

    // Check file type
    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
      errors.push('Game must be a ZIP file')
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size must be less than ${MAX_FILE_SIZE / 1048576}MB`)
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  },

  // Validate image file
  validateImage: (file, maxSize = 5242880) => {
    // 5MB default
    const errors = []
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!file) {
      errors.push('Image file is required')
      return { valid: false, errors }
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('Image must be JPG, PNG, or WebP format')
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`Image size must be less than ${maxSize / 1048576}MB`)
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  },

  // Validate icon file
  validateIcon: (file) => {
    const errors = []
    const allowedTypes = ['image/png', 'image/svg+xml']

    if (!file) {
      errors.push('Icon file is required')
      return { valid: false, errors }
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('Icon must be PNG or SVG format')
    }

    // Check file size
    if (file.size > 1048576) {
      // 1MB
      errors.push('Icon size must be less than 1MB')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  },

  // Validate GIF/WebM file
  validateGif: (file) => {
    const errors = []
    const allowedTypes = ['image/gif', 'video/webm']

    if (!file) {
      return { valid: true, errors } // GIF/WebM is optional
    }

    // Check file type - allow both GIF and WebM
    if (!allowedTypes.includes(file.type)) {
      errors.push('Preview must be a GIF or WebM file')
    }

    // Check file size (20MB max for GIF/WebM - increased for video)
    if (file.size > 20971520) {
      errors.push('File size must be less than 20MB')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  },

  // Get file extension
  getFileExtension: (filename) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
  },

  // Check if file is image
  isImage: (file) => {
    return file.type.startsWith('image/')
  },

  // Check if file is video
  isVideo: (file) => {
    return file.type.startsWith('video/')
  },
}

export default fileValidation
