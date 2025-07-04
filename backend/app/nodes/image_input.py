import numpy as np
from PIL import Image
import io
from .base import BaseNode
from app import custom_print

class ImageInputNode(BaseNode):
    def __init__(self, node_id, params=None):
        super().__init__(node_id, params)
        self.image_data = None
        self.metadata = {}
    
    def set_image(self, image_file):
        """Set image from uploaded file"""
        try:
            # Read image using PIL
            image = Image.open(io.BytesIO(image_file.read()))
            
            # Convert to numpy array
            self.image_data = np.array(image)
            
            # Get metadata
            self.metadata = {
                'format': image.format,
                'mode': image.mode,
                'size': image.size,
                'shape': self.image_data.shape,
                'dtype': str(self.image_data.dtype)
            }
            
            return True
        except Exception as e:
            custom_print(f"Error loading image: {e}")
            return False
    
    def process(self, inputs):
        """Return the loaded image and metadata"""
        return {
            'image': self.image_data,
            'metadata': self.metadata,
            'preview': self.image_to_base64(self.image_data) if self.image_data is not None else None
        } 