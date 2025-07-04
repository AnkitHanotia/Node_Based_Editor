import numpy as np
from skimage.feature import graycomatrix
from .base import BaseNode

class GLCMNode(BaseNode):
    def process(self, inputs):
        image = inputs.get('image')
        distances = self.params.get('distances', [1])
        angles_deg = self.params.get('angles', [0])
        levels = int(self.params.get('levels', 8))
        if image is None:
            return {'glcm': None, 'metadata': {}}
        # Convert to grayscale if needed
        if image.ndim == 3:
            image = np.mean(image, axis=2).astype(np.uint8)
        # Quantize image to the specified number of levels
        image = np.floor(image / (256 / levels)).astype(np.uint8)
        # Convert angles from degrees to radians
        angles = [np.deg2rad(a) for a in angles_deg]
        glcm = graycomatrix(image, distances=distances, angles=angles, levels=levels, symmetric=True, normed=True)
        # For preview, show the sum of all GLCMs as an image
        glcm_sum = np.sum(glcm, axis=(2,3))
        glcm_img = (255 * (glcm_sum / glcm_sum.max())).astype(np.uint8)
        return {
            'glcm': glcm,
            'image': glcm_img,
            'preview': self.image_to_base64(glcm_img),
            'metadata': {'shape': glcm.shape, 'levels': levels, 'distances': distances, 'angles': angles_deg}
        } 