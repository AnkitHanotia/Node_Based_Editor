import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant
} from 'react-flow-renderer';
import NodePanel from './components/NodePanel';
import PreviewPanel from './components/PreviewPanel';
import Toolbar from './components/Toolbar';
import AllNodesMenu from './components/AllNodesMenu';
import { createNode, getNodeConfig } from './utils/nodeFactory';
import { processGraph, addNode as addNodeAPI, addConnection as addConnectionAPI, uploadImage, downloadImage, saveGraph, loadGraph, removeNode, removeConnection } from './utils/api';
import './App.css';
import debounce from 'lodash.debounce';

// Import custom node components
import ImageInputNode from './components/nodes/ImageInputNode';
import BrightnessContrastNode from './components/nodes/BrightnessContrastNode';
import GaussianBlurNode from './components/nodes/GaussianBlurNode';
import ThresholdNode from './components/nodes/ThresholdNode';
import EdgeDetectionNode from './components/nodes/EdgeDetectionNode';
import NoiseNode from './components/nodes/NoiseNode';
import ColorChannelNode from './components/nodes/ColorChannelNode';
import CustomKernelNode from './components/nodes/CustomKernelNode';
import OutputNode from './components/nodes/OutputNode';
import CustomEdge from './components/edges/CustomEdge';
import BitPlaneSlicingNode from './components/nodes/BitPlaneSlicingNode';
import HistogramEqualizationNode from './components/nodes/HistogramEqualizationNode';
import ContrastStretchingNode from './components/nodes/ContrastStretchingNode';
import LogPowerLawNode from './components/nodes/LogPowerLawNode';
import ImageNegationNode from './components/nodes/ImageNegationNode';
import GrayLevelSlicingNode from './components/nodes/GrayLevelSlicingNode';
import MedianFilterNode from './components/nodes/MedianFilterNode';
import LaplacianFilterNode from './components/nodes/LaplacianFilterNode';
import SobelFilterNode from './components/nodes/SobelFilterNode';
import FourierTransformNode from './components/nodes/FourierTransformNode';
import HighPassFilterNode from './components/nodes/HighPassFilterNode';
import LowPassFilterNode from './components/nodes/LowPassFilterNode';
import ResizeBiggerNode from './components/nodes/ResizeBiggerNode';
import ResizeSmallerNode from './components/nodes/ResizeSmallerNode';
import StretchNode from './components/nodes/StretchNode';
import CropNode from './components/nodes/CropNode';
import RotateNode from './components/nodes/RotateNode';
import AverageFilteringNode from './components/nodes/AverageFilteringNode';
import WeightedFilteringNode from './components/nodes/WeightedFilteringNode';
import MedianFilteringNode from './components/nodes/MedianFilteringNode';
import LaplacianMaskNode from './components/nodes/LaplacianMaskNode';
import GaussianKernelNode from './components/nodes/GaussianKernelNode';
import UnsharpMaskingNode from './components/nodes/UnsharpMaskingNode';
import HighBoostFilteringNode from './components/nodes/HighBoostFilteringNode';
import ConvolutionNode from './components/nodes/ConvolutionNode';
import CrossCorrelationNode from './components/nodes/CrossCorrelationNode';
import GLCMNode from './components/nodes/GLCMNode';

// Place these after imports, before App definition
let handleRemoveNodeGlobal = null;
let handleRemoveEdgeGlobal = null;

const nodeTypes = {
  imageInputNode: (props) => <ImageInputNode {...props} onRemove={handleRemoveNodeGlobal} />,
  brightnessContrastNode: (props) => <BrightnessContrastNode {...props} onRemove={handleRemoveNodeGlobal} />,
  gaussianBlurNode: (props) => <GaussianBlurNode {...props} onRemove={handleRemoveNodeGlobal} />,
  thresholdNode: (props) => <ThresholdNode {...props} onRemove={handleRemoveNodeGlobal} />,
  edgeDetectionNode: (props) => <EdgeDetectionNode {...props} onRemove={handleRemoveNodeGlobal} />,
  noiseNode: (props) => <NoiseNode {...props} onRemove={handleRemoveNodeGlobal} />,
  colorChannelNode: (props) => <ColorChannelNode {...props} onRemove={handleRemoveNodeGlobal} />,
  customKernelNode: (props) => <CustomKernelNode {...props} onRemove={handleRemoveNodeGlobal} />,
  outputNode: (props) => <OutputNode {...props} onRemove={handleRemoveNodeGlobal} />,
  bitPlaneSlicingNode: (props) => <BitPlaneSlicingNode {...props} onRemove={handleRemoveNodeGlobal} />,
  histogramEqualizationNode: (props) => <HistogramEqualizationNode {...props} onRemove={handleRemoveNodeGlobal} />,
  contrastStretchingNode: (props) => <ContrastStretchingNode {...props} onRemove={handleRemoveNodeGlobal} />,
  logPowerLawNode: (props) => <LogPowerLawNode {...props} onRemove={handleRemoveNodeGlobal} />,
  imageNegationNode: (props) => <ImageNegationNode {...props} onRemove={handleRemoveNodeGlobal} />,
  grayLevelSlicingNode: (props) => <GrayLevelSlicingNode {...props} onRemove={handleRemoveNodeGlobal} />,
  medianFilterNode: (props) => <MedianFilterNode {...props} onRemove={handleRemoveNodeGlobal} />,
  laplacianFilterNode: (props) => <LaplacianFilterNode {...props} onRemove={handleRemoveNodeGlobal} />,
  sobelFilterNode: (props) => <SobelFilterNode {...props} onRemove={handleRemoveNodeGlobal} />,
  fourierTransformNode: (props) => <FourierTransformNode {...props} onRemove={handleRemoveNodeGlobal} />,
  highPassFilterNode: (props) => <HighPassFilterNode {...props} onRemove={handleRemoveNodeGlobal} />,
  lowPassFilterNode: (props) => <LowPassFilterNode {...props} onRemove={handleRemoveNodeGlobal} />,
  resizeBiggerNode: (props) => <ResizeBiggerNode {...props} onRemove={handleRemoveNodeGlobal} />,
  resizeSmallerNode: (props) => <ResizeSmallerNode {...props} onRemove={handleRemoveNodeGlobal} />,
  stretchNode: (props) => <StretchNode {...props} onRemove={handleRemoveNodeGlobal} />,
  cropNode: (props) => <CropNode {...props} onRemove={handleRemoveNodeGlobal} />,
  rotateNode: (props) => <RotateNode {...props} onRemove={handleRemoveNodeGlobal} />,
  averageFilteringNode: (props) => <AverageFilteringNode {...props} onRemove={handleRemoveNodeGlobal} />,
  weightedFilteringNode: (props) => <WeightedFilteringNode {...props} onRemove={handleRemoveNodeGlobal} />,
  medianFilteringNode: (props) => <MedianFilteringNode {...props} onRemove={handleRemoveNodeGlobal} />,
  laplacianMaskNode: (props) => <LaplacianMaskNode {...props} onRemove={handleRemoveNodeGlobal} />,
  gaussianKernelNode: (props) => <GaussianKernelNode {...props} onRemove={handleRemoveNodeGlobal} />,
  unsharpMaskingNode: (props) => <UnsharpMaskingNode {...props} onRemove={handleRemoveNodeGlobal} />,
  highBoostFilteringNode: (props) => <HighBoostFilteringNode {...props} onRemove={handleRemoveNodeGlobal} />,
  convolutionNode: (props) => <ConvolutionNode {...props} onRemove={handleRemoveNodeGlobal} />,
  crossCorrelationNode: (props) => <CrossCorrelationNode {...props} onRemove={handleRemoveNodeGlobal} />,
  glcmNode: (props) => <GLCMNode {...props} onRemove={handleRemoveNodeGlobal} />,
};

const edgeTypes = {
  custom: (edgeProps) => <CustomEdge {...edgeProps} data={{ onRemove: handleRemoveEdgeGlobal }} />,
};

const App = () => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const fileInputRef = React.useRef();
  const [showAllNodesMenu, setShowAllNodesMenu] = useState(false);
  const latestRequestId = useRef(0);
  const [showNodePanel, setShowNodePanel] = useState(true);

  // Add refs for nodes and edges after useState declarations
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  // Keep refs updated with latest state
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  // Process the entire graph
  const processGraphData = useCallback(async () => {
    console.log('Processing graph...');
    setIsProcessing(true);
    // Increment and capture requestId
    const requestId = ++latestRequestId.current;
    try {
      // Use refs for always-fresh state
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;
      const nodeUpdates = {};
      currentNodes.forEach(node => {
        if (node.data.params) {
          nodeUpdates[node.id] = node.data.params;
        }
      });
      const connections = currentEdges.map(edge => ({
        from_node: edge.source,
        from_socket: edge.sourceHandle,
        to_node: edge.target,
        to_socket: edge.targetHandle
      }));
      console.log('Sending to backend:', { nodeUpdates, connections });
      const response = await processGraph(nodeUpdates, connections);
      console.log('Backend response:', response);
      // Only update UI if this is the latest request
      if (requestId !== latestRequestId.current) {
        console.log('Stale response ignored:', requestId, latestRequestId.current);
        return;
      }
      if (response.success && response.results) {
        // Find output node and set preview
        const outputNode = currentNodes.find(node => node.type === 'outputNode');
        console.log('Output node:', outputNode);
        if (outputNode && response.results[outputNode.id]) {
          const outputResult = response.results[outputNode.id];
          console.log('Output result:', outputResult);
          setPreviewImage(outputResult.preview);
        }
        // Update all nodes with their results
        setNodes((nds) =>
          nds.map((node) => {
            const result = response.results[node.id];
            if (result) {
              return {
                ...node,
                data: {
                  ...node.data,
                  metadata: result.metadata || node.data.metadata,
                  preview: result.preview
                }
              };
            }
            return node;
          })
        );
        // Update selectedNode to latest node data (important for Output Node)
        setSelectedNode((prevSelected) => {
          if (!prevSelected) return null;
          const updatedNode = currentNodes.find(n => n.id === prevSelected.id);
          if (!updatedNode) return null;
          // Merge in latest preview and metadata if available
          const result = response.results[updatedNode.id];
          if (result) {
            return {
              ...updatedNode,
              data: {
                ...updatedNode.data,
                metadata: result.metadata || updatedNode.data.metadata,
                preview: result.preview
              }
            };
          }
          return updatedNode;
        });
      }
    } catch (error) {
      if (requestId !== latestRequestId.current) {
        // Ignore errors from stale requests
        return;
      }
      console.error('Error processing graph:', error);
    } finally {
      if (requestId === latestRequestId.current) {
        setIsProcessing(false);
      }
    }
  }, []); // Remove nodes, edges, setNodes from deps, use refs instead

  // Debounced version to prevent spamming the backend
  const debouncedProcessGraphData = useCallback(
    debounce(() => { processGraphData(); }, 400),
    [processGraphData]
  );

  // Handle edge connections
  const onConnect = useCallback(async (params) => {
    console.log('Connecting nodes:', params);
    // Find the target node
    const targetNode = nodes.find(node => node.id === params.target);
    const sourceNode = nodes.find(node => node.id === params.source);
    if (!targetNode) {
      window.alert('Target node not found.');
      return;
    }
    // Prevent connecting non-FFT to high/low pass filter
    if ((targetNode.type === 'lowPassFilterNode' || targetNode.type === 'highPassFilterNode') && sourceNode && sourceNode.type !== 'fourierTransformNode') {
      window.alert('You must connect a Fourier Transform (FFT) node to this filter.');
      return;
    }
    // Count current input edges for the target node
    const inputEdges = edges.filter(edge => edge.target === params.target);
    // Allow rules:
    // - MergeNode: up to 2 inputs
    // - Others: only 1 input
    const isMergeNode = targetNode.type === 'mergeNode';
    if (!isMergeNode && inputEdges.length >= 1) {
      window.alert('⚠️ Only one input allowed unless this is a Merge node.');
      return;
    }
    if (isMergeNode && inputEdges.length >= 2) {
      window.alert('⚠️ Merge node supports only two inputs.');
      return;
    }
    // If allowed, add the edge
    setEdges((eds) => addEdge(params, eds));
    // Add connection to backend
    try {
      await addConnectionAPI(
        params.source,
        params.sourceHandle,
        params.target,
        params.targetHandle
      );
      // Process graph after adding connection
      debouncedProcessGraphData();
    } catch (error) {
      console.error('Error adding connection to backend:', error);
    }
  }, [setEdges, debouncedProcessGraphData, nodes, edges]);

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    console.log('Selected node:', node);
    setSelectedNode(node);
  }, []);

  // Add a new node to the canvas
  const addNodeToCanvas = useCallback(async (nodeType, position) => {
    const newNode = createNode(nodeType, position);
    console.log('Adding node:', newNode);
    setNodes((nds) => nds.concat(newNode));
    
    // Add node to backend
    try {
      await addNodeAPI(newNode.id, newNode.type, newNode.data.params);
      // Process the graph to update outputs
      debouncedProcessGraphData();
    } catch (error) {
      console.error('Error adding node to backend:', error);
    }
  }, [setNodes, debouncedProcessGraphData]);

  // Update node parameters
  const updateNodeParams = useCallback((nodeId, params) => {
    console.log('Updating params for node:', nodeId, params);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, params: { ...node.data.params, ...params } } }
          : node
      )
    );
  }, [setNodes]);

  // Debounced parameter update handler for all nodes
  const debouncedHandleParamUpdate = useMemo(
    () => debounce((nodeId, params) => {
      setIsProcessing(true);
      updateNodeParams(nodeId, params);
      debouncedProcessGraphData();
    }, 300),
    [updateNodeParams, debouncedProcessGraphData]
  );

  // Handle file upload
  const handleFileUpload = useCallback(async (file, nodeId) => {
    try {
      console.log('Uploading file:', file.name, 'to node:', nodeId);
      setUploadedFiles(prev => ({ ...prev, [nodeId]: file.name }));
      
      const response = await uploadImage(file, nodeId);
      console.log('Upload response:', response);
      
      if (response.success) {
        // Update the node with metadata
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    metadata: response.results[nodeId]?.metadata || {},
                    hasImage: true
                  } 
                }
              : node
          )
        );
        
        // Process the graph to get updated results
        debouncedProcessGraphData();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [setNodes, debouncedProcessGraphData]);

  // Download output image
  const handleDownload = useCallback(async () => {
    // Find the output node
    const outputNode = nodes.find(node => node.type === 'outputNode');
    if (!outputNode) {
      window.alert('No output node found.');
      return;
    }
    try {
      const blob = await downloadImage(outputNode.id);
      // Create a link and trigger download
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.png');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.alert('Failed to download image.');
      console.error('Download error:', error);
    }
  }, [nodes]);

  // Save Graph
  const handleSaveGraph = useCallback(async () => {
    try {
      // Build graph state with positions and metadata
      const graph_state = {
        nodes: Object.fromEntries(nodes.map(node => [node.id, {
          id: node.id,
          type: node.type.replace(/Node$/, ''),
          params: node.data.params,
          position: node.position,
          metadata: node.data.metadata || {}
        }])),
        connections: edges.map(edge => ({
          from_node: edge.source,
          from_socket: edge.sourceHandle,
          to_node: edge.target,
          to_socket: edge.targetHandle
        }))
      };
      const response = await saveGraph(graph_state);
      if (response.success) {
        const dataStr = JSON.stringify(graph_state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'graph.json');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        window.alert('Failed to save graph.');
      }
    } catch (error) {
      window.alert('Failed to save graph.');
      console.error('Save graph error:', error);
    }
  }, [nodes, edges]);

  // Load Graph
  const handleLoadGraph = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      let graphState;
      try {
        graphState = JSON.parse(text);
      } catch (err) {
        window.alert('Invalid file.. please upload the correct json file that supports this app.');
        return;
      }
      // Validate structure
      if (!graphState.nodes || !graphState.connections || typeof graphState.nodes !== 'object' || !Array.isArray(graphState.connections)) {
        window.alert('Invalid file.. please upload the correct json file that supports this app.');
        return;
      }
      // Validate at least one node and each node has required fields
      const nodeList = Object.values(graphState.nodes);
      if (nodeList.length === 0 || nodeList.some(node => !node.id || !node.type)) {
        window.alert('Invalid file.. please upload the correct json file that supports this app.');
        return;
      }
      const response = await loadGraph(graphState);
      if (response.success) {
        // Use nodeFactory config to reconstruct node data for full functionality
        const loadedNodes = nodeList.map(node => {
          let typeKey = node.type.charAt(0).toLowerCase() + node.type.slice(1);
          if (typeKey.endsWith('Node')) typeKey = typeKey.slice(0, -4);
          const config = getNodeConfig(typeKey);
          return {
            id: node.id,
            type: config.type,
            position: node.position || { x: Math.random() * 400, y: Math.random() * 400 },
            data: {
              ...config,
              ...node.params,
              params: { ...config.defaultParams, ...node.params },
              label: config.name,
              description: config.description,
              metadata: node.metadata || {}
            }
          };
        });
        const loadedEdges = (graphState.connections || []).map(conn => ({
          id: `${conn.from_node}-${conn.from_socket}->${conn.to_node}-${conn.to_socket}`,
          source: conn.from_node,
          sourceHandle: conn.from_socket,
          target: conn.to_node,
          targetHandle: conn.to_socket
        }));
        setNodes(loadedNodes);
        setEdges(loadedEdges);
      } else {
        window.alert('Failed to load graph.');
      }
    } catch (error) {
      window.alert('Failed to load graph.');
      console.error('Load graph error:', error);
    }
  };

  // Add removeNode and removeEdge handlers
  const handleRemoveNode = useCallback(async (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    try {
      await removeNode(nodeId);
      debouncedProcessGraphData();
    } catch (error) {
      console.error('Error removing node:', error);
    }
  }, [setNodes, setEdges, debouncedProcessGraphData]);

  const handleRemoveEdge = useCallback(async (edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    const edge = edges.find((e) => e.id === edgeId);
    if (edge) {
      try {
        await removeConnection(edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
        debouncedProcessGraphData();
      } catch (error) {
        console.error('Error removing connection:', error);
      }
    }
  }, [edges, setEdges, debouncedProcessGraphData]);

  // Set the global handler variables so nodeTypes/edgeTypes have access
  handleRemoveNodeGlobal = handleRemoveNode;
  handleRemoveEdgeGlobal = handleRemoveEdge;

  // Add this handler
  const handleSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    if (selectedNodes && selectedNodes.length > 0) {
      setSelectedNode(selectedNodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, []);

  const onNodesChange = useCallback((changes) => {
    let removedNodeIds = [];
    changes.forEach(change => {
      if (change.type === 'remove') {
        removedNodeIds.push(change.id);
      }
    });
    if (removedNodeIds.length > 0) {
      removedNodeIds.forEach(async (nodeId) => {
        await removeNode(nodeId);
      });
      setNodes((nds) => nds.filter((node) => !removedNodeIds.includes(node.id)));
      setEdges((eds) => eds.filter((edge) => !removedNodeIds.includes(edge.source) && !removedNodeIds.includes(edge.target)));
      // Clear selectedNode if it was deleted
      setSelectedNode((sel) => (sel && removedNodeIds.includes(sel.id) ? null : sel));
      debouncedProcessGraphData();
    } else {
      setNodes((nds) => nds.map(node => {
        const change = changes.find(c => c.id === node.id);
        if (change && change.type === 'position') {
          return { ...node, position: change.position || node.position || { x: 100, y: 100 } };
        }
        return { ...node, position: node.position || { x: 100, y: 100 } };
      }));
      // After any change, clear selectedNode if it no longer exists
      setSelectedNode((sel) => (sel && !nodes.find(n => n.id === sel.id) ? null : sel));
    }
  }, [setNodes, setEdges, nodes, debouncedProcessGraphData]);

  const onEdgesChange = useCallback((changes) => {
    let removedEdgeIds = [];
    changes.forEach(change => {
      if (change.type === 'remove') {
        removedEdgeIds.push(change.id);
      }
    });
    if (removedEdgeIds.length > 0) {
      removedEdgeIds.forEach(async (edgeId) => {
        const edge = edges.find(e => e.id === edgeId);
        if (edge) {
          await removeConnection(edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
        }
      });
      setEdges((eds) => eds.filter((edge) => !removedEdgeIds.includes(edge.id)));
      debouncedProcessGraphData();
    }
  }, [edges, setEdges, debouncedProcessGraphData]);

  // Handlers for All Nodes menu
  const handleAllNodesHover = () => setShowAllNodesMenu(true);
  const handleAllNodesLeave = () => setShowAllNodesMenu(false);

  return (
    <div className="app">
      <div className="all-nodes-menu-wrapper" onMouseLeave={handleAllNodesLeave}>
        <Toolbar
          onSave={handleSaveGraph}
          onLoad={handleLoadGraph}
          onDownload={handleDownload}
          isProcessing={isProcessing}
          onAllNodesHover={handleAllNodesHover}
        />
        {showAllNodesMenu && (
          <AllNodesMenu
            onAddNode={addNodeToCanvas}
            onClose={handleAllNodesLeave}
          />
        )}
      </div>
      <input
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={onFileChange}
      />
      
      <div className="main-content" style={{ position: 'relative', height: '100%' }}>
        {showNodePanel ? (
          <NodePanel onAddNode={addNodeToCanvas}>
            <button
              className="node-panel-toggle"
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: '#3b444b', color: '#fff', border: '1px solid #444', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 20, paddingBottom: 3}}
              onClick={() => setShowNodePanel(false)}
              title="Hide Node Panel"
            >
              &laquo;
            </button>
          </NodePanel>
        ) : null}
        
        <div className="canvas-container">
          <ReactFlow
            nodes={nodes}
            edges={edges.map(edge => ({ ...edge, type: 'custom' }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onSelectionChange={handleSelectionChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
        {!showNodePanel && (
          <button
            className="node-panel-toggle-open"
            style={{ position: 'fixed', top: 70, left: 8, zIndex: 20, background: '#3b444b', color: '#fff', border: '1px solid #444', borderRadius: '0 16px 16px 0', width: 32, height: 48, cursor: 'pointer', fontSize: 20 }}
            onClick={() => setShowNodePanel(true)}
            title="Show Node Panel"
          >
            &raquo;
          </button>
        )}
        
        <PreviewPanel 
          image={selectedNode?.data?.preview || previewImage} 
          selectedNode={selectedNode}
          onUpdateParams={debouncedHandleParamUpdate}
          onFileUpload={handleFileUpload}
          uploadedFiles={uploadedFiles}
          nodes={nodes}
          edges={edges}
        />
      </div>
    </div>
  );
};

export default App; 