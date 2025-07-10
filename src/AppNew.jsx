import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ModelViewer from './components/viewer/ModelViewer'
import Controls from './components/controls/ControlsNew'
import { useModelAPI, useImageUpload, useDimensions } from './hooks/useModelViewer'
import { CAMERA_SETTINGS, LIGHTING, UI_MESSAGES } from './utils/constants'
import './styles/globals.css'

function App() {
  const { modelData, loading, error } = useModelAPI()
  const { uploadedImages, handleImageUpload, updateImageProperties, removeImage } = useImageUpload()
  const { dimensions, updateDimensions } = useDimensions(modelData)

  if (loading) {
    return <div className="loading">{UI_MESSAGES.LOADING}</div>
  }

  if (error) {
    return <div className="error">{UI_MESSAGES.ERROR_PREFIX}{error}</div>
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
        <Canvas camera={{ 
          position: CAMERA_SETTINGS.POSITION, 
          fov: CAMERA_SETTINGS.FOV 
        }}>
          <ambientLight intensity={LIGHTING.AMBIENT_INTENSITY} />
          <directionalLight 
            position={LIGHTING.DIRECTIONAL_POSITION} 
            intensity={LIGHTING.DIRECTIONAL_INTENSITY} 
          />
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
