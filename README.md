# Node-Based Image Processing Interface

A web-based node-based image processing interface built with React.js frontend and Flask backend, featuring real-time image processing using NumPy, Pandas, and Matplotlib.

## 🚀 Features

- **Real-time Processing**: Live preview updates as you modify parameters
- **Comprehensive Node Library**: Extensive node types for various image processing operations, organized by category
- **Feature Extraction**: Dedicated category for feature extraction nodes (e.g., GLCM)
- **All Nodes Menu**: Easily browse and add nodes by category using the All Nodes button in the toolbar
- **DAG Execution**: Directed Acyclic Graph ensures proper processing order
- **Modern UI**: Dark theme with responsive design
- **Save/Load**: Persist your node graphs as JSON
- **Download Results**: Export processed images

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based UI framework
- **React Flow** - Node-based interface library
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling with dark theme

### Backend
- **Flask** - Python web framework
- **NumPy** - Numerical computing and array operations
- **Pandas** - Data manipulation and analysis
- **Matplotlib** - Image visualization and conversion
- **Pillow** - Image processing
- **SciPy** - Scientific computing (filters, convolutions)
- **OpenCV** - Computer vision operations

## ⚡ Quick Start

### Option 1: Using the start script (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd python_node_editor

# Install dependencies
pip install -r requirements.txt
cd frontend && npm install && cd ..

# Start both servers
python start.py
```

### Option 2: Manual setup
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r ../requirements.txt
python run.py

# Frontend (new terminal)
cd frontend
npm install
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

5. **Run the Flask server:**
   ```bash
   python run.py
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Open the application** in your browser at `http://localhost:3000`

2. **Add an Image Input node** from the left panel

3. **Upload an image** by clicking on the Image Input node and selecting a file

4. **Add processing nodes** by clicking on them in the left panel:
   - Brightness & Contrast
   - Gaussian Blur
   - Threshold
   - Edge Detection
   - Noise
   - Color Channel
   - Custom Kernel

5. **Connect nodes** by dragging from output sockets (right side) to input sockets (left side)

6. **Adjust parameters** in the right panel when a node is selected

7. **View results** in the Output node and preview panel

### Node Categories and Nodes

#### Input/Output
- **Image Input**: Upload and load images
- **Output**: Display final processed image

#### Adjustments
- **Brightness & Contrast**: Adjust brightness and contrast

#### Filters
- **Gaussian Blur**: Apply Gaussian blur filter
- **Threshold**: Apply thresholding operations
- **Edge Detection**: Detect edges using Sobel or Canny
- **Custom Kernel**: Apply custom convolution kernel
- **Bit-plane Slicing**: Extract or compose bit-planes from image

#### Effects
- **Noise**: Add synthetic noise to image
- **Color Channel**: Extract individual color channels

#### Geometric Transformations
- **Resize (Bigger)**: Resize the image to a larger scale
- **Resize (Smaller)**: Resize the image to a smaller scale
- **Stretch**: Stretch the image width or height
- **Crop**: Crop a region from the image
- **Rotate**: Rotate the image by a given angle

#### Spatial Domain
- **Histogram Equalization**: Enhance image contrast using histogram equalization
- **Contrast Stretching**: Stretch the contrast of the image
- **Log/Power-law Transform**: Apply log or power-law (gamma) transformation
- **Image Negation**: Invert the image (negative)
- **Gray-level Slicing**: Highlight specific gray levels in the image
- **Median Filter**: Apply median filtering
- **Gaussian Blur**: Apply Gaussian blur filter
- **Laplacian Filter**: Apply Laplacian filtering
- **Sobel Filter**: Apply Sobel edge detection

#### Frequency Domain
- **Fourier Transform (FFT)**: Compute the Fast Fourier Transform of the input image
- **High-pass Filtering**: Apply a high-pass filter in the frequency domain
- **Low-pass Filtering**: Apply a low-pass filter in the frequency domain

#### Filtering and Enhancement
- **Average Filtering**: Apply average (mean) filter
- **Gaussian Filtering**: Apply Gaussian filter
- **Weighted Filtering**: Apply weighted filter
- **Median Filtering**: Apply median filter
- **Laplacian Mask**: Apply Laplacian mask
- **Gaussian Kernel**: Apply Gaussian kernel
- **Unsharp Masking**: Apply unsharp masking
- **High-Boost Filtering**: Apply high-boost filtering
- **Low-pass Filtering**: Apply a low-pass filter in the frequency domain
- **High-pass Filtering**: Apply a high-pass filter in the frequency domain
- **Convolution**: Apply convolution with custom kernel
- **Cross-Correlation**: Apply cross-correlation with custom kernel

#### Feature Extraction
- **GLCM**: Compute Gray Level Co-occurrence Matrix

### Keyboard Shortcuts

- **Delete**: Remove selected nodes
- **Ctrl+S**: Save graph
- **Ctrl+O**: Load graph
- **Ctrl+D**: Download processed image

## 🔧 API Endpoints

### Core Operations
- `POST /upload` - Upload image to a specific node
- `POST /process` - Process the entire graph
- `POST /download` - Download processed image

### Graph Management
- `POST /add_node` - Add a new node
- `POST /remove_node` - Remove a node
- `POST /add_connection` - Connect nodes
- `POST /remove_connection` - Disconnect nodes
- `GET /get_graph` - Get current graph state
- `POST /save_graph` - Save graph state
- `POST /load_graph` - Load graph state

### Utility
- `GET /health` - Health check endpoint

## 📁 Project Structure

```
python_node_editor/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app initialization
│   │   ├── routes.py            # API endpoints
│   │   ├── graph_engine.py      # DAG execution engine
│   │   ├── graph_state.json     # Graph state persistence
│   │   └── nodes/               # Node processing modules
│   │       ├── __init__.py
│   │       ├── average_filtering.py
│   │       ├── base.py
│   │       ├── bit_plane_slicing.py
│   │       ├── brightness_contrast.py
│   │       ├── color_channels.py
│   │       ├── contrast_stretching.py
│   │       ├── convolution.py
│   │       ├── crop.py
│   │       ├── cross_correlation.py
│   │       ├── custom_kernel.py
│   │       ├── edge_detection.py
│   │       ├── fourier_transform.py
│   │       ├── gaussian_blur.py
│   │       ├── gaussian_kernel.py
│   │       ├── glcm.py
│   │       ├── gray_level_slicing.py
│   │       ├── high_boost_filtering.py
│   │       ├── high_pass_filter.py
│   │       ├── histogram_equalization.py
│   │       ├── image_input.py
│   │       ├── image_negation.py
│   │       ├── laplacian_filter.py
│   │       ├── laplacian_mask.py
│   │       ├── log_power_law.py
│   │       ├── low_pass_filter.py
│   │       ├── median_filter.py
│   │       ├── noise.py
│   │       ├── output.py
│   │       ├── resize_bigger.py
│   │       ├── resize_smaller.py
│   │       ├── rotate.py
│   │       ├── sobel_filter.py
│   │       ├── stretch.py
│   │       ├── threshold.py
│   │       ├── unsharp_masking.py
│   │       ├── weighted_filtering.py
│   └── run.py                   # Flask entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js               # Main application component
│   │   ├── App.css              # Main styles
│   │   ├── index.js             # React entry point
│   │   ├── index.css            # Global styles
│   │   ├── components/
│   │   │   ├── AllNodesMenu.js  # All nodes mega menu
│   │   │   ├── NodePanel.js     # Node selection panel
│   │   │   ├── PreviewPanel.js  # Image preview and parameters
│   │   │   ├── Toolbar.js       # Main toolbar
│   │   │   └── nodes/           # Custom React Flow nodes
│   │   │       ├── (all node components, e.g. GLCMNode.js, OutputNode.js, MedianFilteringNode.js, etc.)
│   │   ├── utils/
│   │   │   ├── api.js           # API communication
│   │   │   └── nodeFactory.js   # Node creation utilities
│   └── package.json
├── requirements.txt             # Python dependencies
└── README.md
```
