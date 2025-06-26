import React from 'react';

// Helper to get a more dramatic curve
function getCustomBezierPath({ sourceX, sourceY, targetX, targetY }) {
  // Calculate a larger offset for control points for more pronounced curvature
  const curvature = 0.6; // increase for more curve
  const dx = targetX - sourceX;
  const cpx1 = sourceX + dx * curvature;
  const cpy1 = sourceY;
  const cpx2 = targetX - dx * curvature;
  const cpy2 = targetY;
  return `M${sourceX},${sourceY} C${cpx1},${cpy1} ${cpx2},${cpy2} ${targetX},${targetY}`;
}

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style = {}, markerEnd, data }) => {
  // Use custom bezier for more dramatic cable effect
  const edgePath = getCustomBezierPath({ sourceX, sourceY, targetX, targetY });
  const [edgeCenterX, edgeCenterY] = [
    (sourceX + targetX) / 2,
    (sourceY + targetY) / 2
  ];
  return (
    <g>
      <defs>
        {/* Animated gradient for the edge */}
        <linearGradient id={`edge-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f8cff" />
          <stop offset="100%" stopColor="#00e0ff">
            <animate attributeName="offset" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        {/* SVG filter for subtle shadow */}
        <filter id="edgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
        </filter>
      </defs>
      <path
        id={id}
        style={{
          ...style,
          stroke: `url(#edge-gradient-${id})`,
          strokeWidth: 4,
          fill: 'none',
          filter: 'url(#edgeShadow)',
          transition: 'stroke 0.2s',
        }}
        className="react-flow__edge-path custom-smooth-edge"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        x={edgeCenterX - 12}
        y={edgeCenterY - 12}
        width={24}
        height={24}
        style={{ overflow: 'visible' }}
      >
        <button
          className="edge-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (data && data.onRemove) data.onRemove(id);
          }}
          title="Delete edge"
        >
          ×
        </button>
      </foreignObject>
    </g>
  );
};

export default CustomEdge; 