import React from 'react'

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '' 
}) => {
  const baseClass = 'btn'
  const variantClass = `btn-${variant}`
  const disabledClass = disabled ? 'btn-disabled' : ''
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
