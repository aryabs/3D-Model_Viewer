import React, { useRef, useState, useEffect } from 'react'
import GLBModel from './GLBModel'
import FallbackBox from './FallbackBox'
import ErrorBoundary from './ErrorBoundary'

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

export default ModelViewer
