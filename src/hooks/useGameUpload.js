import { useState } from 'react'
import { useSnackbar } from 'notistack'
import gameService from '../services/gameService'
import { fileValidation } from '../utils/fileValidation'
import { errorHandler } from '../utils/errorHandler'

export const useGameUpload = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadGame = async (gameData, files) => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Validate files
      const gameValidation = fileValidation.validateGameZip(files.game)
      if (!gameValidation.valid) {
        throw new Error(gameValidation.errors.join(', '))
      }

      const thumbnailValidation = fileValidation.validateImage(files.thumbnail)
      if (!thumbnailValidation.valid) {
        throw new Error(thumbnailValidation.errors.join(', '))
      }

      if (files.icon) {
        const iconValidation = fileValidation.validateIcon(files.icon)
        if (!iconValidation.valid) {
          throw new Error(iconValidation.errors.join(', '))
        }
      }

      if (files.preview) {
        const gifValidation = fileValidation.validateGif(files.preview)
        if (!gifValidation.valid) {
          throw new Error(gifValidation.errors.join(', '))
        }
      }

      // Upload game
      const result = await gameService.uploadGame(gameData, files, (progressValue) => {
        setProgress(progressValue)
      })

      enqueueSnackbar('Game uploaded successfully!', { variant: 'success' })
      setUploading(false)
      return result
    } catch (err) {
      const errorMessage = errorHandler.formatErrorMessage(err)
      setError(errorMessage)
      enqueueSnackbar(errorMessage, { variant: 'error' })
      setUploading(false)
      throw err
    }
  }

  const resetUpload = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return {
    uploadGame,
    uploading,
    progress,
    error,
    resetUpload,
  }
}

export default useGameUpload
