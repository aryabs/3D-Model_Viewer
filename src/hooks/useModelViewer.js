import { useState, useEffect } from 'react'
import { fetchModelData, getDefaultDimensions } from '../services/modelAPI'
import { DEFAULT_VALUES } from '../utils/constants'

// Custom hook for API data fetching
export const useModelAPI = () => {
  const [modelData, setModelData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadModelData = async () => {
      try {
        const data = await fetchModelData()
        setModelData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadModelData()
  }, [])

  return { modelData, loading, error }
}

// Custom hook for image upload management
export const useImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState([])

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).slice(0, 2) // Limit to 2 images max
      .map((file, index) => ({
        id: Date.now() + index,
        file,
        url: URL.createObjectURL(file),
        scale: DEFAULT_VALUES.IMAGE_SCALE,
        translateX: DEFAULT_VALUES.IMAGE_TRANSLATE_X,
        translateY: DEFAULT_VALUES.IMAGE_TRANSLATE_Y
      }))
    
    setUploadedImages(prev => {
      const combined = [...prev, ...newImages]
      return combined.slice(0, 2) // Ensure maximum 2 images
    })
  }

  const updateImageProperties = (imageId, properties) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, ...properties }
          : img
      )
    )
  }

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
  }

  return {
    uploadedImages,
    handleImageUpload,
    updateImageProperties,
    removeImage
  }
}

// Custom hook for dimension management
export const useDimensions = (modelData) => {
  const [dimensions, setDimensions] = useState({})

  useEffect(() => {
    if (modelData?.measurements) {
      const defaultDimensions = getDefaultDimensions(modelData.measurements)
      setDimensions(defaultDimensions)
    }
  }, [modelData])

  const updateDimensions = (newDimensions) => {
    setDimensions(prev => ({ ...prev, ...newDimensions }))
  }

  return { dimensions, updateDimensions }
}
