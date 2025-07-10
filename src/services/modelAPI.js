import { API_ENDPOINTS } from '../utils/constants'

export const fetchModelData = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.MODEL_DATA)
    if (!response.ok) {
      throw new Error('Failed to fetch model data')
    }
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getDefaultDimensions = (measurements) => {
  if (!measurements) return {}
  
  const defaultDimensions = {}
  Object.keys(measurements).forEach(key => {
    const measurement = measurements[key]
    defaultDimensions[key] = measurement.value || (measurement.min + measurement.max) / 2
  })
  return defaultDimensions
}
