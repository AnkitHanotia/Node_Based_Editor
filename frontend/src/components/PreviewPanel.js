import React, { useState, useEffect } from 'react';

const PreviewPanel = ({ image, selectedNode, onUpdateParams, onFileUpload, uploadedFiles }) => {
  const [uploading, setUploading] = useState(false);
  // Local states for all sliders
  const [blurRadius, setBlurRadius] = useState(null);
  const [brightness, setBrightness] = useState(null);
  const [contrast, setContrast] = useState(null);
  const [threshold, setThreshold] = useState(null);
  const [lowThreshold, setLowThreshold] = useState(null);
  const [highThreshold, setHighThreshold] = useState(null);
  const [intensity, setIntensity] = useState(null);
  const [saltPepperRatio, setSaltPepperRatio] = useState(null);

  useEffect(() => {
    if (!selectedNode) return;
    const params = selectedNode.data?.params || {};
    if (selectedNode.type === 'gaussianBlurNode') setBlurRadius(params.radius ?? 1);
    if (selectedNode.type === 'brightnessContrastNode') {
      setBrightness(params.brightness ?? 0);
      setContrast(params.contrast ?? 1);
    }
    if (selectedNode.type === 'thresholdNode') setThreshold(params.threshold ?? 128);
    if (selectedNode.type === 'edgeDetectionNode') {
      setLowThreshold(params.low_threshold ?? 50);
      setHighThreshold(params.high_threshold ?? 150);
    }
    if (selectedNode.type === 'noiseNode') {
      setIntensity(params.intensity ?? 0.1);
      setSaltPepperRatio(params.salt_pepper_ratio ?? 0.5);
    }
  }, [selectedNode]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedNode) return;
    setUploading(true);
    try {
      await onFileUpload(file, selectedNode.id);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleParamChange = (paramName, value) => {
    if (!selectedNode) return;
    onUpdateParams(selectedNode.id, { [paramName]: value });
  };

  const renderParamControls = () => {
    if (!selectedNode || !selectedNode.data.params) {
      return <div className="no-selection">Select a node to adjust parameters</div>;
    }
    const params = selectedNode.data.params;
    const nodeType = selectedNode.type;
    const uploadedFileName = uploadedFiles[selectedNode.id];
    return (
      <div className="node-params">
        <h4>{selectedNode.data.label} Parameters</h4>
        
        {nodeType === 'imageInputNode' && (
          <div className="param-group">
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading && <div className="loading">Uploading...</div>}
            {uploadedFileName && (
              <div className="file-upload-info">
                <div className="file-name">✓ {uploadedFileName}</div>
                <div className="upload-status">Image uploaded successfully</div>
              </div>
            )}
            {selectedNode.data.metadata && (
              <div className="node-metadata">
                <div>Size: {selectedNode.data.metadata.size}</div>
                <div>Format: {selectedNode.data.metadata.format}</div>
                <div>Shape: {selectedNode.data.metadata.shape}</div>
              </div>
            )}
          </div>
        )}
        
        {nodeType === 'brightnessContrastNode' && (
          <>
            <div className="param-group">
              <label>Brightness: {brightness ?? params.brightness}</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={brightness ?? params.brightness}
                onChange={e => { setBrightness(parseFloat(e.target.value)); handleParamChange('brightness', parseFloat(e.target.value)); }}
              />
              <div className="param-value">{brightness ?? params.brightness}</div>
            </div>
            
            <div className="param-group">
              <label>Contrast: {contrast ?? params.contrast}</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={contrast ?? params.contrast}
                onChange={e => { setContrast(parseFloat(e.target.value)); handleParamChange('contrast', parseFloat(e.target.value)); }}
              />
              <div className="param-value">{contrast ?? params.contrast}</div>
            </div>
          </>
        )}

        {nodeType === 'gaussianBlurNode' && (
          <div className="param-group">
            <label>Radius: {blurRadius ?? params.radius}</label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={blurRadius ?? params.radius}
              onChange={e => { setBlurRadius(parseFloat(e.target.value)); handleParamChange('radius', parseFloat(e.target.value)); }}
            />
            <div className="param-value">{blurRadius ?? params.radius}</div>
          </div>
        )}

        {nodeType === 'thresholdNode' && (
          <div className="param-group">
            <label>Threshold Value: {threshold ?? params.threshold}</label>
            <input
              type="range"
              min="0"
              max="255"
              step="1"
              value={threshold ?? params.threshold}
              onChange={e => { setThreshold(parseInt(e.target.value)); handleParamChange('threshold', parseInt(e.target.value)); }}
            />
            <div className="param-value">{threshold ?? params.threshold}</div>
          </div>
        )}

        {nodeType === 'edgeDetectionNode' && (
          <>
            <div className="param-group">
              <label>Method</label>
              <select
                value={params.method}
                onChange={(e) => handleParamChange('method', e.target.value)}
              >
                <option value="sobel">Sobel</option>
                <option value="canny">Canny</option>
              </select>
            </div>
            
            {params.method === 'canny' && (
              <>
                <div className="param-group">
                  <label>Low Threshold: {lowThreshold ?? params.low_threshold}</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    step="1"
                    value={lowThreshold ?? params.low_threshold}
                    onChange={e => { setLowThreshold(parseInt(e.target.value)); handleParamChange('low_threshold', parseInt(e.target.value)); }}
                  />
                  <div className="param-value">{lowThreshold ?? params.low_threshold}</div>
                </div>
                
                <div className="param-group">
                  <label>High Threshold: {highThreshold ?? params.high_threshold}</label>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    step="1"
                    value={highThreshold ?? params.high_threshold}
                    onChange={e => { setHighThreshold(parseInt(e.target.value)); handleParamChange('high_threshold', parseInt(e.target.value)); }}
                  />
                  <div className="param-value">{highThreshold ?? params.high_threshold}</div>
                </div>
              </>
            )}
          </>
        )}

        {nodeType === 'noiseNode' && (
          <>
            <div className="param-group">
              <label>Noise Type</label>
              <select
                value={params.type}
                onChange={(e) => handleParamChange('type', e.target.value)}
              >
                <option value="gaussian">Gaussian</option>
                <option value="salt_pepper">Salt & Pepper</option>
                <option value="uniform">Uniform</option>
              </select>
            </div>
            
            <div className="param-group">
              <label>Intensity: {intensity ?? params.intensity}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={intensity ?? params.intensity}
                onChange={e => { setIntensity(parseFloat(e.target.value)); handleParamChange('intensity', parseFloat(e.target.value)); }}
              />
              <div className="param-value">{intensity ?? params.intensity}</div>
            </div>
            
            {params.type === 'salt_pepper' && (
              <div className="param-group">
                <label>Salt/Pepper Ratio: {saltPepperRatio ?? params.salt_pepper_ratio}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={saltPepperRatio ?? params.salt_pepper_ratio}
                  onChange={e => { setSaltPepperRatio(parseFloat(e.target.value)); handleParamChange('salt_pepper_ratio', parseFloat(e.target.value)); }}
                />
                <div className="param-value">{saltPepperRatio ?? params.salt_pepper_ratio}</div>
              </div>
            )}
          </>
        )}

        {nodeType === 'colorChannelNode' && (
          <div className="param-group">
            <label>Channel</label>
            <select
              value={params.channel}
              onChange={(e) => handleParamChange('channel', e.target.value)}
            >
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="grayscale">Grayscale</option>
            </select>
          </div>
        )}

        {nodeType === 'outputNode' && (
          <div className="param-group">
            <label>Output Information</label>
            {selectedNode.data.metadata && (
              <div className="node-metadata">
                <div>Shape: {selectedNode.data.metadata.shape}</div>
                <div>Type: {selectedNode.data.metadata.dtype}</div>
                <div>Min: {selectedNode.data.metadata.min_value}</div>
                <div>Max: {selectedNode.data.metadata.max_value}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="preview-panel">
      <h3>Preview</h3>
      
      {image ? (
        <img src={image} alt="Processed" className="preview-image" />
      ) : (
        <div className="no-selection">
          No image to display. Add an Image Input node and upload an image.
        </div>
      )}
      
      {renderParamControls()}
    </div>
  );
};

export default PreviewPanel; 