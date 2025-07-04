import numpy as np
from .base import BaseNode
from app import custom_print

class HistogramEqualizationNode(BaseNode):
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
        # Histogram equalization
        hist, bins = np.histogram(gray.flatten(), 256, [0,256])
        cdf = hist.cumsum()
        cdf_normalized = cdf * 255 / cdf[-1]
        result = np.interp(gray.flatten(), bins[:-1], cdf_normalized).reshape(gray.shape).astype(np.uint8)
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 