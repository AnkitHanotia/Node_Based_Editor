import numpy as np
from .base import BaseNode
from PIL import Image

class ResizeSmallerNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.scale = params.get('scale', 0.5)

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        pil_image = Image.fromarray(image)
        new_size = (max(1, int(pil_image.width * self.scale)), max(1, int(pil_image.height * self.scale)))
        resized = pil_image.resize(new_size, Image.BICUBIC)
        out_img = np.array(resized)
        return {
            'image': out_img,
            'preview': self.image_to_base64(out_img)
        } 