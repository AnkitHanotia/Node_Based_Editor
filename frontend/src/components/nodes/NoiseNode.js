import React from 'react';
import { Handle } from 'react-flow-renderer';

const NoiseNode = ({ data, id, onRemove }) => {
  return (
    <div className="custom-node">
      <div className="node-header">
        <div className="node-title">{data.label}</div>
        <button className="node-delete-btn" onClick={() => onRemove(id)} title="Delete node">×</button>
      </div>
      
      <div className="node-content">
        <div className="node-description">{data.description}</div>
        <div className="node-params">
          <div>Type: {data.params?.type || 'gaussian'}</div>
          <div>Intensity: {data.params?.intensity || 0.1}</div>
          {data.params?.type === 'salt_pepper' && (
            <div>Ratio: {data.params?.salt_pepper_ratio || 0.5}</div>
          )}
        </div>
      </div>
      
      <Handle
        type="target"
        position="left"
        id="image"
        style={{ background: '#007bff' }}
      />
      
      <Handle
        type="source"
        position="right"
        id="image"
        style={{ background: '#007bff' }}
      />
    </div>
  );
};

export default NoiseNode; 