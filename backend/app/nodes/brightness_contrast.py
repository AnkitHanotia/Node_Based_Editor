import numpy as np
from .base import BaseNode

class BrightnessContrastNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.brightness = params.get('brightness', 0.0)  # -1 to 1
        self.contrast = params.get('contrast', 1.0)      # 0.1 to 3.0
    
    def process(self, inputs):
        """Adjust brightness and contrast of input image"""
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        
        image = inputs['image'].astype(np.float32)
        
        # Normalize to 0-1 range
        if image.max() > 1.0:
            image = image / 255.0
        
        # Apply brightness adjustment
        image = image + self.brightness
        
        # Apply contrast adjustment
        image = (image - 0.5) * self.contrast + 0.5
        
        # Clip to valid range
        image = np.clip(image, 0, 1)
        
        # Convert back to 0-255 range
        image = (image * 255).astype(np.uint8)
        
        return {
            'image': image,
            'preview': self.image_to_base64(image)
        } 