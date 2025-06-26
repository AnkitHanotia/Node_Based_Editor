# Node-Based Image Processing Interface

A web-based node-based image processing interface built with React.js frontend and Flask backend, featuring real-time image processing using NumPy, Pandas, and Matplotlib.

## 🚀 Features

- **Drag-and-Drop Node Interface**: Intuitive visual programming interface using React Flow
- **Real-time Processing**: Live preview updates as you modify parameters
- **Comprehensive Node Library**: 9 different node types for various image processing operations
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

### Node Types

#### Input/Output Nodes
- **Image Input**: Upload and load images, displays metadata
- **Output**: Display final processed image

#### Adjustment Nodes
- **Brightness & Contrast**: Adjust image brightness (-1 to 1) and contrast (0.1 to 3.0)

#### Filter Nodes
- **Gaussian Blur**: Apply Gaussian blur with configurable radius
- **Threshold**: Binary, binary inverse, truncate, to zero operations
- **Edge Detection**: Sobel and Canny edge detection methods
- **Custom Kernel**: Apply custom 3x3 or 5x5 convolution kernels

#### Effect Nodes
- **Noise**: Add Gaussian, salt & pepper, or uniform noise
- **Color Channel**: Extract individual RGB channels or convert to grayscale

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
│   │   └── nodes/               # Node processing modules
│   │       ├── base.py          # Base node class
│   │       ├── image_input.py   # Image input node
│   │       ├── brightness_contrast.py
│   │       ├── gaussian_blur.py
│   │       ├── threshold.py
│   │       ├── edge_detection.py
│   │       ├── noise.py
│   │       ├── color_channels.py
│   │       ├── custom_kernel.py
│   │       └── output.py
│   └── run.py                   # Flask entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── NodePanel.js     # Node selection panel
│   │   │   ├── PreviewPanel.js  # Image preview and parameters
│   │   │   ├── Toolbar.js       # Main toolbar
│   │   │   └── nodes/           # Custom React Flow nodes
│   │   ├── utils/
│   │   │   ├── api.js           # API communication
│   │   │   └── nodeFactory.js   # Node creation utilities
│   │   ├── App.js               # Main application component
│   │   ├── App.css              # Main styles
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   └── package.json
├── requirements.txt             # Python dependencies
└── README.md
```

## 🎨 Customization

### Adding New Nodes

1. **Backend**: Create a new node class in `backend/app/nodes/`
2. **Frontend**: Add node configuration to `frontend/src/utils/nodeFactory.js`
3. **Frontend**: Create custom React component in `frontend/src/components/nodes/`

### Styling

The application uses a dark theme with CSS custom properties. Main styles are in:
- `frontend/src/App.css` - Layout and component styles
- `frontend/src/index.css` - Global styles and React Flow customization

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**: Check if all Python dependencies are installed
2. **Frontend not connecting**: Ensure backend is running on port 5000
3. **Image upload fails**: Check file size (max 16MB) and format
4. **Processing errors**: Check browser console for API errors

### Debug Mode

Enable debug mode by setting `FLASK_ENV=development` before running the backend.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on the GitHub repository. 