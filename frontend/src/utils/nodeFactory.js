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