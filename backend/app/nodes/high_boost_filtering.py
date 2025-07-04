import numpy as np
import cv2
from .base import BaseNode

class HighBoostFilteringNode(BaseNode):
    def process(self, inputs):
        image = inputs.get('image')
        factor = float(self.params.get('factor', 1.5))
        if image is None:
            return {'image': None, 'metadata': {}}
        blurred = cv2.GaussianBlur(image, (5, 5), 1.0)
        mask = cv2.subtract(image, blurred)
        high_boost = cv2.add(image, cv2.multiply(mask, factor))
        high_boost = np.clip(high_boost, 0, 255).astype(np.uint8)
        return {
            'image': high_boost,
            'metadata': self.get_metadata(high_boost)
        } 