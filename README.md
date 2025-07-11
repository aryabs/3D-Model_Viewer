# 3D Model Viewer with Image Overlay

React + Three.js application for viewing 3D models with dynamic image overlays and dimension controls.

## Features

- Dynamic GLB model loading from API
- Upload up to 2 images with drag-and-drop
- 2-color image quantization (black/white)
- Scalable/translatable image positioning
- 360° model rotation, zoom, pan
- Dynamic dimension controls based on API measurements

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Usage

1. **Upload**: Drag 2 images onto upload area
2. **Position**: Use sliders to scale/translate images
3. **View**: Mouse controls for 3D navigation
4. **Resize**: Dimension sliders adjust model size

## Tech Stack

- React 18 + Vite
- Three.js + React Three Fiber
- Custom hooks for state management
- Modern CSS with responsive design

## API Integration

Fetches model data from:
```
https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/api.json
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── viewer/      # 3D rendering components
│   └── controls/    # User interface controls
├── hooks/           # Custom React hooks
├── services/        # API integration
├── utils/           # Helper functions
└── styles/          # CSS styling
```

## Key Implementation Details

### Image Quantization
Hard-coded 2-color conversion using luminance thresholding:
```javascript
const threshold = 128;
const newColor = brightness > threshold ? [255, 255, 255, 255] : [0, 0, 0, 255];
```

### Texture Blending
- Single image: Direct application
- Multiple images: Custom shader with opacity blending
- Partial coverage: Images cover portions, not entire surface

### Error Handling
- Fallback cube for failed model loads
- Error boundaries for component crashes
- Graceful API error handling


## 💭 Developer Feedback

### Technical Decisions & Challenges

**Architecture Choice:**
- **Modular structure** with custom hooks separates UI from business logic
- **Service layer** centralizes API communication for easier testing/mocking
- **Error boundaries** provide graceful fallbacks when GLB models fail to load

**Key Technical Challenges:**
1. **Image Quantization Performance** - Used canvas-based processing with efficient luminance calculation
2. **Texture Blending** - Custom fragment shader for smooth overlay effects with partial coverage
3. **State Management** - Complex multi-image state with real-time updates handled via normalized data structure
4. **Memory Management** - Proper Three.js object cleanup to prevent memory leaks

**Performance Optimizations:**
- Texture caching prevents redundant quantization operations
- Immutable state patterns reduce unnecessary re-renders
- GPU-accelerated shader materials for real-time texture blending

**What Worked Well:**
- Error boundaries caught edge cases and prevented crashes
- Custom hooks kept components focused and testable
- Conventional commit messages made development tracking clear

**Future Improvements:**
- Add TypeScript for better type safety
- Implement unit tests for core utilities
- Add WebGL compute shaders for faster image processing
- Support undo/redo functionality

**Git Workflow:**
Used conventional commits (`feat:`, `fix:`, `docs:`) with a dev branch strategy for clean version control and easy feature tracking.

## Libraries & Dependencies

### Core Framework
- **React** `^18.2.0` - Modern component-based UI framework
- **Vite** `^5.0.8` - Fast build tool and development server

### 3D Graphics & Rendering
- **Three.js** `^0.158.0` - WebGL-based 3D graphics library
- **@react-three/fiber** `^8.15.11` - React renderer for Three.js
- **@react-three/drei** `^9.88.13` - Utility components for React Three Fiber
  - `useGLTF` - GLB/GLTF model loader
  - `OrbitControls` - Camera controls for 3D navigation

### Key Features Enabled by Libraries
- **GLB Model Loading**: `@react-three/drei` useGLTF hook
- **3D Scene Management**: React Three Fiber declarative 3D
- **Camera Controls**: Built-in OrbitControls from drei
- **Shader Programming**: Native Three.js shader materials
- **Image Processing**: HTML5 Canvas API for quantization
- **File Upload**: Native HTML5 File API with drag-and-drop
- **Responsive Design**: CSS Grid and Flexbox
