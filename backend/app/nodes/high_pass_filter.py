import numpy as np
import cv2
from .base import BaseNode
from app import custom_print

class HighPassFilterNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.cutoff = params.get('cutoff', 30)
        self.boost = params.get('boost', 1.0)  # 1.0 = normal high-pass, >1.0 = high-boost

    def process(self, inputs):
        custom_print(f"HighPassFilterNode: processing with cutoff={self.cutoff}, boost={self.boost}")
        if 'fft' not in inputs or inputs['fft'] is None:
            # Return a blank image and preview if no input
            blank = np.zeros((64, 64), dtype=np.uint8)
            return {'filtered': blank, 'image': blank, 'preview': self.image_to_base64(blank)}
        fshift = inputs['fft']
        rows, cols = fshift.shape
        crow, ccol = rows // 2, cols // 2
        mask = np.ones((rows, cols), np.uint8)
        cv2.circle(mask, (ccol, crow), int(self.cutoff), 0, -1)
        # Apply mask and inverse FFT
        fshift_filtered = fshift * mask
        f_ishift = np.fft.ifftshift(fshift_filtered)
        img_high = np.fft.ifft2(f_ishift)
        img_high = np.abs(img_high)
        # High-boost: add scaled high-pass to original (if boost > 1)
        if self.boost > 1.0 and 'image' in inputs and inputs['image'] is not None:
            orig = inputs['image']
            if len(orig.shape) == 3:
                orig = cv2.cvtColor(orig, cv2.COLOR_BGR2GRAY)
            img_boost = cv2.addWeighted(orig.astype(np.float32), 1.0, img_high.astype(np.float32), self.boost - 1.0, 0)
            img_boost = cv2.normalize(img_boost, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
            preview = self.image_to_base64(img_boost)
            return {'filtered': img_boost, 'image': img_boost, 'preview': preview}
        else:
            img_high = cv2.normalize(img_high, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
            preview = self.image_to_base64(img_high)
            return {'filtered': img_high, 'image': img_high, 'preview': preview} 