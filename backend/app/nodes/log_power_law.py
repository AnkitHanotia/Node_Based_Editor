import numpy as np
from .base import BaseNode
from app import custom_print

class LogPowerLawNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.mode = params.get('mode', 'log')
        self.gamma = params.get('gamma', 1.0)

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image'].astype(np.float32)
        image = image / 255.0
        if self.mode == 'log':
            c = 1.0
            result = c * np.log1p(image)
        else:
            c = 1.0
            result = c * np.power(image, self.gamma)
        result = np.clip(result / result.max(), 0, 1)
        result = (result * 255).astype(np.uint8)
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 