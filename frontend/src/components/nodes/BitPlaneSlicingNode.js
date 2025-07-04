import React from 'react';
import { Handle } from 'react-flow-renderer';

const BitPlaneSlicingNode = ({ data, id, onRemove }) => {
  return (
    <div className="custom-node">
      <div className="node-header">
        <div className="node-title">{data.label}</div>
        <button className="node-delete-btn" onClick={() => onRemove(id)} title="Delete node">×</button>
      </div>
      <div className="node-content">
        <div className="node-description">{data.description}</div>
        <div className="node-params">
          <div>Bit-plane: {data.params?.bit_plane ?? 0}</div>
          <div>Mode: {data.params?.mode ?? 'single'}</div>
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

export default BitPlaneSlicingNode; 