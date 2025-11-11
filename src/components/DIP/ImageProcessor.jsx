import { useState, useRef, useEffect } from 'react'
import {
  loadImageFromFile,
  imageToCanvas,
  getImageData,
  putImageData,
  applyNegative,
  applyLogTransform,
  applyGammaTransform,
  applyContrastStretch,
  applyHistogramEqualization,
  applyMeanFilter,
  applyMedianFilter,
  addGaussianNoise,
  addSaltPepperNoise
} from '../../utils/imageProcessing'
import StepByStepDisplay from '../shared/StepByStepDisplay'
import './ImageProcessor.css'

function ImageProcessor({ availableFilters = [] }) {
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [filterParams, setFilterParams] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [steps, setSteps] = useState([])
  const fileInputRef = useRef(null)
  const originalCanvasRef = useRef(null)
  const processedCanvasRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const img = await loadImageFromFile(file)
      setOriginalImage(img)
      setProcessedImage(null)
    } catch (error) {
      console.error('Error loading image:', error)
      alert('Error loading image. Please try again.')
    }
  }

  const applyFilter = (filterName) => {
    if (!originalImage) {
      alert('Please upload an image first')
      return
    }

    setIsProcessing(true)
    const processingSteps = []
    
    setTimeout(() => {
      try {
        const canvas = imageToCanvas(originalImage)
        let imageData = getImageData(canvas)
        
        processingSteps.push({
          description: `Loaded image: ${originalImage.width} × ${originalImage.height} pixels`,
        })

        switch (filterName) {
          case 'negative':
            processingSteps.push({
              description: `Applying Image Negative: s = 255 - r`,
              data: `Formula: For each pixel, output = 255 - input`
            })
            imageData = applyNegative(imageData)
            processingSteps.push({
              description: `Processed all pixels`,
              result: `Image inverted successfully`
            })
            break
          case 'log':
            const c = filterParams.logC || 45
            processingSteps.push({
              description: `Applying Log Transformation: s = c × log(1 + r)`,
              data: `Constant c = ${c}\nFormula: s = ${c} × log(1 + r)`
            })
            imageData = applyLogTransform(imageData, c)
            processingSteps.push({
              description: `Applied logarithmic transformation to all pixels`,
              result: `Dynamic range compressed`
            })
            break
          case 'gamma':
            const gamma = filterParams.gamma || 1.0
            const gammaC = filterParams.gammaC || 1.0
            processingSteps.push({
              description: `Applying Gamma Transformation: s = c × r^γ`,
              data: `γ = ${gamma}, c = ${gammaC}\nFormula: s = ${gammaC} × r^${gamma}`
            })
            imageData = applyGammaTransform(imageData, gamma, gammaC)
            processingSteps.push({
              description: `Applied power-law transformation`,
              result: gamma < 1 ? 'Image brightened' : gamma > 1 ? 'Image darkened' : 'No change'
            })
            break
          case 'contrast':
            processingSteps.push({
              description: `Applying Contrast Stretching: s = (r - r_min) × (L-1) / (r_max - r_min)`,
            })
            // Find min/max before processing
            const data = imageData.data
            let min = 255, max = 0
            for (let i = 0; i < data.length; i += 4) {
              const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
              min = Math.min(min, gray)
              max = Math.max(max, gray)
            }
            processingSteps.push({
              description: `Found intensity range: min = ${min}, max = ${max}`,
              data: `Mapping [${min}, ${max}] to [0, 255]`
            })
            imageData = applyContrastStretch(imageData)
            processingSteps.push({
              description: `Stretched contrast for all pixels`,
              result: `Contrast enhanced`
            })
            break
          case 'histogram':
            processingSteps.push({
              description: `Applying Histogram Equalization: s_k = (L-1) × Σ(n_j) / n`,
            })
            processingSteps.push({
              description: `Step 1: Calculate histogram of input image`,
            })
            processingSteps.push({
              description: `Step 2: Compute cumulative distribution function (CDF)`,
            })
            processingSteps.push({
              description: `Step 3: Normalize CDF to [0, 255] range`,
            })
            processingSteps.push({
              description: `Step 4: Map each pixel using normalized CDF`,
            })
            imageData = applyHistogramEqualization(imageData)
            processingSteps.push({
              description: `Histogram equalization complete`,
              result: `Contrast automatically enhanced`
            })
            break
          case 'mean':
            const kernelSize = filterParams.kernelSize || 3
            processingSteps.push({
              description: `Applying Mean Filter (Averaging): g(x,y) = (1/k²) × Σ f(x+i, y+j)`,
              data: `Kernel size: ${kernelSize}×${kernelSize}\nFormula: Replace each pixel with average of ${kernelSize * kernelSize} neighbors`
            })
            processingSteps.push({
              description: `Processing each pixel:`,
              data: `For each pixel, collect ${kernelSize * kernelSize} neighbors, calculate average, replace center pixel`
            })
            imageData = applyMeanFilter(imageData, kernelSize)
            processingSteps.push({
              description: `Mean filter applied to all pixels`,
              result: `Image smoothed (noise reduced, edges blurred)`
            })
            break
          case 'median':
            const medianKernel = filterParams.kernelSize || 3
            processingSteps.push({
              description: `Applying Median Filter: g(x,y) = median{f(x+i, y+j)}`,
              data: `Kernel size: ${medianKernel}×${medianKernel}\nFormula: Replace each pixel with median of ${medianKernel * medianKernel} neighbors`
            })
            processingSteps.push({
              description: `Processing each pixel:`,
              data: `For each pixel: collect neighbors, sort values, select middle value (median), replace center pixel`
            })
            imageData = applyMedianFilter(imageData, medianKernel)
            processingSteps.push({
              description: `Median filter applied to all pixels`,
              result: `Salt & pepper noise removed, edges preserved`
            })
            break
          case 'gaussian-noise':
            const variance = filterParams.variance || 0.1
            processingSteps.push({
              description: `Adding Gaussian Noise: p(z) = (1/√(2πσ²)) × e^(-(z-μ)²/(2σ²))`,
              data: `Variance: ${variance}\nMean: 0\nAdding random Gaussian noise to each pixel`
            })
            imageData = addGaussianNoise(imageData, variance)
            processingSteps.push({
              description: `Gaussian noise added to all pixels`,
              result: `Image degraded with Gaussian noise`
            })
            break
          case 'salt-pepper-noise':
            const prob = filterParams.probability || 0.05
            processingSteps.push({
              description: `Adding Salt & Pepper Noise`,
              data: `Probability: ${prob}\nFor each pixel: with probability ${prob}, set to 255 (salt) or 0 (pepper)`
            })
            imageData = addSaltPepperNoise(imageData, prob)
            processingSteps.push({
              description: `Salt & pepper noise added`,
              result: `Random white and black spots added`
            })
            break
          default:
            setIsProcessing(false)
            return
        }
        
        processingSteps.push({
          description: `Final step: Rendering processed image`,
          result: `Processing complete!`
        })
        
        const processedCanvas = putImageData(canvas, imageData)
        if (processedCanvasRef.current) {
          const ctx = processedCanvasRef.current.getContext('2d')
          processedCanvasRef.current.width = processedCanvas.width
          processedCanvasRef.current.height = processedCanvas.height
          ctx.drawImage(processedCanvas, 0, 0)
        }
        
        setSteps(processingSteps)
        setProcessedImage(processedCanvas)
      } catch (error) {
        console.error('Error applying filter:', error)
        alert('Error applying filter. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    }, 100)
  }

  const resetImage = () => {
    if (originalImage && processedCanvasRef.current) {
      const canvas = imageToCanvas(originalImage)
      const ctx = processedCanvasRef.current.getContext('2d')
      processedCanvasRef.current.width = canvas.width
      processedCanvasRef.current.height = canvas.height
      ctx.drawImage(canvas, 0, 0)
      setProcessedImage(null)
    }
  }

  useEffect(() => {
    if (!originalImage || !originalCanvasRef.current) return
    const canvas = imageToCanvas(originalImage)
    const ctx = originalCanvasRef.current.getContext('2d')
    originalCanvasRef.current.width = canvas.width
    originalCanvasRef.current.height = canvas.height
    ctx.drawImage(canvas, 0, 0)
  }, [originalImage])

  useEffect(() => {
    if (processedImage && processedCanvasRef.current) {
      const ctx = processedCanvasRef.current.getContext('2d')
      processedCanvasRef.current.width = processedImage.width
      processedCanvasRef.current.height = processedImage.height
      ctx.drawImage(processedImage, 0, 0)
    } else if (!processedImage && processedCanvasRef.current && originalImage) {
      const canvas = imageToCanvas(originalImage)
      const ctx = processedCanvasRef.current.getContext('2d')
      processedCanvasRef.current.width = canvas.width
      processedCanvasRef.current.height = canvas.height
      ctx.drawImage(canvas, 0, 0)
    }
  }, [processedImage, originalImage])

  return (
    <div className="image-processor">
      <div className="upload-section">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          📷 Upload Image
        </button>
        {originalImage && (
          <button className="reset-btn" onClick={resetImage}>
            🔄 Reset
          </button>
        )}
      </div>

      {originalImage && (
        <div className="image-display">
          <div className="image-container">
            <h3>Original Image</h3>
            <canvas ref={originalCanvasRef} className="image-canvas" />
          </div>
          <div className="image-container">
            <h3>Processed Image</h3>
            <canvas ref={processedCanvasRef} className="image-canvas" />
          </div>
        </div>
      )}

      {originalImage && (
        <div className="filters-section">
          <h3>Apply Filters</h3>
          <div className="filters-grid">
            {availableFilters.map(filter => (
              <div key={filter.name} className="filter-item">
                <button
                  className="filter-btn"
                  onClick={() => applyFilter(filter.name)}
                  disabled={isProcessing}
                >
                  {filter.label}
                </button>
                {filter.params && filter.params.map(param => (
                  <div key={param.name} className="param-control">
                    <label>
                      {param.label}:
                      <input
                        type="number"
                        step={param.step || 0.1}
                        min={param.min || 0}
                        max={param.max || 10}
                        value={filterParams[param.name] || param.default}
                        onChange={(e) => setFilterParams({
                          ...filterParams,
                          [param.name]: parseFloat(e.target.value)
                        })}
                      />
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <StepByStepDisplay steps={steps} title="Image Processing Steps" />
      )}
    </div>
  )
}

export default ImageProcessor

