import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { quantizeImage } from '../../utils/textureHelpers'

// Component for loading GLB model
const GLBModel = ({ modelUrl, uploadedImages, dimensions }) => {
  const { scene, error } = useGLTF(modelUrl)
  const materialsRef = useRef([]) // Store references to materials for uniform updates



  // Apply textures to the loaded model
  useEffect(() => {
    if (!scene) return

    // Clear previous material references
    materialsRef.current = []

    const applyTexturesToModel = async () => {
      const textureData = []

      // Process uploaded images and create quantized textures
      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i]
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

              // Store texture with its corresponding image data and index
              textureData.push({
                texture,
                image,
                index: i
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

      // Apply textures to all meshes in the scene
      scene.traverse((child) => {
        if (child.isMesh) {
          if (textureData.length === 0) {
            // No textures - use default material
            child.material = new THREE.MeshLambertMaterial({
              color: 0xcccccc,
              transparent: false
            })
          } else if (textureData.length === 1) {
            // Single texture - apply current scale and offset
            const { texture, image } = textureData[0]
            texture.repeat.set(image.scale, image.scale)
            texture.offset.set(image.translateX, image.translateY)
            
            child.material = new THREE.MeshLambertMaterial({
              map: texture,
              transparent: true
            })
          } else if (textureData.length > 1) {
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
              uniform vec2 scale1;
              uniform vec2 scale2;
              uniform vec2 offset1;
              uniform vec2 offset2;
              varying vec2 vUv;
              
              void main() {
                // Apply scale and offset transformations to UV coordinates
                vec2 uv1 = vUv * scale1 + offset1;
                vec2 uv2 = vUv * scale2 + offset2;
                
                vec4 color1 = texture2D(texture1, uv1);
                vec4 color2 = texture2D(texture2, uv2);
                
                // Blend textures with controlled opacity
                vec4 finalColor = mix(color1, color2, opacity2 * color2.a);
                finalColor.a = max(color1.a, color2.a);
                
                gl_FragColor = finalColor;
              }
            `

            const shaderMaterial = new THREE.ShaderMaterial({
              vertexShader,
              fragmentShader,
              uniforms: {
                texture1: { value: textureData[0].texture },
                texture2: { value: textureData[1].texture },
                opacity1: { value: 0.8 },
                opacity2: { value: 0.6 },
                scale1: { value: new THREE.Vector2(textureData[0].image.scale, textureData[0].image.scale) },
                scale2: { value: new THREE.Vector2(textureData[1].image.scale, textureData[1].image.scale) },
                offset1: { value: new THREE.Vector2(textureData[0].image.translateX, textureData[0].image.translateY) },
                offset2: { value: new THREE.Vector2(textureData[1].image.translateX, textureData[1].image.translateY) }
              },
              transparent: true
            })
            
            child.material = shaderMaterial
            
            // Store material reference for uniform updates
            if (!materialsRef.current.includes(shaderMaterial)) {
              materialsRef.current.push(shaderMaterial)
            }
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

  // Update shader uniforms when image properties change
  useEffect(() => {
    if (uploadedImages.length === 2 && materialsRef.current.length > 0) {
      materialsRef.current.forEach(material => {
        if (material.uniforms) {
          // Update scale uniforms
          material.uniforms.scale1.value.set(uploadedImages[0].scale, uploadedImages[0].scale)
          material.uniforms.scale2.value.set(uploadedImages[1].scale, uploadedImages[1].scale)
          
          // Update offset uniforms
          material.uniforms.offset1.value.set(uploadedImages[0].translateX, uploadedImages[0].translateY)
          material.uniforms.offset2.value.set(uploadedImages[1].translateX, uploadedImages[1].translateY)
          
          // Mark uniforms as needing update
          material.uniforms.scale1.needsUpdate = true
          material.uniforms.scale2.needsUpdate = true
          material.uniforms.offset1.needsUpdate = true
          material.uniforms.offset2.needsUpdate = true
        }
      })
    }
  }, [uploadedImages])

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
