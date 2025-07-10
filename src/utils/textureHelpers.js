// Image quantization utility
export const quantizeImage = (imageData, colors = 2) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = imageData.width
  canvas.height = imageData.height
  
  const data = imageData.data
  const quantizedData = new Uint8ClampedArray(data.length)
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    
    // Simple quantization to 2 colors (black and white based on luminance)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    const quantized = luminance > 128 ? 255 : 0
    
    quantizedData[i] = quantized     // R
    quantizedData[i + 1] = quantized // G
    quantizedData[i + 2] = quantized // B
    quantizedData[i + 3] = a         // A
  }
  
  const newImageData = new ImageData(quantizedData, canvas.width, canvas.height)
  ctx.putImageData(newImageData, 0, 0)
  
  return canvas.toDataURL()
}

// Texture creation helper
export const createTexture = async (image, scale = 1, translateX = 0, translateY = 0) => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const quantizedDataUrl = quantizeImage(imageData)
      
      // Note: THREE should be imported in the component using this utility
      const texture = new THREE.TextureLoader().load(quantizedDataUrl)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(scale, scale)
      texture.offset.set(translateX, translateY)
      
      resolve(texture)
    }
    img.onerror = reject
    img.src = image.url
  })
}
