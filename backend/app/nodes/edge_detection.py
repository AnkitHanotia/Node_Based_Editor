import numpy as np
from scipy.ndimage import sobel
from .base import BaseNode

class EdgeDetectionNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.method = params.get('method', 'sobel')  # sobel, canny
        self.low_threshold = params.get('low_threshold', 50)
        self.high_threshold = params.get('high_threshold', 150)
    
    def sobel_edge_detection(self, image):
        """Apply Sobel edge detection"""
        if len(image.shape) == 3:
            # Convert to grayscale
            gray = np.dot(image[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)
        else:
            gray = image
        
        # Apply Sobel filters
        sobel_x = sobel(gray, axis=1)
        sobel_y = sobel(gray, axis=0)
        
        # Calculate magnitude
        magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
        
        # Normalize to 0-255
        magnitude = (magnitude / magnitude.max() * 255).astype(np.uint8)
        
        return magnitude
    
    def canny_edge_detection(self, image):
        """Apply Canny edge detection"""
        if len(image.shape) == 3:
            # Convert to grayscale
            gray = np.dot(image[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)
        else:
            gray = image
        
        # Apply Gaussian blur
        from scipy.ndimage import gaussian_filter
        blurred = gaussian_filter(gray, sigma=1)
        
        # Apply Sobel filters
        sobel_x = sobel(blurred, axis=1)
        sobel_y = sobel(blurred, axis=0)
        
        # Calculate magnitude and direction
        magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
        direction = np.arctan2(sobel_y, sobel_x)
        
        # Non-maximum suppression (simplified)
        # This is a simplified version - full Canny would be more complex
        result = np.zeros_like(magnitude)
        
        # Apply thresholds
        strong_edges = magnitude > self.high_threshold
        weak_edges = (magnitude >= self.low_threshold) & (magnitude <= self.high_threshold)
        
        result[strong_edges] = 255
        result[weak_edges] = 128
        
        return result.astype(np.uint8)
    
    def process(self, inputs):
        """Apply edge detection to input image"""
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        
        image = inputs['image']
        
        if self.method == 'sobel':
            result = self.sobel_edge_detection(image)
        elif self.method == 'canny':
            result = self.canny_edge_detection(image)
        else:
            result = image
        
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 