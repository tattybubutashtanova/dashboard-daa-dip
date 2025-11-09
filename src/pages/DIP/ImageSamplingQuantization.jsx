import { useState, useRef } from 'react'
import InteractivePage from '../../components/shared/InteractivePage'
import InputCard from '../../components/shared/InputCard'
import OutputCard from '../../components/shared/OutputCard'
import { loadImageFromFile, imageToCanvas, getImageData } from '../../utils/imageProcessing'

function ImageSamplingQuantization() {
  const [image, setImage] = useState(null)
  const [samplingRate, setSamplingRate] = useState(1)
  const [quantizationLevels, setQuantizationLevels] = useState(256)
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const img = await loadImageFromFile(file)
      setImage(img)
      setResult(null)
      setSteps([])
    } catch (error) {
      alert('Error loading image')
    }
  }

  const processImage = () => {
    if (!image) {
      alert('Please upload an image first')
      return
    }

    const processingSteps = []
    const canvas = imageToCanvas(image)
    const ctx = canvas.getContext('2d')
    const imageData = getImageData(canvas)
    const data = new Uint8ClampedArray(imageData.data)

    processingSteps.push({
      description: `Original image: ${image.width} × ${image.height} pixels`,
    })

    // Sampling
    const sampledWidth = Math.floor(image.width / samplingRate)
    const sampledHeight = Math.floor(image.height / samplingRate)
    
    processingSteps.push({
      description: `Sampling: Reducing resolution by factor of ${samplingRate}`,
      data: `New dimensions: ${sampledWidth} × ${sampledHeight} pixels`
    })

    // Quantization
    const levels = parseInt(quantizationLevels)
    const step = 256 / levels
    
    processingSteps.push({
      description: `Quantization: Reducing to ${levels} gray levels`,
      data: `Step size: ${step.toFixed(2)}`
    })

    for (let i = 0; i < data.length; i += 4) {
      if (i % (samplingRate * 4) === 0) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
        const quantized = Math.floor(gray / step) * step
        data[i] = quantized
        data[i + 1] = quantized
        data[i + 2] = quantized
      } else {
        data[i] = 0
        data[i + 1] = 0
        data[i + 2] = 0
      }
    }

    const processedData = new ImageData(data, image.width, image.height)
    ctx.putImageData(processedData, 0, 0)

    if (canvasRef.current) {
      const ctx2 = canvasRef.current.getContext('2d')
      canvasRef.current.width = image.width
      canvasRef.current.height = image.height
      ctx2.drawImage(canvas, 0, 0)
    }

    processingSteps.push({
      description: `Processing complete`,
      result: `Sampled and quantized image generated`
    })

    setSteps(processingSteps)
    setResult({
      originalSize: `${image.width} × ${image.height}`,
      sampledSize: `${sampledWidth} × ${sampledHeight}`,
      quantizationLevels: levels
    })
  }

  const explanation = (
    <>
      <h4>Image Sampling and Quantization</h4>
      <p><strong>Sampling:</strong> Digitizing the coordinate values (spatial resolution). 
      Reducing the number of pixels by taking every nth pixel.</p>
      <p><strong>Quantization:</strong> Digitizing the amplitude values (gray levels). 
      Reducing the number of distinct intensity values.</p>
      <p><strong>Formula:</strong></p>
      <ul>
        <li>Sampling: New size = Original size / sampling_rate</li>
        <li>Quantization: Quantized value = floor(pixel_value / step) × step</li>
        <li>Step = 256 / quantization_levels</li>
      </ul>
    </>
  )

  return (
    <InteractivePage
      title="Image Sampling and Quantization"
      formula="Sampling: size_new = size_original / rate | Quantization: q = floor(p / step) × step"
      explanation={explanation}
      inputSection={
        <div>
          <InputCard title="Upload Image">
            <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
              />
              <div>📷 Click to upload image</div>
              {image && <div className="file-upload-text">✓ {image.width} × {image.height}</div>}
            </div>
          </InputCard>

          <InputCard title="Sampling Rate">
            <div className="input-group">
              <label>Sampling Factor (1 = no sampling, 2 = half resolution)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={samplingRate}
                onChange={(e) => setSamplingRate(parseInt(e.target.value) || 1)}
              />
            </div>
          </InputCard>

          <InputCard title="Quantization Levels">
            <div className="input-group">
              <label>Number of Gray Levels (2-256)</label>
              <input
                type="number"
                min="2"
                max="256"
                value={quantizationLevels}
                onChange={(e) => setQuantizationLevels(parseInt(e.target.value) || 256)}
              />
            </div>
          </InputCard>

          <div className="button-group">
            <button className="btn-primary" onClick={processImage}>
              Process Image
            </button>
            <button className="btn-secondary" onClick={() => {
              setResult(null)
              setSteps([])
            }}>
              Reset
            </button>
          </div>
        </div>
      }
      outputSection={
        <div>
          {image && (
            <div style={{ marginBottom: '1rem' }}>
              <h4>Original Image</h4>
              <img 
                src={image.src} 
                alt="Original" 
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            </div>
          )}
          {result && (
            <OutputCard title="Processed Image">
              <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: '8px' }} />
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Original Size:</strong> {result.originalSize}</p>
                <p><strong>Sampled Size:</strong> {result.sampledSize}</p>
                <p><strong>Quantization Levels:</strong> {result.quantizationLevels}</p>
              </div>
            </OutputCard>
          )}
          {steps.length > 0 && (
            <OutputCard title="Processing Steps">
              <ol style={{ paddingLeft: '1.5rem' }}>
                {steps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <strong>{step.description}</strong>
                    {step.data && <div style={{ marginLeft: '1rem', color: '#666' }}>{step.data}</div>}
                  </li>
                ))}
              </ol>
            </OutputCard>
          )}
          {!result && <OutputCard isEmpty={true} />}
        </div>
      }
      algorithmExplanation={explanation}
    />
  )
}

export default ImageSamplingQuantization

