// API endpoints
export const API_ENDPOINTS = {
  MODEL_DATA: 'https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/api.json'
}

// Default values
export const DEFAULT_VALUES = {
  IMAGE_SCALE: 0.3,
  IMAGE_TRANSLATE_X: 0,
  IMAGE_TRANSLATE_Y: 0,
  QUANTIZATION_COLORS: 2,
  QUANTIZATION_THRESHOLD: 128
}

// Control limits
export const CONTROL_LIMITS = {
  SCALE: { min: 0.1, max: 2, step: 0.1 },
  TRANSLATE: { min: -2, max: 2, step: 0.1 },
  DIMENSION_STEP: 0.1
}

// UI messages
export const UI_MESSAGES = {
  LOADING: 'Loading model data...',
  ERROR_PREFIX: 'Error: ',
  UPLOAD_PROMPT: 'Drag & drop up to 2 images here or click to select',
  UPLOAD_LIMIT: 'Maximum 2 images allowed'
}

// Camera settings
export const CAMERA_SETTINGS = {
  POSITION: [0, 0, 5],
  FOV: 75
}

// Lighting settings
export const LIGHTING = {
  AMBIENT_INTENSITY: 0.6,
  DIRECTIONAL_INTENSITY: 1,
  DIRECTIONAL_POSITION: [10, 10, 5]
}
