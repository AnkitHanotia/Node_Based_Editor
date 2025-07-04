import numpy as np
from .base import BaseNode
from app import custom_print

class GrayLevelSlicingNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.min = int(params.get('min', 100))
        self.max = int(params.get('max', 200))
        self.highlight = bool(params.get('highlight', True))

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        if len(image.shape) == 3:
            gray = np.dot(image[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)
        else:
            gray = image
        result = np.zeros_like(gray)
        mask = (gray >= self.min) & (gray <= self.max)
        custom_print(f"GrayLevelSlicingNode: min={self.min}, max={self.max}, highlight={self.highlight}")
        custom_print(f"GrayLevelSlicingNode: gray range [{gray.min()}, {gray.max()}], mask sum={mask.sum()}")
        if self.highlight:
            # Highlight mode: set pixels in range to 255, others to 0
            result[mask] = 255
        else:
            # Non-highlight mode: set pixels in range to 255, others keep original value
            result[mask] = 255
            result[~mask] = gray[~mask]
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 