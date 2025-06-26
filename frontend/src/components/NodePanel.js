import React from 'react';
import { getNodeTypes } from '../utils/nodeFactory';

const NodePanel = ({ onAddNode }) => {
  const nodeTypes = getNodeTypes();

  // Group nodes by category
  const nodeCategories = {
    'Input/Output': ['imageInput', 'output'],
    'Adjustments': ['brightnessContrast'],
    'Filters': ['gaussianBlur', 'threshold', 'edgeDetection', 'customKernel'],
    'Effects': ['noise', 'colorChannel']
  };

  const handleNodeClick = (nodeType) => {
    // Calculate position for new node (center of viewport)
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100
    };
    onAddNode(nodeType, position);
  };

  return (
    <div className="node-panel">
      <h3>Nodes</h3>
      
      {Object.entries(nodeCategories).map(([category, nodeKeys]) => (
        <div key={category} className="node-category">
          <h4>{category}</h4>
          {nodeKeys.map(nodeKey => {
            const nodeType = nodeTypes.find(n => n.key === nodeKey);
            if (!nodeType) return null;
            
            return (
              <div
                key={nodeKey}
                className="node-item"
                onClick={() => handleNodeClick(nodeKey)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', JSON.stringify({
                    type: nodeKey,
                    position: { x: 0, y: 0 }
                  }));
                }}
              >
                <div className="node-name">{nodeType.name}</div>
                <div className="node-description">{nodeType.description}</div>
              </div>
            );
          })}
        </div>
      ))}
      
      <div className="node-category">
        <h4>Instructions</h4>
        <div className="node-item" style={{ cursor: 'default' }}>
          <div className="node-name">How to Use</div>
          <div className="node-description">
            1. Click on a node to add it to the canvas<br/>
            2. Connect nodes by dragging from output to input<br/>
            3. Upload an image to an Image Input node<br/>
            4. Adjust parameters in the preview panel<br/>
            5. View results in the Output node
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePanel; 