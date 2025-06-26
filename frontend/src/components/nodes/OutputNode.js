import React from 'react';
import { Handle } from 'react-flow-renderer';

const OutputNode = ({ data, id, onRemove }) => {
  return (
    <div className="custom-node">
      <div className="node-header">
        <div className="node-title">{data.label}</div>
        <button className="node-delete-btn" onClick={() => onRemove(id)} title="Delete node">×</button>
      </div>
      
      <div className="node-content">
        <div className="node-description">{data.description}</div>
        {data.metadata && (
          <div className="node-metadata">
            <div>Shape: {data.metadata.shape}</div>
            <div>Type: {data.metadata.dtype}</div>
          </div>
        )}
      </div>
      
      <Handle
        type="target"
        position="left"
        id="image"
        style={{ background: '#007bff' }}
      />
    </div>
  );
};

export default OutputNode; 