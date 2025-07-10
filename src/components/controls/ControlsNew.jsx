import React from 'react'
import UploadArea from '../ui/UploadArea'
import ImageControls from './ImageControls'
import DimensionControls from './DimensionControls'

const Controls = ({ 
  modelData, 
  uploadedImages, 
  dimensions, 
  onImageUpload, 
  onUpdateImageProperties, 
  onRemoveImage, 
  onUpdateDimensions 
}) => {
  return (
    <div className="controls">
      <h2>3D Model Controls</h2>
      
      {/* Image Upload Section */}
      <div className="control-group">
        <label>Upload Images</label>
        <UploadArea 
          onFileUpload={onImageUpload}
          maxFiles={2}
          currentCount={uploadedImages.length}
        />
        
        <ImageControls 
          images={uploadedImages}
          onUpdateImageProperties={onUpdateImageProperties}
          onRemoveImage={onRemoveImage}
        />
      </div>

      {/* Dimension Controls */}
      <DimensionControls 
        modelData={modelData}
        dimensions={dimensions}
        onUpdateDimensions={onUpdateDimensions}
      />

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
