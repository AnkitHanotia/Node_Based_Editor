from flask import Blueprint, request, jsonify, send_file
import os
import io
import base64
from werkzeug.utils import secure_filename
from .graph_engine import GraphEngine
from PIL import Image
import numpy as np
import json
import traceback
from app import custom_print

main = Blueprint('main', __name__)

# Global graph engine instance
graph_engine = GraphEngine()

def serialize_results(results):
    """Serialize graph execution results to JSON-safe format"""
    serialized = {}
    for node_id, node_result in results.items():
        serialized[node_id] = {}
        for key, value in node_result.items():
            if isinstance(value, np.ndarray):
                # Convert numpy array to base64
                try:
                    # Ensure it's uint8 for image data
                    if value.dtype != np.uint8:
                        if value.dtype in [np.float32, np.float64]:
                            value = (value * 255).astype(np.uint8)
                        else:
                            value = value.astype(np.uint8)
                    
                    # Convert to PIL Image and then to base64
                    if len(value.shape) == 3:
                        pil_image = Image.fromarray(value)
                    else:
                        pil_image = Image.fromarray(value, mode='L')
                    
                    buffer = io.BytesIO()
                    pil_image.save(buffer, format='PNG')
                    buffer.seek(0)
                    base64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
                    serialized[node_id][key] = f"data:image/png;base64,{base64_str}"
                except Exception as e:
                    custom_print(f"Error serializing numpy array for {node_id}.{key}: {e}")
                    serialized[node_id][key] = None
            elif isinstance(value, dict):
                # Recursively serialize nested dictionaries
                serialized[node_id][key] = serialize_results({key: value})[key]
            else:
                # For other types, try to serialize directly
                try:
                    # Test if it's JSON serializable
                    json.dumps(value)
                    serialized[node_id][key] = value
                except (TypeError, ValueError):
                    # If not serializable, convert to string
                    serialized[node_id][key] = str(value)
    return serialized

@main.route('/upload', methods=['POST'])
def upload_image():
    """Upload an image file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Get node ID from request
        node_id = request.form.get('node_id')
        if not node_id:
            return jsonify({'error': 'No node_id provided'}), 400
        
        custom_print(f"Uploading image to node: {node_id}\n")
        
        # Check if node exists
        if node_id not in graph_engine.node_instances:
            return jsonify({'error': 'Node not found'}), 404
        
        node_instance = graph_engine.node_instances[node_id]
        
        # Update min/max params if present in form
        min_val = request.form.get('min')
        max_val = request.form.get('max')
        params = {}
        if min_val is not None:
            params['min'] = int(min_val)
        if max_val is not None:
            params['max'] = int(max_val)
        if params:
            graph_engine.update_node_params(node_id, params)
        
        # Set image in the node
        if hasattr(node_instance, 'set_image'):
            success = node_instance.set_image(file)
            if success:
                custom_print(f"Image uploaded successfully to {node_id}")
                # Execute graph to get updated results
                results = graph_engine.execute_graph()
                return jsonify({
                    'success': True,
                    'results': serialize_results(results),
                    'message': 'Image uploaded successfully'
                })
            else:
                return jsonify({'error': 'Failed to load image'}), 400
        else:
            return jsonify({'error': 'Node does not support image input'}), 400
            
    except Exception as e:
        custom_print(f"Error in upload: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@main.route('/process', methods=['POST'])
def process_graph():
    """Process the entire graph and return results"""
    try:
        data = request.get_json() or {}
        custom_print(f"Processing graph with data: {data}")
        
        # Update node parameters if provided
        if 'node_updates' in data:
            for node_id, params in data['node_updates'].items():
                custom_print(f"Updating node {node_id} with params: {params}")
                graph_engine.update_node_params(node_id, params)
        
        # Add connections if provided
        if 'connections' in data:
            graph_engine.set_connections(data['connections'])
        
        # Execute graph
        custom_print("Executing graph...")
        results = graph_engine.execute_graph()
        custom_print(f"Graph execution results: {list(results.keys())}")
        
        # Check if output node has results
        output_nodes = [node_id for node_id, node_data in graph_engine.nodes.items() 
                       if node_data['type'] == 'Output']
        custom_print(f"Output nodes: {output_nodes}")
        
        for output_node in output_nodes:
            if output_node in results:
                output_result = results[output_node]
                custom_print(f"Output node {output_node} result: {list(output_result.keys())}")
                if 'preview' in output_result:
                    custom_print(f"Output node {output_node} has preview: {output_result['preview'][:100] if output_result['preview'] else 'None'}...")
        
        return jsonify({
            'success': True,
            'results': serialize_results(results)
        })
        
    except Exception as e:
        custom_print(f"Error in process: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@main.route('/add_node', methods=['POST'])
def add_node():
    """Add a new node to the graph"""
    try:
        data = request.get_json()
        node_id = data.get('node_id')
        node_type = data.get('node_type')
        params = data.get('params', {})
        
        custom_print(f"Adding node: {node_id} of type {node_type}")
        
        if not node_id or not node_type:
            return jsonify({'error': 'Missing node_id or node_type'}), 400
        
        # Add node
        node_instance = graph_engine.add_node(node_id, node_type, params)
        
        return jsonify({
            'success': True,
            'node_id': node_id,
            'node_type': node_type
        })
        
    except Exception as e:
        custom_print(f"Error adding node: {e}")
        return jsonify({'error': str(e)}), 500

@main.route('/remove_node', methods=['POST'])
def remove_node():
    """Remove a node from the graph"""
    try:
        data = request.get_json()
        node_id = data.get('node_id')
        
        if not node_id:
            return jsonify({'error': 'Missing node_id'}), 400
        
        # Remove node
        graph_engine.remove_node(node_id)
        
        return jsonify({
            'success': True,
            'node_id': node_id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/add_connection', methods=['POST'])
def add_connection():
    """Add a connection between nodes"""
    try:
        data = request.get_json()
        from_node = data.get('from_node')
        from_socket = data.get('from_socket')
        to_node = data.get('to_node')
        to_socket = data.get('to_socket')
        
        custom_print(f"Adding connection: {from_node}:{from_socket} -> {to_node}:{to_socket}")
        
        if not all([from_node, from_socket, to_node, to_socket]):
            return jsonify({'error': 'Missing connection parameters'}), 400
        
        # Add connection
        graph_engine.add_connection(from_node, from_socket, to_node, to_socket)
        
        return jsonify({
            'success': True,
            'connection': {
                'from_node': from_node,
                'from_socket': from_socket,
                'to_node': to_node,
                'to_socket': to_socket
            }
        })
        
    except Exception as e:
        custom_print(f"Error adding connection: {e}")
        return jsonify({'error': str(e)}), 500

@main.route('/remove_connection', methods=['POST'])
def remove_connection():
    """Remove a connection between nodes"""
    try:
        data = request.get_json()
        from_node = data.get('from_node')
        from_socket = data.get('from_socket')
        to_node = data.get('to_node')
        to_socket = data.get('to_socket')
        
        if not all([from_node, from_socket, to_node, to_socket]):
            return jsonify({'error': 'Missing connection parameters'}), 400
        
        # Remove connection
        graph_engine.remove_connection(from_node, from_socket, to_node, to_socket)
        
        return jsonify({
            'success': True,
            'connection': {
                'from_node': from_node,
                'from_socket': from_socket,
                'to_node': to_node,
                'to_socket': to_socket
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/get_graph', methods=['GET'])
def get_graph():
    """Get the current graph state"""
    try:
        state = graph_engine.get_graph_state()
        return jsonify({
            'success': True,
            'graph': state
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/save_graph', methods=['POST'])
def save_graph():
    """Save the current graph state or a provided graph state"""
    try:
        data = request.get_json(silent=True)
        if data and 'nodes' in data and 'connections' in data:
            # If frontend sends a graph state, return it
            state = data
        else:
            # Otherwise, return the backend's current state
            state = graph_engine.get_graph_state()
        return jsonify({
            'success': True,
            'graph_state': state
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/load_graph', methods=['POST'])
def load_graph():
    """Load a graph state"""
    try:
        data = request.get_json()
        state = data.get('graph_state', {})
        graph_engine.load_graph_state(state)
        return jsonify({
            'success': True,
            'message': 'Graph loaded successfully'
        })
    except Exception as e:
        custom_print('Exception in /load_graph:', e)
        custom_print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@main.route('/download', methods=['POST'])
def download_image():
    """Download the final processed image"""
    try:
        data = request.get_json()
        node_id = data.get('node_id')
        
        if not node_id:
            return jsonify({'error': 'Missing node_id'}), 400
        
        # Execute graph to get latest results
        results = graph_engine.execute_graph()
        
        if node_id not in results:
            return jsonify({'error': 'Node not found in results'}), 404
        
        node_result = results[node_id]
        if 'image' not in node_result or node_result['image'] is None:
            return jsonify({'error': 'No image available'}), 404
        
        image = node_result['image']
        
        # Convert numpy array to PIL Image
        if len(image.shape) == 2:
            # Grayscale
            pil_image = Image.fromarray(image, mode='L')
        else:
            # Color
            pil_image = Image.fromarray(image)
        
        # Save to buffer
        buffer = io.BytesIO()
        pil_image.save(buffer, format='PNG')
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='image/png',
            as_attachment=True,
            download_name='processed_image.png'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Node-based image processing API is running'
    }) 