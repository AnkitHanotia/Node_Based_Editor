import numpy as np
import cv2
from .base import BaseNode
from app import custom_print

class FourierTransformNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)

    def process(self, inputs):
        custom_print("FourierTransformNode: processing FFT")
        if 'image' not in inputs or inputs['image'] is None:
            return {'fft': None, 'preview': None}
        image = inputs['image']
        if len(image.shape) == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        f = np.fft.fft2(image)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1)
        # Normalize for display
        mag_img = cv2.normalize(magnitude_spectrum, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        return {
            'fft': fshift,
            'image': mag_img,
            'preview': self.image_to_base64(mag_img)
        } 