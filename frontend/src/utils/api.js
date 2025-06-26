import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const uploadImage = async (file, nodeId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('node_id', nodeId);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const processGraph = async (nodeUpdates, connections) => {
  const response = await api.post('/process', {
    node_updates: nodeUpdates,
    connections: connections
  });
  return response.data;
};

export const addNode = async (nodeId, nodeType, params = {}) => {
  const response = await api.post('/add_node', {
    node_id: nodeId,
    node_type: nodeType,
    params: params
  });
  return response.data;
};

export const removeNode = async (nodeId) => {
  const response = await api.post('/remove_node', {
    node_id: nodeId
  });
  return response.data;
};

export const addConnection = async (fromNode, fromSocket, toNode, toSocket) => {
  const response = await api.post('/add_connection', {
    from_node: fromNode,
    from_socket: fromSocket,
    to_node: toNode,
    to_socket: toSocket
  });
  return response.data;
};

export const removeConnection = async (fromNode, fromSocket, toNode, toSocket) => {
  const response = await api.post('/remove_connection', {
    from_node: fromNode,
    from_socket: fromSocket,
    to_node: toNode,
    to_socket: toSocket
  });
  return response.data;
};

export const getGraph = async () => {
  const response = await api.get('/get_graph');
  return response.data;
};

export const saveGraph = async (graphState) => {
  if (graphState) {
    const response = await api.post('/save_graph', graphState);
    return response.data;
  } else {
    const response = await api.post('/save_graph');
    return response.data;
  }
};

export const loadGraph = async (graphState) => {
  const response = await api.post('/load_graph', {
    graph_state: graphState
  });
  return response.data;
};

export const downloadImage = async (nodeId) => {
  const response = await api.post('/download', {
    node_id: nodeId
  }, {
    responseType: 'blob'
  });
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api; 