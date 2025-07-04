import React from 'react';
import { Handle } from 'react-flow-renderer';

const GLCMNode = ({ data, id, onRemove }) => {
  return (
    <div className="custom-node">
      <div className="node-header">
        <div className="node-title">{data.label}</div>
        <button className="node-delete-btn" onClick={() => onRemove(id)} title="Delete node">×</button>
      </div>
      <div className="node-content">
        <div className="node-description">{data.description}</div>
        <div className="node-params">
          <div>Distances: {data.params?.distances?.join(', ') || '1'}</div>
          <div>Angles: {data.params?.angles?.join(', ') || '0'}</div>
          <div>Levels: {data.params?.levels || 8}</div>
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
        id="glcm"
        style={{ background: '#007bff' }}
      />
    </div>
  );
};

export default GLCMNode; 