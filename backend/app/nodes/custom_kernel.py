import numpy as np
from scipy.ndimage import convolve
from .base import BaseNode

class CustomKernelNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.kernel = params.get('kernel', np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]]))
        self.kernel_size = params.get('kernel_size', 3)
    
    def process(self, inputs):
        """Apply custom convolution kernel to input image"""
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        
        image = inputs['image']
        
        # Ensure kernel is the right size
        if self.kernel.shape[0] != self.kernel_size or self.kernel.shape[1] != self.kernel_size:
            # Create a default kernel if size doesn't match
            self.kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
        
        # Apply convolution
        if len(image.shape) == 3:
            # Color image - apply to each channel
            result = np.zeros_like(image)
            for i in range(image.shape[2]):
                result[:, :, i] = convolve(image[:, :, i], self.kernel, mode='reflect')
        else:
            # Grayscale image
            result = convolve(image, self.kernel, mode='reflect')
        
        # Clip to valid range
        result = np.clip(result, 0, 255).astype(np.uint8)
        
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 