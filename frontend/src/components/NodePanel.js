import React, { useState } from 'react';
import { getNodeTypes } from '../utils/nodeFactory';

const NodePanel = ({ onAddNode, children }) => {
  const nodeTypes = getNodeTypes();
  const [search, setSearch] = useState('');
  const [openCategory, setOpenCategory] = useState(null);

  // Group nodes by category
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

  const handleNodeClick = (nodeType) => {
    // Calculate position for new node (center of viewport)
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100
    };
    onAddNode(nodeType, position);
  };

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
    setSearch(''); // Reset search when switching category
  };

  // Filter nodes by search
  const filterNode = (nodeType) => {
    if (!search) return true;
    return (
      nodeType.name.toLowerCase().includes(search.toLowerCase()) ||
      nodeType.description.toLowerCase().includes(search.toLowerCase())
    );
  };

  // If searching, show all matching nodes from all categories
  const isSearching = search.trim().length > 0;
  let searchResults = [];
  if (isSearching) {
    searchResults = Object.entries(nodeCategories).flatMap(([category, nodeKeys]) =>
      nodeKeys
        .map(nodeKey => nodeTypes.find(n => n.key === nodeKey))
        .filter(nodeType => nodeType && filterNode(nodeType))
        .map(nodeType => ({ ...nodeType, category }))
    );
  }

  return (
    <div className="node-panel custom-node-panel">
      <div className="node-panel-header" style={{ position: 'relative' }}>
        <h3>Nodes</h3>
        <input
          type="text"
          className="node-search"
          placeholder="Search nodes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {children}
      </div>
      <div className="node-panel-categories">
        {isSearching ? (
          <div className="node-grid">
            {searchResults.length === 0 && (
              <div style={{ color: '#aaa', padding: '8px 0' }}>No nodes found.</div>
            )}
            {searchResults.map(nodeType => (
              <div
                key={nodeType.key}
                className="node-item node-grid-item"
                onClick={() => handleNodeClick(nodeType.key)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', JSON.stringify({
                    type: nodeType.key,
                    position: { x: 0, y: 0 }
                  }));
                }}
              >
                <div className="node-name">{nodeType.name}</div>
                <div className="node-description">{nodeType.description}</div>
                <div className="node-category-label" style={{ fontSize: '11px', color: '#e6005c', marginTop: '2px' }}>{nodeType.category}</div>
              </div>
            ))}
          </div>
        ) : (
          Object.entries(nodeCategories).map(([category, nodeKeys]) => (
            <div key={category} className="node-category-accordion">
              <div
                className="node-category-header"
                onClick={() => handleCategoryClick(category)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <span className="category-arrow">{openCategory === category ? '▼' : '▶'}</span>
                <span>{category}</span>
              </div>
              {openCategory === category && (
                <div className="node-grid">
                  {nodeKeys
                    .map(nodeKey => nodeTypes.find(n => n.key === nodeKey))
                    .map(nodeType => (
                      <div
                        key={nodeType.key}
                        className="node-item node-grid-item"
                        onClick={() => handleNodeClick(nodeType.key)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/reactflow', JSON.stringify({
                            type: nodeType.key,
                            position: { x: 0, y: 0 }
                          }));
                        }}
                      >
                        <div className="node-name">{nodeType.name}</div>
                        <div className="node-description">{nodeType.description}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))
        )}
        {!isSearching && !openCategory && (
          <div style={{ color: '#aaa', padding: '16px 0', textAlign: 'center' }}>
            Select a category to see nodes.
          </div>
        )}
      </div>
      <div className="node-category node-instructions">
        <h4>Instructions</h4>
        <div className="node-item" style={{ cursor: 'default' }}>
          <div className="node-name">How to Use</div>
          <div className="node-description">
            1. Click on a node to add it to the canvas<br />
            2. Connect nodes by dragging from output to input<br />
            3. Upload an image to an Image Input node<br />
            4. Adjust parameters in the preview panel<br />
            5. View results in the Output node
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePanel; 