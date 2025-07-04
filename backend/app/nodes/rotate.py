import numpy as np
from .base import BaseNode
from PIL import Image

class RotateNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.angle = params.get('angle', 90)

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        pil_image = Image.fromarray(image)
        rotated = pil_image.rotate(self.angle, expand=True)
        out_img = np.array(rotated)
        return {
            'image': out_img,
            'preview': self.image_to_base64(out_img)
        } 