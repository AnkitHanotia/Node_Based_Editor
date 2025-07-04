import numpy as np
from scipy.ndimage import median_filter
from .base import BaseNode
from app import custom_print

class MedianFilterNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.kernel_size = params.get('kernel_size', 3)

    def process(self, inputs):
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        image = inputs['image']
        if len(image.shape) == 3:
            result = np.zeros_like(image)
            for i in range(image.shape[2]):
                result[:, :, i] = median_filter(image[:, :, i], size=self.kernel_size)
        else:
            result = median_filter(image, size=self.kernel_size)
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 