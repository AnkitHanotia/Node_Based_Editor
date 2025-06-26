import numpy as np
from scipy.ndimage import gaussian_filter
from .base import BaseNode

class GaussianBlurNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.radius = params.get('radius', 1.0)
    
    def process(self, inputs):
        """Apply Gaussian blur to input image"""
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        
        image = inputs['image']
        
        # Apply Gaussian blur
        if len(image.shape) == 3:
            # Color image - blur each channel
            blurred = np.zeros_like(image)
            for i in range(image.shape[2]):
                blurred[:, :, i] = gaussian_filter(image[:, :, i], sigma=self.radius)
        else:
            # Grayscale image
            blurred = gaussian_filter(image, sigma=self.radius)
        
        return {
            'image': blurred.astype(np.uint8),
            'preview': self.image_to_base64(blurred.astype(np.uint8))
        } 