import numpy as np
from .base import BaseNode
from PIL import Image

class StretchNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.width_scale = params.get('width_scale', 2.0)
        self.height_scale = params.get('height_scale', 1.0)

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        pil_image = Image.fromarray(image)
        new_size = (int(pil_image.width * self.width_scale), int(pil_image.height * self.height_scale))
        stretched = pil_image.resize(new_size, Image.BICUBIC)
        out_img = np.array(stretched)
        return {
            'image': out_img,
            'preview': self.image_to_base64(out_img)
        } 