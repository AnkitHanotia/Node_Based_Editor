import numpy as np
from .base import BaseNode
from app import custom_print

class BitPlaneSlicingNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.bit_plane = params.get('bit_plane', 0)
        self.mode = params.get('mode', 'single')  # 'single' or 'composite'

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = np.dot(image[..., :3], [0.299, 0.587, 0.114]).astype(np.uint8)
        else:
            gray = image
        if self.mode == 'single':
            # Extract a single bit-plane
            result = ((gray >> self.bit_plane) & 1) * 255
        elif self.mode == 'composite':
            # Composite all bit-planes up to and including bit_plane
            result = np.zeros_like(gray)
            for b in range(self.bit_plane + 1):
                result |= ((gray >> b) & 1) << b
            result = (result / result.max() * 255).astype(np.uint8) if result.max() > 0 else result
        else:
            result = gray
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 