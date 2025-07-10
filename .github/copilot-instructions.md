<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 3D Model Viewer Project Instructions

This is a React + Three.js application for viewing 3D models with texture mapping capabilities.

## Project Structure
- Uses React 18 with Vite as the build tool
- Three.js integration via @react-three/fiber and @react-three/drei
- Dynamic model loading from external API
- Image upload with quantization and texture mapping
- Dimension controls based on API measurements

## Key Features
- Fetches model data from external API endpoint
- Supports multiple image uploads with drag & drop
- Implements 2-color quantization for uploaded images
- Provides scale and translation controls for textures
- Allows dimension adjustments within API-defined limits
- Full 3D navigation with orbit controls

## Development Notes
- All textures are quantized to 2 colors (hard-coded requirement)
- Images overlay in upload order
- Dimension controls are bounded by API measurements
- Cross-origin image loading handled with proper CORS settings
