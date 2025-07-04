import React from 'react';
import { getNodeTypes } from '../utils/nodeFactory';

// Define categories (should match NodePanel)
const nodeCategories = {
  'Input/Output': ['imageInput', 'output'],
  'Adjustments': ['brightnessContrast'],
  'Filters': ['gaussianBlur', 'threshold', 'edgeDetection', 'customKernel', 'bitPlaneSlicing'],
  'Effects': ['noise', 'colorChannel'],
  'Geometric Transformations': [
    'resizeBigger',
    'resizeSmaller',
    'stretch',
    'crop',
    'rotate'
  ],
  'Spatial Domain': [
    'histogramEqualization',
    'contrastStretching',
    'logPowerLaw',
    'imageNegation',
    'grayLevelSlicing',
    'medianFilter',
    'gaussianBlur',
    'laplacianFilter',
    'sobelFilter'
  ],
  'Frequency Domain': [
    'fourierTransform',
    'highPassFilter',
    'lowPassFilter'
  ],
  'Filtering and Enhancement': [
    'averageFiltering',
    'gaussianFiltering',
    'weightedFiltering',
    'medianFiltering',
    'laplacianMask',
    'gaussianKernel',
    'unsharpMasking',
    'highBoostFiltering',
    'lowPassFilter',
    'highPassFilter',
    'convolution',
    'crossCorrelation'
  ],
  'Feature Extraction': [
    'glcm'
  ],
};

const AllNodesMenu = ({ onAddNode, onClose }) => {
  const nodeTypes = getNodeTypes();

  const handleNodeClick = (nodeType) => {
    // Centered position (or random)
    const position = { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 };
    onAddNode(nodeType, position);
    onClose();
  };

  return (
    <div
      className="all-nodes-mega-menu"
      onMouseLeave={onClose}
      onMouseEnter={e => e.stopPropagation()}
    >
      <div className="all-nodes-mega-menu-inner">
        {Object.entries(nodeCategories).map(([category, nodeKeys]) => (
          <div className="all-nodes-mega-col" key={category}>
            <div className="all-nodes-mega-cat">{category}</div>
            {nodeKeys.map(nodeKey => {
              const nodeType = nodeTypes.find(n => n.key === nodeKey);
              if (!nodeType) return null;
              return (
                <div
                  className="all-nodes-mega-item"
                  key={nodeKey}
                  onClick={() => handleNodeClick(nodeKey)}
                >
                  <div className="all-nodes-mega-name">{nodeType.name}</div>
                  <div className="all-nodes-mega-desc">{nodeType.description}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllNodesMenu; 