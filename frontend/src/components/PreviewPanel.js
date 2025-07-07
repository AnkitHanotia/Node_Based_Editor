import React, { useState, useEffect } from 'react';

const PreviewPanel = ({ image, selectedNode, onUpdateParams, onFileUpload, uploadedFiles, nodes = [], edges = [] }) => {
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
  const [bitPlane, setBitPlane] = useState(null);
  const [csMin, setCsMin] = useState(null);
  const [csMax, setCsMax] = useState(null);
  const [logMode, setLogMode] = useState(null);
  const [logGamma, setLogGamma] = useState(null);
  const [grayMin, setGrayMin] = useState(null);
  const [grayMax, setGrayMax] = useState(null);
  const [grayHighlight, setGrayHighlight] = useState(null);
  const [medianKernel, setMedianKernel] = useState(null);
  const [logGammaSmooth, setLogGammaSmooth] = useState(null);
  const [hpCutoff, setHpCutoff] = useState(null);
  const [hpBoost, setHpBoost] = useState(null);
  const [lpCutoff, setLpCutoff] = useState(null);
  const [lpBoost, setLpBoost] = useState(null);
  const [resizeBiggerScale, setResizeBiggerScale] = useState(null);
  const [resizeSmallerScale, setResizeSmallerScale] = useState(null);
  const [stretchWidth, setStretchWidth] = useState(null);
  const [stretchHeight, setStretchHeight] = useState(null);
  const [rotateAngle, setRotateAngle] = useState(null);
  const [averageKernel, setAverageKernel] = useState(null);
  const [gaussianKernel, setGaussianKernel] = useState(null);
  const [gaussianSigma, setGaussianSigma] = useState(null);
  const [weightedKernel, setWeightedKernel] = useState(null);
  const [laplacianKernel, setLaplacianKernel] = useState(null);
  const [unsharpAmount, setUnsharpAmount] = useState(null);
  const [highBoostFactor, setHighBoostFactor] = useState(null);
  const [convolutionKernel, setConvolutionKernel] = useState(null);
  const [crossCorrelationKernel, setCrossCorrelationKernel] = useState(null);
  const [glcmDistances, setGlcmDistances] = useState(null);
  const [glcmAngles, setGlcmAngles] = useState(null);
  const [glcmLevels, setGlcmLevels] = useState(null);
  const [contrastWindowSize, setContrastWindowSize] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const handleImageClick = () => setModalOpen(true);
  const handleCloseModal = (e) => {
    if (e.target.className === 'modal-overlay' || e.target.className === 'modal-close') {
      setModalOpen(false);
    }
  };

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
    if (selectedNode.type === 'bitPlaneSlicingNode') setBitPlane(params.bit_plane ?? 0);
    if (selectedNode.type === 'contrastStretchingNode') {
      setCsMin(params.min ?? 0);
      setCsMax(params.max ?? 255);
    }
    if (selectedNode.type === 'logPowerLawNode') {
      setLogMode(params.mode ?? 'log');
      setLogGamma(params.gamma ?? 1.0);
      setLogGammaSmooth(params.gamma ?? 1.0);
    }
    if (selectedNode.type === 'grayLevelSlicingNode') {
      setGrayMin(params.min ?? 100);
      setGrayMax(params.max ?? 200);
      setGrayHighlight(params.highlight ?? true);
    }
    if (selectedNode.type === 'medianFilterNode') {
      setMedianKernel(params.kernel_size ?? 3);
    }
    if (selectedNode.type === 'highPassFilterNode') {
      setHpCutoff(params.cutoff ?? 30);
      setHpBoost(params.boost ?? 1.0);
    }
    if (selectedNode.type === 'lowPassFilterNode') {
      setLpCutoff(params.cutoff ?? 30);
      setLpBoost(params.boost ?? 1.0);
    }
    if (selectedNode.type === 'resizeBiggerNode') setResizeBiggerScale(params.scale ?? 2.0);
    if (selectedNode.type === 'resizeSmallerNode') setResizeSmallerScale(params.scale ?? 0.5);
    if (selectedNode.type === 'stretchNode') {
      setStretchWidth(params.width_scale ?? 2.0);
      setStretchHeight(params.height_scale ?? 1.0);
    }
    if (selectedNode.type === 'rotateNode') setRotateAngle(params.angle ?? 90);
    if (selectedNode.type === 'averageFilteringNode') {
      setAverageKernel(params.kernel_size ?? 3);
    }
    if (selectedNode.type === 'gaussianKernelNode') {
      setGaussianKernel(params.kernel_size ?? 3);
      setGaussianSigma(params.sigma ?? 1.0);
    }
    if (selectedNode.type === 'weightedFilteringNode') {
      setWeightedKernel(params.kernel_size ?? 3);
    }
    if (selectedNode.type === 'laplacianMaskNode') {
      setLaplacianKernel(params.kernel_size ?? 3);
    }
    if (selectedNode.type === 'unsharpMaskingNode') {
      setUnsharpAmount(params.amount ?? 1.0);
    }
    if (selectedNode.type === 'highBoostFilteringNode') {
      setHighBoostFactor(params.factor ?? 1.5);
    }
    if (selectedNode.type === 'convolutionNode') {
      setConvolutionKernel(params.kernel_size ?? 3);
    }
    if (selectedNode.type === 'crossCorrelationNode') {
      setCrossCorrelationKernel(params.kernel_size ?? 3);
    }
    if (selectedNode.type === 'glcmNode') {
      setGlcmDistances(params.distances ?? [1]);
      setGlcmAngles(params.angles ?? [0]);
      setGlcmLevels(params.levels ?? 8);
    }
  }, [selectedNode && selectedNode.data && selectedNode.data.params]);

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

  // Helper: Check if selected node's input is from FFT
  let needsFFTWarning = false;
  if (selectedNode && (selectedNode.type === 'lowPassFilterNode' || selectedNode.type === 'highPassFilterNode')) {
    // Find incoming edge
    const incomingEdge = edges.find(edge => edge.target === selectedNode.id);
    if (incomingEdge) {
      const sourceNode = nodes.find(node => node.id === incomingEdge.source);
      if (!sourceNode || sourceNode.type !== 'fourierTransformNode') {
        needsFFTWarning = true;
      }
    } else {
      needsFFTWarning = true;
    }
  }

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

        {nodeType === 'bitPlaneSlicingNode' && (
          <>
            <div className="param-group">
              <label>Bit-plane: {bitPlane ?? params.bit_plane}</label>
              <input
                type="range"
                min="0"
                max="7"
                step="1"
                value={bitPlane ?? params.bit_plane}
                onChange={e => { setBitPlane(parseInt(e.target.value)); handleParamChange('bit_plane', parseInt(e.target.value)); }}
              />
              <div className="param-value">{bitPlane ?? params.bit_plane}</div>
            </div>
            <div className="param-group">
              <label>Mode</label>
              <select
                value={params.mode}
                onChange={e => handleParamChange('mode', e.target.value)}
              >
                <option value="single">Single</option>
                <option value="composite">Composite</option>
              </select>
            </div>
          </>
        )}

        {nodeType === 'contrastStretchingNode' && (
          <>
            <div className="param-group">
              <label>Min: {csMin}</label>
              <input
                type="number"
                min="0"
                max={csMax ?? 255}
                value={csMin}
                onChange={e => {setCsMin(Number(e.target.value)); handleParamChange('min', Number(e.target.value)); }}
              />
            </div>
            <div className="param-group">
              <label>Max: {csMax}</label>
              <input
                type="number"
                min={csMin ?? 0}
                max="255"
                value={csMax}
                onChange={e => { setCsMax(Number(e.target.value)); handleParamChange('max', Number(e.target.value)); }}
              />
            </div>
          </>
        )}

        {nodeType === 'logPowerLawNode' && (
          <>
            <div className="param-group">
              <label>Mode</label>
              <select
                value={params.mode}
                onChange={e => handleParamChange('mode', e.target.value)}
              >
                <option value="log">Log</option>
                <option value="power">Power</option>
              </select>
            </div>
            <div className="param-group">
              <label>Gamma: {logGammaSmooth}</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.01"
                value={logGammaSmooth}
                onChange={e => {
                  const val = Number(e.target.value);
                  setLogGammaSmooth(val);
                  handleParamChange('gamma', val);
                }}
                disabled={params.mode !== 'power'}
              />
              <div className="param-value">{logGammaSmooth}</div>
            </div>
          </>
        )}

        {nodeType === 'grayLevelSlicingNode' && (
          <>
            <div className="param-group">
              <label>Min: {grayMin}</label>
              <input
                type="number"
                min="0"
                max={grayMax ?? 200}
                value={grayMin}
                onChange={e => setGrayMin(Number(e.target.value))}
                onBlur={e => handleParamChange('min', Number(e.target.value))}
              />
            </div>
            <div className="param-group">
              <label>Max: {grayMax}</label>
              <input
                type="number"
                min={grayMin ?? 100}
                max="255"
                value={grayMax}
                onChange={e => setGrayMax(Number(e.target.value))}
                onBlur={e => handleParamChange('max', Number(e.target.value))}
              />
            </div>
            <div className="param-group">
              <label>Highlight</label>
              <select
                value={grayHighlight ? 'true' : 'false'}
                onChange={e => { const val = e.target.value === 'true'; setGrayHighlight(val); handleParamChange('highlight', val); }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </>
        )}

        {nodeType === 'medianFilterNode' && (
          <div className="param-group">
            <label>Kernel Size: {medianKernel}</label>
            <input
              type="range"
              min="3"
              max="11"
              step="2"
              value={medianKernel}
              onChange={e => { setMedianKernel(Number(e.target.value)); handleParamChange('kernel_size', Number(e.target.value)); }}
            />
            <div className="param-value">{medianKernel}</div>
          </div>
        )}

        {nodeType === 'highPassFilterNode' && (
          <>
            <div className="param-group">
              <label>Cutoff: {hpCutoff?.toFixed(2) ?? params.cutoff}</label>
              <input
                type="range"
                min="1"
                max="128"
                step="0.1"
                value={hpCutoff ?? params.cutoff}
                onChange={e => { const val = parseFloat(e.target.value); setHpCutoff(val); handleParamChange('cutoff', val); }}
              />
              <div className="param-value">{hpCutoff?.toFixed(2) ?? params.cutoff}</div>
            </div>
            <div className="param-group">
              <label>Boost: {hpBoost?.toFixed(2) ?? params.boost}</label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={hpBoost ?? params.boost}
                onChange={e => { const val = parseFloat(e.target.value); setHpBoost(val); handleParamChange('boost', val); }}
              />
              <div className="param-value">{hpBoost?.toFixed(2) ?? params.boost}</div>
            </div>
          </>
        )}
        {nodeType === 'lowPassFilterNode' && (
          <>
            <div className="param-group">
              <label>Cutoff: {lpCutoff?.toFixed(2) ?? params.cutoff}</label>
              <input
                type="range"
                min="1"
                max="128"
                step="0.1"
                value={lpCutoff ?? params.cutoff}
                onChange={e => { const val = parseFloat(e.target.value); setLpCutoff(val); handleParamChange('cutoff', val); }}
              />
              <div className="param-value">{lpCutoff?.toFixed(2) ?? params.cutoff}</div>
            </div>
            <div className="param-group">
              <label>Boost: {lpBoost?.toFixed(2) ?? params.boost}</label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={lpBoost ?? params.boost}
                onChange={e => { const val = parseFloat(e.target.value); setLpBoost(val); handleParamChange('boost', val); }}
              />
              <div className="param-value">{lpBoost?.toFixed(2) ?? params.boost}</div>
            </div>
          </>
        )}
        {nodeType === 'resizeBiggerNode' && (
          <div className="param-group">
            <label>Scale: {resizeBiggerScale}</label>
            <input
              type="range"
              min="1.1"
              max="5"
              step="0.1"
              value={resizeBiggerScale}
              onChange={e => { const val = parseFloat(e.target.value); setResizeBiggerScale(val); handleParamChange('scale', val); }}
            />
            <div className="param-value">{resizeBiggerScale}</div>
          </div>
        )}
        {nodeType === 'resizeSmallerNode' && (
          <div className="param-group">
            <label>Scale: {resizeSmallerScale}</label>
            <input
              type="range"
              min="0.1"
              max="0.99"
              step="0.01"
              value={resizeSmallerScale}
              onChange={e => { const val = parseFloat(e.target.value); setResizeSmallerScale(val); handleParamChange('scale', val); }}
            />
            <div className="param-value">{resizeSmallerScale}</div>
          </div>
        )}
        {nodeType === 'stretchNode' && (
          <>
            <div className="param-group">
              <label>Width Scale: {stretchWidth}</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={stretchWidth}
                onChange={e => { const val = parseFloat(e.target.value); setStretchWidth(val); handleParamChange('width_scale', val); }}
              />
              <div className="param-value">{stretchWidth}</div>
            </div>
            <div className="param-group">
              <label>Height Scale: {stretchHeight}</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={stretchHeight}
                onChange={e => { const val = parseFloat(e.target.value); setStretchHeight(val); handleParamChange('height_scale', val); }}
              />
              <div className="param-value">{stretchHeight}</div>
            </div>
          </>
        )}
        {nodeType === 'cropNode' && (
          <>
            <div className="param-group">
              <label>X: {params.x}</label>
              <input
                type="number"
                min="0"
                value={params.x}
                onChange={e => handleParamChange('x', parseInt(e.target.value))}
              />
            </div>
            <div className="param-group">
              <label>Y: {params.y}</label>
              <input
                type="number"
                min="0"
                value={params.y}
                onChange={e => handleParamChange('y', parseInt(e.target.value))}
              />
            </div>
            <div className="param-group">
              <label>Width: {params.width}</label>
              <input
                type="number"
                min="1"
                value={params.width}
                onChange={e => handleParamChange('width', parseInt(e.target.value))}
              />
            </div>
            <div className="param-group">
              <label>Height: {params.height}</label>
              <input
                type="number"
                min="1"
                value={params.height}
                onChange={e => handleParamChange('height', parseInt(e.target.value))}
              />
            </div>
          </>
        )}
        {nodeType === 'rotateNode' && (
          <div className="param-group">
            <label>Angle: {rotateAngle}°</label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotateAngle}
              onChange={e => { const val = parseInt(e.target.value); setRotateAngle(val); handleParamChange('angle', val); }}
            />
            <div className="param-value">{rotateAngle}°</div>
          </div>
        )}
        {nodeType === 'averageFilteringNode' && (
          <div className="param-group">
            <label>Kernel Size: {averageKernel}</label>
            <input
              type="range"
              min="3"
              max="11"
              step="2"
              value={averageKernel}
              onChange={e => { const val = Number(e.target.value); setAverageKernel(val); handleParamChange('kernel_size', val); }}
            />
            <div className="param-value">{averageKernel}</div>
          </div>
        )}
        {nodeType === 'gaussianKernelNode' && (
          <>
            <div className="param-group">
              <label>Kernel Size: {gaussianKernel}</label>
              <input
                type="range"
                min="3"
                max="11"
                step="2"
                value={gaussianKernel}
                onChange={e => { const val = Number(e.target.value); setGaussianKernel(val); handleParamChange('kernel_size', val); }}
              />
              <div className="param-value">{gaussianKernel}</div>
            </div>
            <div className="param-group">
              <label>Sigma: {gaussianSigma}</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={gaussianSigma}
                onChange={e => { const val = parseFloat(e.target.value); setGaussianSigma(val); handleParamChange('sigma', val); }}
              />
              <div className="param-value">{gaussianSigma}</div>
            </div>
          </>
        )}
        {nodeType === 'weightedFilteringNode' && (
          <div className="param-group">
            <label>Kernel Size: {weightedKernel}</label>
            <input
              type="range"
              min="3"
              max="11"
              step="2"
              value={weightedKernel}
              onChange={e => { const val = Number(e.target.value); setWeightedKernel(val); handleParamChange('kernel_size', val); }}
            />
            <div className="param-value">{weightedKernel}</div>
          </div>
        )}
        {nodeType === 'laplacianMaskNode' && (
          <div className="param-group">
            <label>Kernel Size: {laplacianKernel}</label>
            <input
              type="range"
              min="3"
              max="7"
              step="2"
              value={laplacianKernel}
              onChange={e => { const val = Number(e.target.value); setLaplacianKernel(val); handleParamChange('kernel_size', val); }}
            />
            <div className="param-value">{laplacianKernel}</div>
          </div>
        )}
        {nodeType === 'unsharpMaskingNode' && (
          <div className="param-group">
            <label>Amount: {unsharpAmount}</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={unsharpAmount}
              onChange={e => { const val = parseFloat(e.target.value); setUnsharpAmount(val); handleParamChange('amount', val); }}
            />
            <div className="param-value">{unsharpAmount}</div>
          </div>
        )}
        {nodeType === 'highBoostFilteringNode' && (
          <div className="param-group">
            <label>Boost Factor: {highBoostFactor}</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={highBoostFactor}
              onChange={e => { const val = parseFloat(e.target.value); setHighBoostFactor(val); handleParamChange('factor', val); }}
            />
            <div className="param-value">{highBoostFactor}</div>
          </div>
        )}
        {nodeType === 'convolutionNode' && (
          <div className="param-group">
            <label>Kernel Size: {convolutionKernel}</label>
            <input
              type="range"
              min="3"
              max="11"
              step="2"
              value={convolutionKernel}
              onChange={e => { const val = Number(e.target.value); setConvolutionKernel(val); handleParamChange('kernel_size', val); }}
            />
            <div className="param-value">{convolutionKernel}</div>
          </div>
        )}
        {nodeType === 'crossCorrelationNode' && (
          <div className="param-group">
            <label>Kernel Size: {crossCorrelationKernel}</label>
            <input
              type="range"
              min="3"
              max="11"
              step="2"
              value={crossCorrelationKernel}
              onChange={e => { const val = Number(e.target.value); setCrossCorrelationKernel(val); handleParamChange('kernel_size', val); }}
            />
            <div className="param-value">{crossCorrelationKernel}</div>
          </div>
        )}
        {nodeType === 'glcmNode' && (
          <>
            <div className="param-group">
              <label>Distances (comma separated):</label>
              <input
                type="text"
                value={glcmDistances ? glcmDistances.join(',') : ''}
                onChange={e => {
                  const val = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                  setGlcmDistances(val);
                  handleParamChange('distances', val);
                }}
              />
            </div>
            <div className="param-group">
              <label>Angles (degrees, comma separated):</label>
              <input
                type="text"
                value={glcmAngles ? glcmAngles.join(',') : ''}
                onChange={e => {
                  const val = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                  setGlcmAngles(val);
                  handleParamChange('angles', val);
                }}
              />
            </div>
            <div className="param-group">
              <label>Levels:</label>
              <input
                type="number"
                min="2"
                max="256"
                value={glcmLevels ?? 8}
                onChange={e => { const val = parseInt(e.target.value); setGlcmLevels(val); handleParamChange('levels', val); }}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="preview-panel">
      <h3>Preview</h3>
      {/* Show warning for LowPassFilterNode and HighPassFilterNode if input is not FFT */}
      {needsFFTWarning && (
        <div className="warning-message" style={{ color: 'orange', marginBottom: '8px' }}>
          ⚠️ This node requires an FFT input. Please connect a Fourier Transform node before this filter.
        </div>
      )}
      {image ? (
        <>
          <img src={image} alt="Processed" className="preview-image" style={{ cursor: 'pointer' }} onClick={handleImageClick} />
          {modalOpen && (
            <div className="modal-overlay" onClick={handleCloseModal} style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
              <div style={{ position: 'relative', background: '#222', padding: 16, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button className="modal-close" onClick={handleCloseModal} style={{ position: 'absolute', top: -16, right: -16, background: '#222', border: '2px solid #fff', color: '#fff', fontSize: 28, cursor: 'pointer', borderRadius: '50%', width: 36, height: 36, zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>&times;</button>
                <img src={image} alt="Enlarged Preview" style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 8, display: 'block' }} />
              </div>
            </div>
          )}
        </>
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