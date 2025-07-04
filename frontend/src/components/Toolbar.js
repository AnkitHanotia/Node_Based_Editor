import React from 'react';

const Toolbar = ({ onSave, onLoad, onDownload, isProcessing, onAllNodesHover }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h2>Node Image Processor</h2>
        <div
          className="all-nodes-menu-trigger"
          onMouseEnter={onAllNodesHover}
          tabIndex={0}
        >
          <button className="all-nodes-btn simple" type="button">
            All Nodes
          </button>
        </div>
        <div className={`status ${isProcessing ? 'processing' : ''}`}>
          {isProcessing ? 'Processing...' : 'Ready'}
        </div>
      </div>
      <div className="toolbar-right">
        <button onClick={onSave} disabled={isProcessing}>
          Save Graph
        </button>
        <button onClick={onLoad} disabled={isProcessing}>
          Load Graph
        </button>
        <button onClick={onDownload} disabled={isProcessing}>
          Download Image
        </button>
      </div>
    </div>
  );
};

export default Toolbar; 