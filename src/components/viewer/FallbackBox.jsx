import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { quantizeImage } from '../../utils/textureHelpers'

// Fallback box component
const FallbackBox = ({ uploadedImages, dimensions }) => {
  const meshRef = useRef()
  
  // Create geometry based on dimensions
  const geometry = useMemo(() => {
    const scaleX = dimensions.x ? dimensions.x / 100 : 1
    const scaleY = dimensions.y ? dimensions.y / 100 : 1
    const scaleZ = dimensions.z ? dimensions.z / 100 : 1
    return new THREE.BoxGeometry(scaleX, scaleY, scaleZ)
  }, [dimensions])

  // Create material with textures
  const material = useMemo(() => {
    if (uploadedImages.length === 0) {
      return new THREE.MeshLambertMaterial({ color: 0xcccccc })
    }

    if (uploadedImages.length === 1) {
      // Single image
      const firstImage = uploadedImages[0]
      if (firstImage) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = firstImage.url
        
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
          texture.repeat.set(firstImage.scale, firstImage.scale)
          texture.offset.set(firstImage.translateX, firstImage.translateY)
          
          if (meshRef.current) {
            meshRef.current.material = new THREE.MeshLambertMaterial({ map: texture })
          }
        }
      }
    } else if (uploadedImages.length > 1) {
      // Multiple images - use shader material for blending
      const createBlendedMaterial = async () => {
        const textures = []
        
        for (const image of uploadedImages) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          const texture = await new Promise((resolve) => {
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
              
              resolve(texture)
            }
            img.src = image.url
          })
          
          textures.push(texture)
        }
        
        if (meshRef.current && textures.length >= 2) {
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
            varying vec2 vUv;
            
            void main() {
              vec4 color1 = texture2D(texture1, vUv);
              vec4 color2 = texture2D(texture2, vUv);
              
              // Blend textures with transparency
              vec4 finalColor = mix(color1, color2, color2.a * 0.6);
              finalColor.a = max(color1.a, color2.a);
              
              gl_FragColor = finalColor;
            }
          `

          meshRef.current.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
              texture1: { value: textures[0] },
              texture2: { value: textures[1] }
            },
            transparent: true
          })
        }
      }
      
      createBlendedMaterial()
    }

    return new THREE.MeshLambertMaterial({ color: 0xcccccc })
  }, [uploadedImages])

  return <mesh ref={meshRef} geometry={geometry} material={material} />
}

export default FallbackBox
