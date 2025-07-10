import React, { useRef } from 'react'

const Controls = ({ 
  modelData, 
  uploadedImages, 
  dimensions, 
  onImageUpload, 
  onUpdateImageProperties, 
  onRemoveImage, 
  onUpdateDimensions 
}) => {
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      onImageUpload(files)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.currentTarget.classList.add('dragover')
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.currentTarget.classList.remove('dragover')
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.currentTarget.classList.remove('dragover')
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      onImageUpload(files)
    }
  }

  const handleDimensionChange = (key, value) => {
    const measurement = modelData.measurements[key]
    const clampedValue = Math.max(measurement.min, Math.min(measurement.max, parseFloat(value)))
    onUpdateDimensions({ [key]: clampedValue })
  }

  return (
    <div className="controls">
      <h2>3D Model Controls</h2>
      
      {/* Image Upload Section */}
      <div className="control-group">
        <label>Upload Images</label>
        <div 
          className="upload-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <p>Drag & drop images here or click to select</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
        
        {uploadedImages.length > 0 && (
          <div className="uploaded-images">
            {uploadedImages.map((image, index) => (
              <div key={image.id} className="uploaded-image">
                <img src={image.url} alt={`Upload ${index + 1}`} />
                <div className="image-controls">
                  <label>Scale: {image.scale.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={image.scale}
                    onChange={(e) => onUpdateImageProperties(image.id, { scale: parseFloat(e.target.value) })}
                  />
                  
                  <label>Position X: {image.translateX.toFixed(2)}</label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={image.translateX}
                    onChange={(e) => onUpdateImageProperties(image.id, { translateX: parseFloat(e.target.value) })}
                  />
                  
                  <label>Position Y: {image.translateY.toFixed(2)}</label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={image.translateY}
                    onChange={(e) => onUpdateImageProperties(image.id, { translateY: parseFloat(e.target.value) })}
                  />
                  
                  <button onClick={() => onRemoveImage(image.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dimension Controls */}
      {modelData?.measurements && (
        <div className="control-group">
          <label>Model Dimensions</label>
          <div className="dimension-controls">
            {Object.entries(modelData.measurements).map(([key, measurement]) => (
              <div key={key} className="dimension-control">
                <label>{key.toUpperCase()}: {dimensions[key]?.toFixed(2) || 0}</label>
                <input
                  type="range"
                  min={measurement.min}
                  max={measurement.max}
                  step="0.1"
                  value={dimensions[key] || measurement.value || measurement.min}
                  onChange={(e) => handleDimensionChange(key, e.target.value)}
                />
                <small>{measurement.min} - {measurement.max}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Info */}
      {modelData && (
        <div className="control-group">
          <label>Model Information</label>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <p><strong>Type:</strong> {modelData.type || 'Unknown'}</p>
            <p><strong>Surfaces:</strong> {modelData.surfaces?.length || 0}</p>
            {modelData.description && <p><strong>Description:</strong> {modelData.description}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Controls
