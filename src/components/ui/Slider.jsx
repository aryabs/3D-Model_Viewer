import React from 'react'

const Slider = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  formatValue = (val) => val.toFixed(2),
  className = '' 
}) => {
  return (
    <div className={`slider-control ${className}`}>
      <label>{label}: {formatValue(value)}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <small>{min} - {max}</small>
    </div>
  )
}

export default Slider
