import React from 'react';
import { Handle } from 'react-flow-renderer';

const EdgeDetectionNode = ({ data, id, onRemove }) => {
  return (
    <div className="custom-node">
      <div className="node-header">
        <div className="node-title">{data.label}</div>
        <button className="node-delete-btn" onClick={() => onRemove(id)} title="Delete node">×</button>
      </div>
      
      <div className="node-content">
        <div className="node-description">{data.description}</div>
        <div className="node-params">
          <div>Method: {data.params?.method || 'sobel'}</div>
          {data.params?.method === 'canny' && (
            <>
              <div>Low: {data.params?.low_threshold || 50}</div>
              <div>High: {data.params?.high_threshold || 150}</div>
            </>
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

export default EdgeDetectionNode; 