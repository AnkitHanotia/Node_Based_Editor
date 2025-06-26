import numpy as np
from collections import defaultdict, deque
import json

class GraphEngine:
    def __init__(self):
        self.nodes = {}
        self.connections = []
        self.node_instances = {}
        
        # Import node classes
        from .nodes.image_input import ImageInputNode
        from .nodes.brightness_contrast import BrightnessContrastNode
        from .nodes.gaussian_blur import GaussianBlurNode
        from .nodes.threshold import ThresholdNode
        from .nodes.edge_detection import EdgeDetectionNode
        from .nodes.noise import NoiseNode
        from .nodes.color_channels import ColorChannelNode
        from .nodes.custom_kernel import CustomKernelNode
        from .nodes.output import OutputNode
        
        self.node_classes = {
            'ImageInput': ImageInputNode,
            'BrightnessContrast': BrightnessContrastNode,
            'GaussianBlur': GaussianBlurNode,
            'Threshold': ThresholdNode,
            'EdgeDetection': EdgeDetectionNode,
            'Noise': NoiseNode,
            'ColorChannel': ColorChannelNode,
            'CustomKernel': CustomKernelNode,
            'Output': OutputNode
        }
    
    def add_node(self, node_id, node_type, params=None):
        """Add a node to the graph"""
        # Map frontend node types to backend node types
        node_type_mapping = {
            'imageInputNode': 'ImageInput',
            'imageInput': 'ImageInput',
            'brightnessContrastNode': 'BrightnessContrast',
            'brightnessContrast': 'BrightnessContrast',
            'gaussianBlurNode': 'GaussianBlur',
            'gaussianBlur': 'GaussianBlur',
            'thresholdNode': 'Threshold',
            'threshold': 'Threshold',
            'edgeDetectionNode': 'EdgeDetection',
            'edgeDetection': 'EdgeDetection',
            'noiseNode': 'Noise',
            'noise': 'Noise',
            'colorChannelNode': 'ColorChannel',
            'colorChannel': 'ColorChannel',
            'customKernelNode': 'CustomKernel',
            'customKernel': 'CustomKernel',
            'outputNode': 'Output',
            'output': 'Output',
            'mergeNode': 'Merge',
            'merge': 'Merge'
        }
        backend_node_type = node_type_mapping.get(node_type, node_type)
        if backend_node_type not in self.node_classes:
            raise ValueError(f"Unknown node type: {node_type}")
        node_class = self.node_classes[backend_node_type]
        node_instance = node_class(node_id, params or {})
        self.nodes[node_id] = {
            'id': node_id,
            'type': backend_node_type,
            'params': params or {},
            'position': None,
            'metadata': {}
        }
        self.node_instances[node_id] = node_instance
        return node_instance
    
    def remove_node(self, node_id):
        """Remove a node from the graph"""
        if node_id in self.nodes:
            del self.nodes[node_id]
        
        if node_id in self.node_instances:
            del self.node_instances[node_id]
        
        # Remove connections involving this node
        self.connections = [conn for conn in self.connections 
                          if conn['from_node'] != node_id and conn['to_node'] != node_id]
    
    def add_connection(self, from_node, from_socket, to_node, to_socket):
        """Add a connection between nodes, avoiding duplicates"""
        # Check for cycles
        if self.would_create_cycle(from_node, to_node):
            raise ValueError("Connection would create a cycle")
        connection = {
            'from_node': from_node,
            'from_socket': from_socket,
            'to_node': to_node,
            'to_socket': to_socket
        }
        if connection not in self.connections:
            self.connections.append(connection)
    
    def remove_connection(self, from_node, from_socket, to_node, to_socket):
        """Remove a connection between nodes"""
        self.connections = [conn for conn in self.connections 
                          if not (conn['from_node'] == from_node and 
                                 conn['from_socket'] == from_socket and
                                 conn['to_node'] == to_node and 
                                 conn['to_socket'] == to_socket)]
    
    def would_create_cycle(self, from_node, to_node):
        """Check if adding a connection would create a cycle"""
        # Simple cycle detection using DFS
        visited = set()
        rec_stack = set()
        
        def has_cycle_dfs(node):
            visited.add(node)
            rec_stack.add(node)
            
            # Check all outgoing connections
            for conn in self.connections:
                if conn['from_node'] == node:
                    neighbor = conn['to_node']
                    if neighbor not in visited:
                        if has_cycle_dfs(neighbor):
                            return True
                    elif neighbor in rec_stack:
                        return True
            
            rec_stack.remove(node)
            return False
        
        # Temporarily add the connection
        temp_conn = {
            'from_node': from_node,
            'to_node': to_node
        }
        self.connections.append(temp_conn)
        
        # Check for cycles
        has_cycle = False
        for node in self.nodes:
            if node not in visited:
                if has_cycle_dfs(node):
                    has_cycle = True
                    break
        
        # Remove temporary connection
        self.connections.remove(temp_conn)
        
        return has_cycle
    
    def get_topological_order(self):
        """Get nodes in topological order"""
        # Calculate in-degrees
        in_degree = defaultdict(int)
        for node in self.nodes:
            in_degree[node] = 0
        
        for conn in self.connections:
            in_degree[conn['to_node']] += 1
        
        # Kahn's algorithm
        queue = deque([node for node in self.nodes if in_degree[node] == 0])
        result = []
        
        while queue:
            node = queue.popleft()
            result.append(node)
            
            # Reduce in-degree for neighbors
            for conn in self.connections:
                if conn['from_node'] == node:
                    neighbor = conn['to_node']
                    in_degree[neighbor] -= 1
                    if in_degree[neighbor] == 0:
                        queue.append(neighbor)
        
        return result
    
    def get_node_inputs(self, node_id):
        """Get all inputs for a specific node"""
        inputs = {}
        for conn in self.connections:
            if conn['to_node'] == node_id:
                inputs[conn['to_socket']] = {
                    'from_node': conn['from_node'],
                    'from_socket': conn['from_socket']
                }
        return inputs
    
    def execute_graph(self):
        """Execute the entire graph in topological order"""
        try:
            print(f"Executing graph with {len(self.nodes)} nodes and {len(self.connections)} connections")
            
            # Get execution order
            execution_order = self.get_topological_order()
            print(f"Execution order: {execution_order}")
            
            # Store results for each node
            node_results = {}
            
            # Execute nodes in order
            for node_id in execution_order:
                if node_id not in self.node_instances:
                    print(f"Warning: Node {node_id} not found in instances")
                    continue
                
                node_instance = self.node_instances[node_id]
                print(f"Processing node {node_id} of type {node_instance.__class__.__name__}")
                
                # Gather inputs
                inputs = {}
                node_inputs = self.get_node_inputs(node_id)
                print(f"Node {node_id} inputs: {node_inputs}")
                
                for socket_name, connection in node_inputs.items():
                    from_node = connection['from_node']
                    if from_node in node_results:
                        from_socket = connection['from_socket']
                        if from_socket in node_results[from_node]:
                            inputs[socket_name] = node_results[from_node][from_socket]
                            print(f"  Input {socket_name}: {type(node_results[from_node][from_socket])}")
                        else:
                            print(f"  Warning: Socket {from_socket} not found in {from_node} results")
                    else:
                        print(f"  Warning: Node {from_node} not found in results")
                
                # Process node
                result = node_instance.process(inputs)
                node_results[node_id] = result
                print(f"  Result keys: {list(result.keys()) if result else 'None'}")
                
                # Check if image was produced
                if result and 'image' in result and result['image'] is not None:
                    print(f"  Image shape: {result['image'].shape}")
                else:
                    print(f"  No image in result")
            
            print(f"Final results: {list(node_results.keys())}")
            return node_results
            
        except Exception as e:
            print(f"Error executing graph: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    def update_node_params(self, node_id, params):
        """Update parameters for a specific node"""
        if node_id in self.node_instances:
            node_instance = self.node_instances[node_id]
            node_instance.params.update(params)
            
            # Update specific parameters based on node type
            if hasattr(node_instance, 'brightness') and 'brightness' in params:
                node_instance.brightness = params['brightness']
            if hasattr(node_instance, 'contrast') and 'contrast' in params:
                node_instance.contrast = params['contrast']
            if hasattr(node_instance, 'radius') and 'radius' in params:
                node_instance.radius = params['radius']
            if hasattr(node_instance, 'threshold_value') and 'threshold' in params:
                node_instance.threshold_value = params['threshold']
            if hasattr(node_instance, 'method') and 'method' in params:
                node_instance.method = params['method']
            if hasattr(node_instance, 'noise_type') and 'type' in params:
                node_instance.noise_type = params['type']
            if hasattr(node_instance, 'channel') and 'channel' in params:
                node_instance.channel = params['channel']
            if hasattr(node_instance, 'kernel') and 'kernel' in params:
                node_instance.kernel = np.array(params['kernel'])
    
    def get_graph_state(self):
        """Get the current state of the graph as JSON, including position and metadata"""
        return {
            'nodes': {
                node_id: {
                    'id': node['id'],
                    'type': node['type'],
                    'params': node.get('params', {}),
                    'position': node.get('position', None),
                    'metadata': node.get('metadata', {})
                } for node_id, node in self.nodes.items()
            },
            'connections': self.connections
        }
    
    def load_graph_state(self, state):
        """Load graph state from JSON, clearing previous nodes/connections, and restoring position/metadata"""
        self.nodes = {}
        self.connections = []
        self.node_instances = {}
        # Load new state
        for node_id, node_data in state.get('nodes', {}).items():
            node_type = node_data['type']
            params = node_data.get('params', {})
            position = node_data.get('position', None)
            metadata = node_data.get('metadata', {})
            self.nodes[node_id] = {
                'id': node_id,
                'type': node_type,
                'params': params,
                'position': position,
                'metadata': metadata
            }
            self.add_node(node_id, node_type, params)
        self.connections = state.get('connections', [])
    
    def set_connections(self, connections):
        """Set all connections at once, deduplicating them"""
        unique = []
        seen = set()
        for conn in connections:
            key = (conn['from_node'], conn['from_socket'], conn['to_node'], conn['to_socket'])
            if key not in seen:
                seen.add(key)
                unique.append(conn)
        self.connections = unique 