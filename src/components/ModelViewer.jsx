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
              // Make images cover only a portion of the surface (not full coverage)
              texture.repeat.set(image.scale * 0.5, image.scale * 0.5) // Reduced from full scale
              texture.offset.set(image.translateX * 0.5, image.translateY * 0.5)
              
              textures.push({
                texture,
                scale: image.scale,
                translateX: image.translateX,
                translateY: image.translateY,
                id: image.id
              })
              resolve()
            }
            img.onerror = reject
            img.src = image.url
          })
        } catch (error) {
          console.error('Error loading texture:', error)
        }
      }

      // Apply textures to all meshes in the scene with proper layering
      scene.traverse((child) => {
        if (child.isMesh) {
          if (textures.length === 1) {
            // Single texture - apply directly
            child.material = new THREE.MeshLambertMaterial({ 
              map: textures[0].texture,
              transparent: true,
              alphaTest: 0.1
            })
          } else if (textures.length >= 2) {
            // Multiple textures - create layered material with custom shader
            const vertexShader = `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `

            const fragmentShader = `
              uniform sampler2D texture1;
              uniform sampler2D texture2;
              uniform float scale1;
              uniform float scale2;
              uniform vec2 offset1;
              uniform vec2 offset2;
              varying vec2 vUv;
              
              void main() {
                // Sample first texture (uploaded first, appears under)
                vec2 uv1 = vUv * scale1 + offset1;
                vec4 color1 = texture2D(texture1, uv1);
                
                // Sample second texture (uploaded second, appears over)
                vec2 uv2 = vUv * scale2 + offset2;
                vec4 color2 = texture2D(texture2, uv2);
                
                // Blend textures - second image overlays first
                // Use alpha blending for proper layering
                vec4 finalColor = mix(color1, color2, color2.a * 0.8);
                
                // Ensure some transparency for realistic fabric appearance
                finalColor.a = max(color1.a, color2.a * 0.9);
                
                gl_FragColor = finalColor;
              }
            `

            child.material = new THREE.ShaderMaterial({
              vertexShader,
              fragmentShader,
              uniforms: {
                texture1: { value: textures[0].texture },
                texture2: { value: textures[1].texture },
                scale1: { value: textures[0].scale * 0.5 },
                scale2: { value: textures[1].scale * 0.5 },
                offset1: { value: new THREE.Vector2(textures[0].translateX * 0.5, textures[0].translateY * 0.5) },
                offset2: { value: new THREE.Vector2(textures[1].translateX * 0.5, textures[1].translateY * 0.5) }
              },
              transparent: true,
              alphaTest: 0.1
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

  // Create material with layered textures
  const material = React.useMemo(() => {
    if (uploadedImages.length === 0) {
      return new THREE.MeshLambertMaterial({ color: 0xcccccc })
    }

    if (uploadedImages.length === 1) {
      // Single image - create quantized texture
      const firstImage = uploadedImages[0]
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const quantizedDataUrl = quantizeImage(imageData)
        
        const texture = new THREE.TextureLoader().load(quantizedDataUrl)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        // Partial surface coverage
        texture.repeat.set(firstImage.scale * 0.5, firstImage.scale * 0.5)
        texture.offset.set(firstImage.translateX * 0.5, firstImage.translateY * 0.5)
        
        if (meshRef.current) {
          meshRef.current.material = new THREE.MeshLambertMaterial({ 
            map: texture,
            transparent: true,
            alphaTest: 0.1
          })
        }
      }
      img.src = firstImage.url
      
      return new THREE.MeshLambertMaterial({ color: 0xcccccc })
      
    } else if (uploadedImages.length >= 2) {
      // Multiple images - use shader for proper layering
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `

      const fragmentShader = `
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float scale1;
        uniform float scale2;
        uniform vec2 offset1;
        uniform vec2 offset2;
        varying vec2 vUv;
        
        void main() {
          // Sample first texture (uploaded first, appears under)
          vec2 uv1 = vUv * scale1 + offset1;
          vec4 color1 = texture2D(texture1, uv1);
          
          // Sample second texture (uploaded second, appears over)
          vec2 uv2 = vUv * scale2 + offset2;
          vec4 color2 = texture2D(texture2, uv2);
          
          // Blend textures - second image overlays first
          vec4 finalColor = mix(color1, color2, color2.a * 0.8);
          finalColor.a = max(color1.a, color2.a * 0.9);
          
          gl_FragColor = finalColor;
        }
      `

      // Load and process textures
      const processTextures = async () => {
        const textures = []
        
        for (let i = 0; i < Math.min(2, uploadedImages.length); i++) {
          const image = uploadedImages[i]
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          await new Promise((resolve) => {
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
              
              textures.push({
                texture,
                scale: image.scale,
                translateX: image.translateX,
                translateY: image.translateY
              })
              resolve()
            }
            img.src = image.url
          })
        }

        if (meshRef.current && textures.length >= 2) {
          meshRef.current.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
              texture1: { value: textures[0].texture },
              texture2: { value: textures[1].texture },
              scale1: { value: textures[0].scale * 0.5 },
              scale2: { value: textures[1].scale * 0.5 },
              offset1: { value: new THREE.Vector2(textures[0].translateX * 0.5, textures[0].translateY * 0.5) },
              offset2: { value: new THREE.Vector2(textures[1].translateX * 0.5, textures[1].translateY * 0.5) }
            },
            transparent: true,
            alphaTest: 0.1
          })
        }
      }

      processTextures()
      
      return new THREE.MeshLambertMaterial({ color: 0xcccccc })
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
