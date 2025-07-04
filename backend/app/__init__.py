from flask import Flask
from flask_cors import CORS
import os

count_statement = 0

def custom_print(*args, **kwargs):
    global count_statement
    print(f"{count_statement} --", *args, **kwargs)
    count_statement += 1

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuration
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
    app.config['UPLOAD_FOLDER'] = 'uploads'
    
    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from .routes import main
    app.register_blueprint(main)
    
    return app 