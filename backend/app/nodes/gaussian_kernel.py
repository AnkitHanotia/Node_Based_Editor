import numpy as np
import cv2
from .base import BaseNode

class GaussianKernelNode(BaseNode):
    def process(self, inputs):
        image = inputs.get('image')
        kernel_size = int(self.params.get('kernel_size', 3))
        sigma = float(self.params.get('sigma', 1.0))
        if image is None:
            return {'image': None, 'metadata': {}}
        # Ensure kernel size is odd and >= 3
        if kernel_size < 3:
            kernel_size = 3
        if kernel_size % 2 == 0:
            kernel_size += 1
        filtered = cv2.GaussianBlur(image, (kernel_size, kernel_size), sigma)
        return {
            'image': filtered,
            'metadata': self.get_metadata(filtered)
        } 