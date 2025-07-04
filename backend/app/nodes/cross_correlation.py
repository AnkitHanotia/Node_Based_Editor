import numpy as np
import cv2
from .base import BaseNode

class CrossCorrelationNode(BaseNode):
    def process(self, inputs):
        image = inputs.get('image')
        kernel_size = int(self.params.get('kernel_size', 3))
        if image is None:
            return {'image': None, 'metadata': {}}
        # Ensure kernel size is odd and >= 3
        if kernel_size < 3:
            kernel_size = 3
        if kernel_size % 2 == 0:
            kernel_size += 1
        kernel = np.ones((kernel_size, kernel_size), dtype=np.float32)
        kernel /= kernel.sum()
        filtered = cv2.filter2D(image, -1, kernel, borderType=cv2.BORDER_DEFAULT)
        return {
            'image': filtered,
            'metadata': self.get_metadata(filtered)
        } 