import React from 'react'
import Slider from '../ui/Slider'
import Button from '../ui/Button'
import { CONTROL_LIMITS } from '../../utils/constants'

const ImageControls = ({ 
  images, 
  onUpdateImageProperties, 
  onRemoveImage 
}) => {
  if (images.length === 0) {
    return null
  }

  return (
    <div className="uploaded-images">
      {images.map((image, index) => (
        <div key={image.id} className="uploaded-image">
          <img src={image.url} alt={`Upload ${index + 1}`} />
          
          <div className="image-controls">
            <Slider
              label={`Scale (${Math.round(image.scale * 100)}% coverage)`}
              value={image.scale}
              min={CONTROL_LIMITS.SCALE.min}
              max={CONTROL_LIMITS.SCALE.max}
              step={CONTROL_LIMITS.SCALE.step}
              onChange={(value) => onUpdateImageProperties(image.id, { scale: value })}
              formatValue={(val) => val.toFixed(2)}
            />
            
            <Slider
              label="Position X"
              value={image.translateX}
              min={CONTROL_LIMITS.TRANSLATE.min}
              max={CONTROL_LIMITS.TRANSLATE.max}
              step={CONTROL_LIMITS.TRANSLATE.step}
              onChange={(value) => onUpdateImageProperties(image.id, { translateX: value })}
              formatValue={(val) => val.toFixed(2)}
            />
            
            <Slider
              label="Position Y"
              value={image.translateY}
              min={CONTROL_LIMITS.TRANSLATE.min}
              max={CONTROL_LIMITS.TRANSLATE.max}
              step={CONTROL_LIMITS.TRANSLATE.step}
              onChange={(value) => onUpdateImageProperties(image.id, { translateY: value })}
              formatValue={(val) => val.toFixed(2)}
            />
            
            <Button 
              variant="danger" 
              onClick={() => onRemoveImage(image.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImageControls
