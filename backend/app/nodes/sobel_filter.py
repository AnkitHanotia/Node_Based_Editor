import numpy as np
from scipy.ndimage import sobel
from .base import BaseNode
from app import custom_print

class SobelFilterNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        if len(image.shape) == 3:
            gray = np.dot(image[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)
        else:
            gray = image
        sx = sobel(gray, axis=0, mode='reflect')
        sy = sobel(gray, axis=1, mode='reflect')
        result = np.hypot(sx, sy)
        result = np.clip(result / result.max() * 255, 0, 255).astype(np.uint8)
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 