import numpy as np
from collections import defaultdict, deque
import json
import os
from app import custom_print

NODE_TYPE_MAP = {
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
    'bitPlaneSlicingNode': 'BitPlaneSlicing',
    'bitPlaneSlicing': 'BitPlaneSlicing',
    'histogramEqualizationNode': 'HistogramEqualization',
    'histogramEqualization': 'HistogramEqualization',
    'contrastStretchingNode': 'ContrastStretching',
    'contrastStretching': 'ContrastStretching',
    'logPowerLawNode': 'LogPowerLaw',
    'logPowerLaw': 'LogPowerLaw',
    'imageNegationNode': 'ImageNegation',
    'imageNegation': 'ImageNegation',
    'grayLevelSlicingNode': 'GrayLevelSlicing',
    'grayLevelSlicing': 'GrayLevelSlicing',
    'medianFilterNode': 'MedianFilter',
    'medianFilter': 'MedianFilter',
    'laplacianFilterNode': 'LaplacianFilter',
    'laplacianFilter': 'LaplacianFilter',
    'sobelFilterNode': 'SobelFilter',
    'sobelFilter': 'SobelFilter',
    'fourierTransformNode': 'FourierTransform',
    'fourierTransform': 'FourierTransform',
    'highPassFilterNode': 'HighPassFilter',
    'highPassFilter': 'HighPassFilter',
    'lowPassFilterNode': 'LowPassFilter',
    'lowPassFilter': 'LowPassFilter',
    'resizeBiggerNode': 'ResizeBigger',
    'resizeBigger': 'ResizeBigger',
    'resizeSmallerNode': 'ResizeSmaller',
    'resizeSmaller': 'ResizeSmaller',
    'stretchNode': 'Stretch',
    'stretch': 'Stretch',
    'cropNode': 'Crop',
    'crop': 'Crop',
    'rotateNode': 'Rotate',
    'rotate': 'Rotate',
    'averageFilteringNode': 'AverageFiltering',
    'averageFiltering': 'AverageFiltering',
    'gaussianKernelNode': 'GaussianKernel',
    'gaussianKernel': 'GaussianKernel',
    'weightedFilteringNode': 'WeightedFiltering',
    'weightedFiltering': 'WeightedFiltering',
    'medianFilteringNode': 'MedianFiltering',
    'medianFiltering': 'MedianFiltering',
    'laplacianMaskNode': 'LaplacianMask',
    'laplacianMask': 'LaplacianMask',
    'unsharpMaskingNode': 'UnsharpMasking',
    'unsharpMasking': 'UnsharpMasking',
    'highBoostFilteringNode': 'HighBoostFiltering',
    'highBoostFiltering': 'HighBoostFiltering',
    'convolutionNode': 'Convolution',
    'convolution': 'Convolution',
    'crossCorrelationNode': 'CrossCorrelation',
    'crossCorrelation': 'CrossCorrelation',
    'glcmNode': 'GLCM',
    'glcm': 'GLCM',
}

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
        from .nodes.bit_plane_slicing import BitPlaneSlicingNode
        from .nodes.histogram_equalization import HistogramEqualizationNode
        from .nodes.contrast_stretching import ContrastStretchingNode
        from .nodes.log_power_law import LogPowerLawNode
        from .nodes.image_negation import ImageNegationNode
        from .nodes.gray_level_slicing import GrayLevelSlicingNode
        from .nodes.median_filter import MedianFilterNode
        from .nodes.laplacian_filter import LaplacianFilterNode
        from .nodes.sobel_filter import SobelFilterNode
        from .nodes.fourier_transform import FourierTransformNode
        from .nodes.high_pass_filter import HighPassFilterNode
        from .nodes.low_pass_filter import LowPassFilterNode
        from .nodes.resize_bigger import ResizeBiggerNode
        from .nodes.resize_smaller import ResizeSmallerNode
        from .nodes.stretch import StretchNode
        from .nodes.crop import CropNode
        from .nodes.rotate import RotateNode
        from .nodes.average_filtering import AverageFilteringNode
        from .nodes.gaussian_kernel import GaussianKernelNode
        from .nodes.weighted_filtering import WeightedFilteringNode
        from .nodes.laplacian_mask import LaplacianMaskNode
        from .nodes.unsharp_masking import UnsharpMaskingNode
        from .nodes.high_boost_filtering import HighBoostFilteringNode
        from .nodes.convolution import ConvolutionNode
        from .nodes.cross_correlation import CrossCorrelationNode
        from .nodes.glcm import GLCMNode
        
        self.node_classes = {
            'ImageInput': ImageInputNode,
            'BrightnessContrast': BrightnessContrastNode,
            'GaussianBlur': GaussianBlurNode,
            'Threshold': ThresholdNode,
            'EdgeDetection': EdgeDetectionNode,
            'Noise': NoiseNode,
            'ColorChannel': ColorChannelNode,
            'CustomKernel': CustomKernelNode,
            'Output': OutputNode,
            'BitPlaneSlicing': BitPlaneSlicingNode,
            'HistogramEqualization': HistogramEqualizationNode,
            'ContrastStretching': ContrastStretchingNode,
            'LogPowerLaw': LogPowerLawNode,
            'ImageNegation': ImageNegationNode,
            'GrayLevelSlicing': GrayLevelSlicingNode,
            'MedianFilter': MedianFilterNode,
            'MedianFiltering': MedianFilterNode,
            'LaplacianFilter': LaplacianFilterNode,
            'SobelFilter': SobelFilterNode,
            'FourierTransform': FourierTransformNode,
            'HighPassFilter': HighPassFilterNode,
            'LowPassFilter': LowPassFilterNode,
            'ResizeBigger': ResizeBiggerNode,
            'ResizeSmaller': ResizeSmallerNode,
            'Stretch': StretchNode,
            'Crop': CropNode,
            'Rotate': RotateNode,
            'AverageFiltering': AverageFilteringNode,
            'GaussianKernel': GaussianKernelNode,
            'WeightedFiltering': WeightedFilteringNode,
            'LaplacianMask': LaplacianMaskNode,
            'UnsharpMasking': UnsharpMaskingNode,
            'HighBoostFiltering': HighBoostFilteringNode,
            'Convolution': ConvolutionNode,
            'CrossCorrelation': CrossCorrelationNode,
            'GLCM': GLCMNode,
        }
        
        self.state_file = os.path.join(os.path.dirname(__file__), 'graph_state.json')
        self.load_graph_state_from_disk()
    
    def add_node(self, node_id, node_type, params=None):
        """Add a node to the graph"""
        backend_node_type = NODE_TYPE_MAP.get(node_type, node_type)
        node_class = self.node_classes.get(backend_node_type)
        if node_class is None:
            raise ValueError(f"Unknown node type: {node_type}")
        node_instance = node_class(node_id, params or {})
        self.nodes[node_id] = {
            'id': node_id,
            'type': backend_node_type,
            'params': params or {},
            'position': None,
            'metadata': {}
        }
        self.node_instances[node_id] = node_instance
        self.save_graph_state_to_disk()
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
        self.save_graph_state_to_disk()
    
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
        self.save_graph_state_to_disk()
    
    def remove_connection(self, from_node, from_socket, to_node, to_socket):
        """Remove a connection between nodes"""
        self.connections = [conn for conn in self.connections 
                          if not (conn['from_node'] == from_node and 
                                 conn['from_socket'] == from_socket and
                                 conn['to_node'] == to_node and 
                                 conn['to_socket'] == to_socket)]
        self.save_graph_state_to_disk()
    
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
            custom_print(f"Executing graph with {len(self.nodes)} nodes and {len(self.connections)} connections")
            
            # Get execution order
            execution_order = self.get_topological_order()
            custom_print(f"Execution order: {execution_order}\n")
            
            # Store results for each node
            node_results = {}
            
            # Execute nodes in order
            for node_id in execution_order:
                if node_id not in self.node_instances:
                    custom_print(f"Warning: Node {node_id} not found in instances")
                    continue
                
                node_instance = self.node_instances[node_id]
                custom_print(f"Processing node {node_id} of type {node_instance.__class__.__name__}")
                
                # Gather inputs
                inputs = {}
                node_inputs = self.get_node_inputs(node_id)
                custom_print(f"Node {node_id} inputs: {node_inputs}")
                
                for socket_name, connection in node_inputs.items():
                    from_node = connection['from_node']
                    if from_node in node_results:
                        from_socket = connection['from_socket']
                        if from_socket in node_results[from_node]:
                            inputs[socket_name] = node_results[from_node][from_socket]
                            custom_print(f"  Input {socket_name}: {type(node_results[from_node][from_socket])}")
                        else:
                            custom_print(f"  Warning: Socket {from_socket} not found in {from_node} results")
                    else:
                        custom_print(f"  Warning: Node {from_node} not found in results")
                
                # Process node
                result = node_instance.process(inputs)
                node_results[node_id] = result
                custom_print(f"  Result keys: {list(result.keys()) if result else 'None'}")
                
                # Check if image was produced
                if result and 'image' in result and result['image'] is not None:
                    custom_print(f"  Image shape: {result['image'].shape}")
                else:
                    custom_print(f"  No image in result")
            
            custom_print(f"Final results: {list(node_results.keys())}")
            return node_results
            
        except Exception as e:
            custom_print(f"Error executing graph: {e}")
            import traceback
            traceback.print_exc()
            return {}
    
    def update_node_params(self, node_id, params):
        """Update parameters for a specific node"""
        if node_id in self.node_instances:
            node_instance = self.node_instances[node_id]
            node_instance.params.update(params)
            custom_print(f"Updating node {node_id} with params: {params}")
            
            # Update all possible node attributes based on parameter names
            for param_name, param_value in params.items():
                if hasattr(node_instance, param_name):
                    # Ensure proper type conversion for specific parameters
                    if param_name in ['min', 'max', 'threshold', 'low_threshold', 'high_threshold', 'bit_plane', 'kernel_size']:
                        param_value = int(param_value)
                    elif param_name in ['brightness', 'contrast', 'radius', 'intensity', 'salt_pepper_ratio', 'gamma', 'cutoff', 'boost']:
                        param_value = float(param_value)
                    elif param_name in ['highlight']:
                        param_value = bool(param_value)
                    
                    setattr(node_instance, param_name, param_value)
                    custom_print(f"  Updated {param_name} = {param_value} (type: {type(param_value).__name__})")
                
                # Handle special parameter mappings
                if param_name == 'threshold' and hasattr(node_instance, 'threshold_value'):
                    node_instance.threshold_value = param_value
                    custom_print(f"  Updated threshold_value = {param_value}")
                elif param_name == 'type' and hasattr(node_instance, 'noise_type'):
                    node_instance.noise_type = param_value
                    custom_print(f"  Updated noise_type = {param_value}")
                elif param_name == 'type' and hasattr(node_instance, 'threshold_type'):
                    node_instance.threshold_type = param_value
                    custom_print(f"  Updated threshold_type = {param_value}")
                elif param_name == 'kernel' and hasattr(node_instance, 'kernel'):
                    node_instance.kernel = np.array(param_value)
                    custom_print(f"  Updated kernel = {param_value}")
                elif param_name == 'kernel_size' and hasattr(node_instance, 'kernel_size'):
                    node_instance.kernel_size = param_value
                    custom_print(f"  Updated kernel_size = {param_value}")
                elif param_name == 'cutoff' and hasattr(node_instance, 'cutoff'):
                    node_instance.cutoff = param_value
                    custom_print(f"  Updated cutoff = {param_value}")
                elif param_name == 'boost' and hasattr(node_instance, 'boost'):
                    node_instance.boost = param_value
                    custom_print(f"  Updated boost = {param_value}")
                elif param_name == 'intensity' and hasattr(node_instance, 'intensity'):
                    node_instance.intensity = param_value
                    custom_print(f"  Updated intensity = {param_value}")
                elif param_name == 'salt_pepper_ratio' and hasattr(node_instance, 'salt_pepper_ratio'):
                    node_instance.salt_pepper_ratio = param_value
                    custom_print(f"  Updated salt_pepper_ratio = {param_value}")
                elif param_name == 'bit_plane' and hasattr(node_instance, 'bit_plane'):
                    node_instance.bit_plane = param_value
                    custom_print(f"  Updated bit_plane = {param_value}")
                elif param_name == 'mode' and hasattr(node_instance, 'mode'):
                    node_instance.mode = param_value
                    custom_print(f"  Updated mode = {param_value}")
                elif param_name == 'gamma' and hasattr(node_instance, 'gamma'):
                    node_instance.gamma = param_value
                    custom_print(f"  Updated gamma = {param_value}")
                elif param_name == 'highlight' and hasattr(node_instance, 'highlight'):
                    node_instance.highlight = param_value
                    custom_print(f"  Updated highlight = {param_value}")
                elif param_name == 'low_threshold' and hasattr(node_instance, 'low_threshold'):
                    node_instance.low_threshold = param_value
                    custom_print(f"  Updated low_threshold = {param_value}")
                elif param_name == 'high_threshold' and hasattr(node_instance, 'high_threshold'):
                    node_instance.high_threshold = param_value
                    custom_print(f"  Updated high_threshold = {param_value}")
            
            self.save_graph_state_to_disk()
    
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
        self.save_graph_state_to_disk()
    
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

    def save_graph_state_to_disk(self):
        try:
            state = self.get_graph_state()
            with open(self.state_file, 'w') as f:
                json.dump(state, f)
        except Exception as e:
            custom_print(f"Error saving graph state: {e}")

    def load_graph_state_from_disk(self):
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r') as f:
                    state = json.load(f)
                self.load_graph_state(state)
                custom_print("Graph state loaded from disk.")
        except Exception as e:
            custom_print(f"Error loading graph state: {e}") 