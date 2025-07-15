import React, { useRef } from 'react'
import { UI_MESSAGES } from '../../utils/constants'

const UploadArea = ({ onFileUpload, maxFiles = 2, currentCount = 0 }) => {
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      onFileUpload(files)
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
      onFileUpload(files)
    }
  }

  

  const isDisabled = currentCount >= maxFiles

  return (
    <div 
      className={`upload-area ${isDisabled ? 'disabled' : ''}`}
      onDragOver={!isDisabled ? handleDragOver : undefined}
      onDragLeave={!isDisabled ? handleDragLeave : undefined}
      onDrop={!isDisabled ? handleDrop : undefined}
      onClick={!isDisabled ? () => fileInputRef.current?.click() : undefined}
    >
      <p>
        {isDisabled 
          ? UI_MESSAGES.UPLOAD_LIMIT 
          : `${UI_MESSAGES.UPLOAD_PROMPT} (${currentCount}/${maxFiles})`
        }
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        disabled={isDisabled}
      />
    </div>
  )
}

export default UploadArea
