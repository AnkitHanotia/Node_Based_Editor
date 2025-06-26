import numpy as np
from .base import BaseNode

class NoiseNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.noise_type = params.get('type', 'gaussian')  # gaussian, salt_pepper, uniform
        self.intensity = params.get('intensity', 0.1)
        self.salt_pepper_ratio = params.get('salt_pepper_ratio', 0.5)
    
    def add_gaussian_noise(self, image):
        """Add Gaussian noise to image"""
        noise = np.random.normal(0, self.intensity * 255, image.shape)
        noisy_image = image.astype(np.float32) + noise
        return np.clip(noisy_image, 0, 255).astype(np.uint8)
    
    def add_salt_pepper_noise(self, image):
        """Add salt and pepper noise to image"""
        noisy_image = image.copy()
        
        # Salt noise
        salt_mask = np.random.random(image.shape) < (self.intensity * self.salt_pepper_ratio)
        noisy_image[salt_mask] = 255
        
        # Pepper noise
        pepper_mask = np.random.random(image.shape) < (self.intensity * (1 - self.salt_pepper_ratio))
        noisy_image[pepper_mask] = 0
        
        return noisy_image
    
    def add_uniform_noise(self, image):
        """Add uniform noise to image"""
        noise = np.random.uniform(-self.intensity * 255, self.intensity * 255, image.shape)
        noisy_image = image.astype(np.float32) + noise
        return np.clip(noisy_image, 0, 255).astype(np.uint8)
    
    def process(self, inputs):
        """Add noise to input image"""
        if 'image' not in inputs or inputs['image'] is None:
            return {'image': None, 'preview': None}
        
        image = inputs['image']
        
        if self.noise_type == 'gaussian':
            result = self.add_gaussian_noise(image)
        elif self.noise_type == 'salt_pepper':
            result = self.add_salt_pepper_noise(image)
        elif self.noise_type == 'uniform':
            result = self.add_uniform_noise(image)
        else:
            result = image
        
        return {
            'image': result,
            'preview': self.image_to_base64(result)
        } 