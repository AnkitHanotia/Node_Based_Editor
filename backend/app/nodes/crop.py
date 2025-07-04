import numpy as np
from .base import BaseNode
from PIL import Image

class CropNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.x = params.get('x', 0)
        self.y = params.get('y', 0)
        self.width = params.get('width', 100)
        self.height = params.get('height', 100)

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        pil_image = Image.fromarray(image)
        x = max(0, self.x)
        y = max(0, self.y)
        w = max(1, self.width)
        h = max(1, self.height)
        x2 = min(pil_image.width, x + w)
        y2 = min(pil_image.height, y + h)
        cropped = pil_image.crop((x, y, x2, y2))
        out_img = np.array(cropped)
        return {
            'image': out_img,
            'preview': self.image_to_base64(out_img)
        } 