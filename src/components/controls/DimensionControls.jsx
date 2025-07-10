import React from 'react'
import Slider from '../ui/Slider'
import { CONTROL_LIMITS } from '../../utils/constants'

const DimensionControls = ({ 
  modelData, 
  dimensions, 
  onUpdateDimensions 
}) => {
  if (!modelData?.measurements) {
    return null
  }

  const handleDimensionChange = (key, value) => {
    const measurement = modelData.measurements[key]
    const clampedValue = Math.max(measurement.min, Math.min(measurement.max, parseFloat(value)))
    onUpdateDimensions({ [key]: clampedValue })
  }

  return (
    <div className="control-group">
      <label>Model Dimensions</label>
      <div className="dimension-controls">
        {Object.entries(modelData.measurements).map(([key, measurement]) => (
          <div key={key} className="dimension-control">
            <Slider
              label={key.toUpperCase()}
              value={dimensions[key] || measurement.value || measurement.min}
              min={measurement.min}
              max={measurement.max}
              step={CONTROL_LIMITS.DIMENSION_STEP}
              onChange={(value) => handleDimensionChange(key, value)}
              formatValue={(val) => val.toFixed(2)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DimensionControls
