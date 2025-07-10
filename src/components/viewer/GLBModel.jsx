import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { quantizeImage } from '../../utils/textureHelpers'

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
          if (textures.length === 1) {
            child.material = new THREE.MeshLambertMaterial({ 
              map: textures[0],
              transparent: true 
            })
          } else if (textures.length > 1) {
            // Create a custom shader material for blending multiple textures
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
              uniform float opacity1;
              uniform float opacity2;
              varying vec2 vUv;
              
              void main() {
                vec4 color1 = texture2D(texture1, vUv);
                vec4 color2 = texture2D(texture2, vUv);
                
                // Blend textures with controlled opacity
                vec4 finalColor = mix(color1, color2, opacity2 * color2.a);
                finalColor.a = max(color1.a, color2.a);
                
                gl_FragColor = finalColor;
              }
            `

            child.material = new THREE.ShaderMaterial({
              vertexShader,
              fragmentShader,
              uniforms: {
                texture1: { value: textures[0] },
                texture2: { value: textures[1] },
                opacity1: { value: 0.8 },
                opacity2: { value: 0.6 }
              },
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

export default GLBModel
