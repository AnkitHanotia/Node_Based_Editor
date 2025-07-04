import numpy as np
from .base import BaseNode

class OutputNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
    
    def process(self, inputs):
        """Display the final processed image"""
        # Accept either 'image' or 'preview' from inputs
        image = inputs.get('image')
        preview = inputs.get('preview')
        if image is None and preview is not None:
            # If only preview is available, use it for display
            return {
                'image': None,
                'preview': preview,
                'metadata': None
            }
        if image is None:
            return {'image': None, 'preview': None}
        return {
            'image': image,
            'preview': self.image_to_base64(image),
            'metadata': self.get_metadata(image)
        } 