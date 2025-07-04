import { v4 as uuidv4 } from 'uuid';

// Node type definitions
const nodeTypes = {
  imageInput: {
    name: 'Image Input',
    description: 'Upload and load images',
    type: 'imageInputNode',
    inputs: [],
    outputs: ['image'],
    defaultParams: {}
  },
  brightnessContrast: {
    name: 'Brightness & Contrast',
    description: 'Adjust brightness and contrast',
    type: 'brightnessContrastNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {
      brightness: 0.0,
      contrast: 1.0
    }
  },
  gaussianBlur: {
    name: 'Gaussian Blur',
    description: 'Apply Gaussian blur filter',
    type: 'gaussianBlurNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {
      radius: 1.0
    }
  },
  threshold: {
    name: 'Threshold',
    description: 'Apply thresholding operations',
    type: 'thresholdNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {
      threshold: 128,
      type: 'binary'
    }
  },
  edgeDetection: {
    name: 'Edge Detection',
    description: 'Detect edges using Sobel or Canny',
    type: 'edgeDetectionNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {
      method: 'sobel',
      low_threshold: 50,
      high_threshold: 150
    }
  },
  noise: {
    name: 'Noise',
    description: 'Add synthetic noise to image',
    type: 'noiseNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {
      type: 'gaussian',
      intensity: 0.1,
      salt_pepper_ratio: 0.5
    }
  },
  colorChannel: {
    name: 'Color Channel',
    description: 'Extract individual color channels',
    type: 'colorChannelNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {
      channel: 'red'
    }
  },
  customKernel: {
    name: 'Custom Kernel',
    description: 'Apply custom convolution kernel',
    type: 'customKernelNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {
      kernel: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
      kernel_size: 3
    }
  },
  output: {
    name: 'Output',
    description: 'Display final processed image',
    type: 'outputNode',
    inputs: ['image'],
    outputs: [],
    defaultParams: {}
  },
  bitPlaneSlicing: {
    name: 'Bit-plane Slicing',
    description: 'Extract or compose bit-planes from image',
    type: 'bitPlaneSlicingNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {
      bit_plane: 0,
      mode: 'single' // 'single' or 'composite'
    }
  },
  histogramEqualization: {
    name: 'Histogram Equalization',
    description: 'Enhance image contrast using histogram equalization',
    type: 'histogramEqualizationNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {}
  },
  contrastStretching: {
    name: 'Contrast Stretching',
    description: 'Stretch the contrast of the image',
    type: 'contrastStretchingNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { min: 0, max: 255 }
  },
  logPowerLaw: {
    name: 'Log/Power-law Transform',
    description: 'Apply log or power-law (gamma) transformation',
    type: 'logPowerLawNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { mode: 'log', gamma: 1.0 }
  },
  imageNegation: {
    name: 'Image Negation',
    description: 'Invert the image (negative)',
    type: 'imageNegationNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: {}
  },
  grayLevelSlicing: {
    name: 'Gray-level Slicing',
    description: 'Highlight specific gray levels in the image',
    type: 'grayLevelSlicingNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { min: 100, max: 200, highlight: true }
  },
  medianFilter: {
    name: 'Median Filter',
    description: 'Apply median filtering',
    type: 'medianFilterNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { kernel_size: 3 }
  },
  laplacianFilter: {
    name: 'Laplacian Filter',
    description: 'Apply Laplacian filtering',
    type: 'laplacianFilterNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { }
  },
  sobelFilter: {
    name: 'Sobel Filter',
    description: 'Apply Sobel edge detection',
    type: 'sobelFilterNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { }
  },
  fourierTransform: {
    name: 'Fourier Transform (FFT)',
    description: 'Compute the Fast Fourier Transform of the input image.',
    type: 'fourierTransformNode',
    inputs: ['image'],
    outputs: ['fft'],
    defaultParams: {}
  },
  highPassFilter: {
    name: 'High-pass Filtering',
    description: 'Apply a high-pass filter in the frequency domain.',
    type: 'highPassFilterNode',
    inputs: ['fft'],
    outputs: ['filtered'],
    defaultParams: { cutoff: 30 }
  },
  lowPassFilter: {
    name: 'Low-pass Filtering',
    description: 'Apply a low-pass filter in the frequency domain.',
    type: 'lowPassFilterNode',
    inputs: ['fft'],
    outputs: ['filtered'],
    defaultParams: { cutoff: 30 }
  },
  resizeBigger: {
    name: 'Resize (Bigger)',
    description: 'Resize the image to a larger scale',
    type: 'resizeBiggerNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { scale: 2.0 }
  },
  resizeSmaller: {
    name: 'Resize (Smaller)',
    description: 'Resize the image to a smaller scale',
    type: 'resizeSmallerNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { scale: 0.5 }
  },
  stretch: {
    name: 'Stretch',
    description: 'Stretch the image width or height',
    type: 'stretchNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { width_scale: 2.0, height_scale: 1.0 }
  },
  crop: {
    name: 'Crop',
    description: 'Crop a region from the image',
    type: 'cropNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { x: 0, y: 0, width: 100, height: 100 }
  },
  rotate: {
    name: 'Rotate',
    description: 'Rotate the image by a given angle',
    type: 'rotateNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { angle: 90 }
  },
  averageFiltering: {
    name: 'Average Filtering',
    description: 'Apply average (mean) filter',
    type: 'averageFilteringNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { kernel_size: 3 }
  },
  gaussianFiltering: {
    name: 'Gaussian Filtering',
    description: 'Apply Gaussian filter',
    type: 'gaussianBlurNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { radius: 1.0 }
  },
  weightedFiltering: {
    name: 'Weighted Filtering',
    description: 'Apply weighted filter',
    type: 'weightedFilteringNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { kernel: [[1,2,1],[2,4,2],[1,2,1]] }
  },
  medianFiltering: {
    name: 'Median Filtering',
    description: 'Apply median filter',
    type: 'medianFilteringNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { kernel_size: 3 }
  },
  laplacianMask: {
    name: 'Laplacian Mask',
    description: 'Apply Laplacian mask',
    type: 'laplacianMaskNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { kernel: [[0,1,0],[1,-4,1],[0,1,0]] }
  },
  gaussianKernel: {
    name: 'Gaussian Kernel',
    description: 'Apply Gaussian kernel',
    type: 'gaussianKernelNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { kernel_size: 3 }
  },
  unsharpMasking: {
    name: 'Unsharp Masking',
    description: 'Apply unsharp masking',
    type: 'unsharpMaskingNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { amount: 1.0, radius: 1.0 }
  },
  highBoostFiltering: {
    name: 'High-Boost Filtering',
    description: 'Apply high-boost filtering',
    type: 'highBoostFilteringNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { boost_factor: 1.5 }
  },
  convolution: {
    name: 'Convolution',
    description: 'Apply convolution with custom kernel',
    type: 'convolutionNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { kernel: [[1,0,-1],[1,0,-1],[1,0,-1]] }
  },
  crossCorrelation: {
    name: 'Cross-Correlation',
    description: 'Apply cross-correlation with custom kernel',
    type: 'crossCorrelationNode',
    inputs: ['image'],
    outputs: ['image'],
    defaultParams: { kernel: [[1,0,1],[0,1,0],[1,0,1]] }
  },
  glcm: {
    name: 'GLCM',
    description: 'Compute Gray Level Co-occurrence Matrix',
    type: 'glcmNode',
    inputs: ['image'],
    outputs: ['glcm'],
    defaultParams: { distances: [1], angles: [0], levels: 8 }
  }
};

export const createNode = (nodeType, position = { x: 0, y: 0 }) => {
  const nodeConfig = nodeTypes[nodeType];
  if (!nodeConfig) {
    throw new Error(`Unknown node type: ${nodeType}`);
  }

  const nodeId = `${nodeType}_${uuidv4()}`;
  
  // Create handles for inputs and outputs
  const handles = [];
  
  // Add input handles
  nodeConfig.inputs.forEach((input, index) => {
    handles.push({
      id: input,
      type: 'target',
      position: 'left',
      style: { top: `${20 + index * 30}%` }
    });
  });
  
  // Add output handles
  nodeConfig.outputs.forEach((output, index) => {
    handles.push({
      id: output,
      type: 'source',
      position: 'right',
      style: { top: `${20 + index * 30}%` }
    });
  });

  return {
    id: nodeId,
    type: nodeConfig.type,
    position,
    data: {
      label: nodeConfig.name,
      description: nodeConfig.description,
      params: { ...nodeConfig.defaultParams },
      inputs: nodeConfig.inputs,
      outputs: nodeConfig.outputs
    },
    style: {
      background: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '150px',
      color: '#ffffff'
    }
  };
};

export const getNodeTypes = () => {
  return Object.keys(nodeTypes).map(key => ({
    key,
    ...nodeTypes[key]
  }));
};

export const getNodeConfig = (nodeType) => {
  return nodeTypes[nodeType];
};

// If there is a mapping like: export const nodeTypeToComponent = { ... }, add:
// bitPlaneSlicingNode: BitPlaneSlicingNode,
// ... existing code ... 