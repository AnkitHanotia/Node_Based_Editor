import numpy as np
from .base import BaseNode
from app import custom_print

class ImageNegationNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        result = 255 - image
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 