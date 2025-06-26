import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import io
import base64
from abc import ABC, abstractmethod

class BaseNode(ABC):
    def __init__(self, node_id, params=None):
        self.node_id = node_id
        self.params = params or {}
        self.inputs = {}
        self.outputs = {}
    
    @abstractmethod
    def process(self, inputs):
        """Process inputs and return outputs"""
        pass
    
    def validate_inputs(self, inputs):
        """Validate input data"""
        return True
    
    def image_to_base64(self, image):
        """Convert numpy array to base64 string using PIL, not matplotlib"""
        if image is None:
            print("Warning: image_to_base64 called with None image")
            return None
        try:
            print(f"Converting image to base64, shape: {image.shape}, dtype: {image.dtype}")
            from PIL import Image
            import io, base64
            # Ensure image is uint8
            if image.dtype != np.uint8:
                if image.dtype in [np.float32, np.float64]:
                    image = (image * 255).astype(np.uint8)
                else:
                    image = image.astype(np.uint8)
            # Convert to PIL Image
            if len(image.shape) == 2:
                pil_image = Image.fromarray(image, mode='L')
            else:
                pil_image = Image.fromarray(image)
            buffer = io.BytesIO()
            pil_image.save(buffer, format='PNG')
            buffer.seek(0)
            img_str = base64.b64encode(buffer.getvalue()).decode()
            result = f"data:image/png;base64,{img_str}"
            print(f"Base64 conversion successful, length: {len(result)}")
            return result
        except Exception as e:
            print(f"Error converting image to base64: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def get_metadata(self, image):
        """Get image metadata"""
        if image is None:
            return {}
        
        return {
            'shape': image.shape,
            'dtype': str(image.dtype),
            'min_value': float(np.min(image)),
            'max_value': float(np.max(image)),
            'mean': float(np.mean(image))
        } 