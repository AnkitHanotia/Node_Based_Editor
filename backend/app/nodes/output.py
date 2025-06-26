import numpy as np
from .base import BaseNode

class OutputNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
    
    def process(self, inputs):
        """Display the final processed image"""
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        
        image = inputs['image']
        
        return {
            'image': image,
            'preview': self.image_to_base64(image),
            'metadata': self.get_metadata(image)
        } 