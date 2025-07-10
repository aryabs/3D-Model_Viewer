# 3D Model Viewer

A React + Three.js application for viewing 3D models with dynamic texture mapping and image quantization.

## Features

- **Dynamic Model Loading**: Fetches 3D model data from external API
- **Image Upload**: Support for multiple image uploads via drag & drop or file selection
- **Texture Mapping**: Apply uploaded images to model surfaces with scale and translation controls
- **Image Quantization**: Automatically quantizes images to 2 colors for artistic effect
- **Dimension Controls**: Adjust model dimensions within API-defined limits
- **360° Viewing**: Full orbit controls for viewing the model from all angles
- **Responsive Design**: Clean, modern interface with intuitive controls

## Technologies Used

- **React 18**: Component-based UI framework
- **Three.js**: 3D graphics library
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for react-three-fiber
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API requests

## Installation and Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## Usage

### Uploading Images
1. Use the "Upload Images" section in the control panel
2. Drag & drop images or click to select files
3. Images will be automatically quantized to 2 colors
4. Adjust scale and position using the sliders

### Controlling Dimensions
1. Use the "Model Dimensions" section
2. Adjust width, height, and depth within the allowed ranges
3. Values are constrained by the API measurements

### Viewing the Model
1. Use mouse controls in the 3D viewport:
   - **Left click + drag**: Rotate the model
   - **Right click + drag**: Pan the camera
   - **Mouse wheel**: Zoom in/out

## API Integration

The application fetches model data from:
```
https://raw.githubusercontent.com/oneone-studio/interview-assets/refs/heads/main/api.json
```

This API provides:
- Model type and structure information
- Dimension constraints (min/max values)
- Surface configuration data

## Project Structure

```
src/
├── components/
│   ├── Controls.jsx          # UI controls for uploads and dimensions
│   └── ModelViewer.jsx       # 3D model rendering and texture mapping
├── App.jsx                   # Main application component
├── main.jsx                  # React entry point
└── index.css                 # Global styles
```

## Build Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Image Quantization

All uploaded images are automatically processed with a 2-color quantization algorithm that:
1. Converts the image to grayscale
2. Applies a luminance threshold (128)
3. Maps pixels to either black or white
4. Preserves alpha channel for transparency

## Texture Mapping

- Images are applied as textures to the model surfaces
- Multiple images overlay in the order they were uploaded
- Each image can be independently scaled and positioned
- Textures use repeat wrapping for seamless tiling

## Browser Compatibility

- Modern browsers with WebGL support
- Chrome 88+, Firefox 78+, Safari 14+, Edge 88+

## Development

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for demonstration purposes.
