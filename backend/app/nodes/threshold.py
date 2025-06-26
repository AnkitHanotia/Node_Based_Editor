import numpy as np
from .base import BaseNode

class ThresholdNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.threshold_value = params.get('threshold', 128)
        self.threshold_type = params.get('type', 'binary')  # binary, binary_inv, trunc, tozero, tozero_inv
    
    def process(self, inputs):
        """Apply thresholding to input image"""
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        
        image = inputs['image']
        
        # Convert to grayscale if color
        if len(image.shape) == 3:
            # Simple RGB to grayscale conversion
            gray = np.dot(image[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)
        else:
            gray = image
        
        # Apply thresholding
        if self.threshold_type == 'binary':
            result = (gray > self.threshold_value).astype(np.uint8) * 255
        elif self.threshold_type == 'binary_inv':
            result = (gray <= self.threshold_value).astype(np.uint8) * 255
        elif self.threshold_type == 'trunc':
            result = np.where(gray > self.threshold_value, self.threshold_value, gray)
        elif self.threshold_type == 'tozero':
            result = np.where(gray > self.threshold_value, gray, 0)
        elif self.threshold_type == 'tozero_inv':
            result = np.where(gray <= self.threshold_value, gray, 0)
        else:
            result = gray
        
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 