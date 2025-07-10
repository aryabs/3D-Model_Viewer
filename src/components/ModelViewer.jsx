import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Image quantization function
const quantizeImage = (imageData, colors = 2) => {
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


// Component for loading GLB model
const GLBModel = ({ modelUrl, uploadedImages, dimensions }) => {
  console.log('GLBModel component - attempting to load:', modelUrl)
  const { scene, error } = useGLTF(modelUrl)
  
  useEffect(() => {
    if (error) {
      console.error('useGLTF error:', error)
    }
    if (scene) {
      console.log('GLB model loaded successfully:', scene)
    }
  }, [scene, error])
  
  // Apply textures to the loaded model
  useEffect(() => {
    if (!scene || uploadedImages.length === 0) return

    const applyTexturesToModel = async () => {
      const textures = []
      
      // Process uploaded images and create quantized textures
      for (const image of uploadedImages) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              
              canvas.width = img.width
              canvas.height = img.height
              ctx.drawImage(img, 0, 0)
              
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const quantizedDataUrl = quantizeImage(imageData)
              
              const texture = new THREE.TextureLoader().load(quantizedDataUrl)
              texture.wrapS = THREE.RepeatWrapping
              texture.wrapT = THREE.RepeatWrapping
              texture.repeat.set(image.scale, image.scale)
              texture.offset.set(image.translateX, image.translateY)
              
              textures.push(texture)
              resolve()
            }
            img.onerror = reject
            img.src = image.url
          })
        } catch (error) {
          console.error('Error loading texture:', error)
        }
      }

      // Apply textures to all meshes in the scene
      scene.traverse((child) => {
        if (child.isMesh) {
          if (textures.length >= 1) {
            child.material = new THREE.MeshLambertMaterial({ 
              map: textures[0],
              transparent: true 
            })
          }
        }
      })
    }

    applyTexturesToModel()
  }, [scene, uploadedImages])

  // Apply dimension scaling to the model
  useEffect(() => {
    if (!scene || !dimensions) return

    const scaleX = dimensions.x ? dimensions.x / 100 : 1
    const scaleY = dimensions.y ? dimensions.y / 100 : 1
    const scaleZ = dimensions.z ? dimensions.z / 100 : 1

    scene.scale.set(scaleX, scaleY, scaleZ)
  }, [scene, dimensions])

  if (error) {
    console.error('Error loading GLB model:', error)
    throw error // This will be caught by the parent component
  }

  if (!scene) {
    return null
  }

  return <primitive object={scene} />
}

// Fallback box component
const FallbackBox = ({ uploadedImages, dimensions }) => {
  const meshRef = useRef()
  
  // Create geometry based on dimensions
  const geometry = React.useMemo(() => {
    const scaleX = dimensions.x ? dimensions.x / 100 : 1
    const scaleY = dimensions.y ? dimensions.y / 100 : 1
    const scaleZ = dimensions.z ? dimensions.z / 100 : 1
    return new THREE.BoxGeometry(scaleX, scaleY, scaleZ)
  }, [dimensions])

  // Create material with textures
  const material = React.useMemo(() => {
    if (uploadedImages.length === 0) {
      return new THREE.MeshLambertMaterial({ color: 0xcccccc })
    }

    // Use the first uploaded image as texture
    const firstImage = uploadedImages[0]
    if (firstImage) {
      // Create quantized texture
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = firstImage.url
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const quantizedDataUrl = quantizeImage(imageData)
        
        const texture = new THREE.TextureLoader().load(quantizedDataUrl)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(firstImage.scale, firstImage.scale)
        texture.offset.set(firstImage.translateX, firstImage.translateY)
        
        if (meshRef.current) {
          meshRef.current.material = new THREE.MeshLambertMaterial({ map: texture })
        }
      }
    }

    return new THREE.MeshLambertMaterial({ color: 0xcccccc })
  }, [uploadedImages])

  return <mesh ref={meshRef} geometry={geometry} material={material} />
}

const ModelViewer = ({ modelData, uploadedImages, dimensions }) => {
  const groupRef = useRef()
  const [modelUrl, setModelUrl] = useState(null)
  const [useGLBModel, setUseGLBModel] = useState(true)

  // Extract model URL from API data
  useEffect(() => {
    if (modelData?.model) {
      console.log('Setting model URL:', modelData.model)
      setModelUrl(modelData.model)
      setUseGLBModel(true)
    }
  }, [modelData])

  // Error boundary for GLB model loading
  const handleGLBError = (error) => {
    console.warn('GLB model failed to load, using fallback box:', error)
    setUseGLBModel(false)
  }

  console.log('ModelViewer render - useGLBModel:', useGLBModel, 'modelUrl:', modelUrl)

  return (
    <group ref={groupRef}>
      {useGLBModel && modelUrl ? (
        <React.Suspense fallback={null}>
          <ErrorBoundary onError={handleGLBError}>
            <GLBModel 
              modelUrl={modelUrl}
              uploadedImages={uploadedImages}
              dimensions={dimensions}
            />
          </ErrorBoundary>
        </React.Suspense>
      ) : (
        <FallbackBox 
          uploadedImages={uploadedImages}
          dimensions={dimensions}
        />
      )}
    </group>
  )
}

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Model loading error:', error, errorInfo)
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}

export default ModelViewer
