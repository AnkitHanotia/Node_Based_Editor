import numpy as np
import cv2
from .base import BaseNode

class UnsharpMaskingNode(BaseNode):
    def process(self, inputs):
        image = inputs.get('image')
        amount = float(self.params.get('amount', 1.0))
        if image is None:
            return {'image': None, 'metadata': {}}
        blurred = cv2.GaussianBlur(image, (5, 5), 1.0)
        sharpened = cv2.addWeighted(image, 1 + amount, blurred, -amount, 0)
        sharpened = np.clip(sharpened, 0, 255).astype(np.uint8)
        return {
            'image': sharpened,
            'metadata': self.get_metadata(sharpened)
        } 