import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ModelViewer from './components/ModelViewer'
import Controls from './components/Controls'
import './index.css'

function App() {
  const [modelData, setModelData] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [dimensions, setDimensions] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch model data from API
    const fetchModelData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/api.json')
        if (!response.ok) {
          throw new Error('Failed to fetch model data')
        }
        const data = await response.json()
        setModelData(data)
        
        // Initialize dimensions with default values
        if (data.measurements) {
          const defaultDimensions = {}
          Object.keys(data.measurements).forEach(key => {
            const measurement = data.measurements[key]
            defaultDimensions[key] = measurement.value || (measurement.min + measurement.max) / 2
          })
          setDimensions(defaultDimensions)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchModelData()
  }, [])

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).slice(0, 2) // Limit to 2 images max
      .map((file, index) => ({
        id: Date.now() + index,
        file,
        url: URL.createObjectURL(file),
        scale: 0.4, // Start with partial coverage (40% of surface)
        translateX: 0,
        translateY: 0,
        quantized: null
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

  const updateDimensions = (newDimensions) => {
    setDimensions(prev => ({ ...prev, ...newDimensions }))
  }

  if (loading) {
    return <div className="loading">Loading model data...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="app">
      <Controls 
        modelData={modelData}
        uploadedImages={uploadedImages}
        dimensions={dimensions}
        onImageUpload={handleImageUpload}
        onUpdateImageProperties={updateImageProperties}
        onRemoveImage={removeImage}
        onUpdateDimensions={updateDimensions}
      />
      <div className="viewer">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <ModelViewer 
            modelData={modelData}
            uploadedImages={uploadedImages}
            dimensions={dimensions}
          />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
    </div>
  )
}

export default App
