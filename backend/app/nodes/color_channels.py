import numpy as np
from .base import BaseNode

class ColorChannelNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.channel = params.get('channel', 'red')  # red, green, blue, grayscale
    
    def process(self, inputs):
        """Extract color channel from input image"""
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        
        image = inputs['image']
        
        if len(image.shape) == 2:
            # Already grayscale
            result = image
        elif len(image.shape) == 3:
            if self.channel == 'red':
                result = image[:, :, 0]
            elif self.channel == 'green':
                result = image[:, :, 1]
            elif self.channel == 'blue':
                result = image[:, :, 2]
            elif self.channel == 'grayscale':
                # Convert to grayscale
                result = np.dot(image[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)
            else:
                result = image
        else:
            result = image
        
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 