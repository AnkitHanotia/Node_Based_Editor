import numpy as np
from .base import BaseNode
from app import custom_print

class ContrastStretchingNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.min = params.get('min', 0)
        self.max = params.get('max', 255)

    def process(self, inputs):
        custom_print(f"ContrastStretchingNode params: min={self.min}, max={self.max}\n")
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image'].astype(np.float32)
        # Stretch contrast
        result = (image - self.min) * (255.0 / (self.max - self.min))
        result = np.clip(result, 0, 255).astype(np.uint8)
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 