# 3D Model Viewer - Interactive Textile Design Platform

A professional React + Three.js application for visualizing 3D models with dynamic texture mapping, image quantization, and real-time customization controls. Built for clothing brands and design visualization.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-green)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 **Project Overview**

This application demonstrates advanced web development skills including:
- **Dynamic 3D Model Loading** from external APIs
- **Real-time Image Processing** with 2-color quantization
- **Interactive Texture Mapping** with precise positioning controls
- **Professional React Architecture** with custom hooks and component composition
- **Error-Resilient Design** with graceful fallbacks

## ✨ **Key Features**

### **🖼️ Dynamic Image Upload & Processing**
- Upload exactly **2 images** with drag-and-drop support
- **Automatic 2-color quantization** for print-ready designs
- **Partial surface coverage** - images don't overwhelm the model
- **Layered overlay system** - images blend in upload order
- **Real-time preview** of quantization effects

### **🎮 Interactive 3D Controls**
- **360° model viewing** with orbit, pan, and zoom
- **Scale controls** (10%-200% coverage) for each image
- **Position controls** for precise texture placement
- **Dimension adjustment** within API-defined constraints
- **Live preview** of all changes

### **⚙️ Technical Excellence**
- **GLB model loading** from external API endpoints
- **Custom shader programming** for texture blending
- **Error boundary implementation** with fallback rendering
- **Performance optimized** texture processing
- **Responsive design** for all screen sizes

## 🚀 **Live Demo & Testing**

### **Quick Test with Sample Images:**


1. **Upload both images** using drag-and-drop
2. **Adjust scales** to see partial surface coverage
3. **Position images** using X/Y sliders
4. **Rotate the 3D model** to view from all angles
5. **Modify dimensions** using the X/Y/Z controls

## 🛠️ **Technology Stack**

### **Frontend Framework**
- **React 18** - Modern component-based architecture
- **Vite** - Lightning-fast build tool and dev server
- **Custom Hooks** - Business logic separation

### **3D Graphics Engine**
- **Three.js** - WebGL-based 3D rendering
- **@react-three/fiber** - React integration for Three.js
- **@react-three/drei** - Utility components (GLTFLoader, OrbitControls)

### **Development Tools**
- **ESLint** - Code quality and consistency
- **Git** - Version control with conventional commits
- **VS Code Tasks** - Streamlined development workflow

## 📁 **Professional Project Structure**

```
src/
├── components/
│   ├── ui/                    # Reusable UI Components
│   │   ├── Button.jsx         # Styled button with variants
│   │   ├── Slider.jsx         # Labeled range input
│   │   └── UploadArea.jsx     # Drag-drop file upload
│   ├── viewer/                # 3D Rendering Components
│   │   ├── ModelViewer.jsx    # Main 3D scene container
│   │   ├── GLBModel.jsx       # GLB loading & texture application
│   │   ├── FallbackBox.jsx    # Backup geometry renderer
│   │   └── ErrorBoundary.jsx  # Error handling wrapper
│   └── controls/              # User Interface Controls
│       ├── Controls.jsx       # Main control panel
│       ├── ImageControls.jsx  # Image manipulation UI
│       └── DimensionControls.jsx # Model dimension UI
├── hooks/                     # Custom React Hooks
│   └── useModelViewer.js      # API, images, dimensions logic
├── services/                  # External API Integration
│   └── modelAPI.js           # API communication layer
├── utils/                     # Utility Functions
│   ├── textureHelpers.js     # Image processing utilities
│   └── constants.js          # Configuration constants
└── styles/                    # Styling
    └── globals.css           # Component and global styles
```

### **Architecture Benefits:**
- ✅ **Separation of Concerns** - UI, logic, and data layers
- ✅ **Reusability** - Components designed for reuse
- ✅ **Maintainability** - Easy to locate and modify features
- ✅ **Scalability** - Simple to add new functionality
- ✅ **Testability** - Components can be tested independently

## 🔧 **Installation & Setup**

### **Prerequisites**
- Node.js 16+ 
- npm or yarn package manager

### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/aryabs/3D-Model_Viewer.git
cd 3D-Model_Viewer

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint code quality checks
```

## 🎨 **Usage Instructions**

### **Basic Workflow:**
1. **Load the application** - The 3D model loads automatically from the API
2. **Upload your first image** - Drag and drop or click to select
3. **Upload your second image** - It will overlay the first image
4. **Adjust scaling** - Use sliders to control coverage (10%-200%)
5. **Position images** - Fine-tune placement with X/Y controls
6. **Resize the model** - Adjust dimensions within API limits
7. **View from all angles** - Use mouse to rotate, zoom, and pan

### **Professional Use Cases:**
- **Fashion Design** - Preview graphics on garments
- **Product Visualization** - Test branding on 3D models  
- **Print Preview** - See how 2-color designs will look
- **Customer Customization** - Let users design their own products

## 🔬 **Technical Implementation Details**

### **Image Quantization Algorithm:**
```javascript
// 2-color quantization for print-ready designs
const luminance = 0.299 * r + 0.587 * g + 0.114 * b
const quantized = luminance > 128 ? 255 : 0  // Black or white
```

### **Texture Blending Shader:**
```glsl
// Custom fragment shader for image overlay
vec4 color1 = texture2D(texture1, vUv);
vec4 color2 = texture2D(texture2, vUv);
vec4 finalColor = mix(color1, color2, opacity2 * color2.a);
```

### **API Integration:**
- **Dynamic GLB Loading** - Models fetched from external endpoints
- **Constraint-Based Controls** - Dimensions limited by API measurements
- **Graceful Fallbacks** - Box geometry if GLB loading fails

## 📊 **Performance & Optimization**

### **Optimization Techniques:**
- **Lazy Loading** - Components load only when needed
- **Texture Caching** - Processed images cached for performance
- **Error Boundaries** - Prevents cascading failures
- **Memory Management** - Proper cleanup of Three.js objects

### **Browser Compatibility:**
- Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- WebGL support required
- ES6+ JavaScript features

## 🧪 **Testing & Quality Assurance**

### **Code Quality Standards:**
- **ESLint Configuration** - Enforces consistent code style
- **Error Handling** - Comprehensive error boundaries
- **Input Validation** - File type and size checking
- **Accessibility** - Keyboard navigation and screen reader support

### **Cross-Browser Testing:**
- Tested on modern browsers
- Responsive design for mobile/tablet
- WebGL compatibility checks

## 🚀 **Deployment**

### **Production Build:**
```bash
npm run build    # Creates optimized production build
npm run preview  # Test production build locally
```

### **Hosting Options:**
- **Vercel** - Automatic deployments from Git
- **Netlify** - Static site hosting with CI/CD
- **GitHub Pages** - Free hosting for public repositories

## 🔄 **Git Workflow & Development Process**

### **Branch Strategy:**
- **`main`** - Production-ready code
- **`dev`** - Development and feature integration

### **Commit Convention:**
```bash
feat: add new feature
fix: bug fixes
docs: documentation updates
style: formatting changes
refactor: code restructuring
test: testing improvements
```

### **Recent Development History:**
```
feat: refactor project structure with improved architecture
feat: enhance image overlay system with partial surface coverage
fix: clean up redundant files and fix import paths
```

## 📚 **Learning Outcomes & Skills Demonstrated**

### **React Expertise:**
- Advanced component composition
- Custom hooks for business logic
- Error boundaries and Suspense
- Performance optimization techniques

### **3D Graphics Programming:**
- Three.js integration and optimization
- Shader programming for custom effects
- 3D model loading and texture mapping
- Camera controls and scene management

### **Professional Development:**
- Clean code architecture
- Git workflow and conventional commits
- Comprehensive documentation
- Error handling and resilience

## 🤝 **Contributing**

This project welcomes contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Three.js Community** - Amazing 3D graphics library
- **React Three Fiber** - Excellent React integration
- **Vite Team** - Fast and efficient build tooling

---

**Built with ❤️ for the web development community**

> "Great software is built with great architecture, attention to detail, and passion for user experience."
