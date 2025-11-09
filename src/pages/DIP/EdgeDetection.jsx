import { useState, useRef } from 'react'
import InteractivePage from '../../components/shared/InteractivePage'
import InputCard from '../../components/shared/InputCard'
import OutputCard from '../../components/shared/OutputCard'
import { loadImageFromFile, imageToCanvas, getImageData } from '../../utils/imageProcessing'

function EdgeDetection() {
  const [image, setImage] = useState(null)
  const [method, setMethod] = useState('sobel')
  const [threshold, setThreshold] = useState(100)
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

  const applyEdgeDetection = () => {
    if (!image) {
      alert('Please upload an image first')
      return
    }

    const processingSteps = []
    const canvas = imageToCanvas(image)
    const ctx = canvas.getContext('2d')
    const imageData = getImageData(canvas)
    const data = new Uint8ClampedArray(imageData.data)
    const width = imageData.width
    const height = imageData.height
    const result = new Uint8ClampedArray(data.length)

    processingSteps.push({
      description: `Applying ${method.toUpperCase()} edge detection`,
      data: `Image size: ${width} × ${height} pixels\nThreshold: ${threshold}`
    })

    // Convert to grayscale first
    const grayscale = []
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
      grayscale.push(gray)
    }

    processingSteps.push({
      description: `Step 1: Convert image to grayscale`,
    })

    // Apply edge detection kernel
    const kernels = {
      sobel: {
        x: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
        y: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
      },
      prewitt: {
        x: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
        y: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]]
      },
      laplacian: {
        x: [[0, -1, 0], [-1, 4, -1], [0, -1, 0]],
        y: [[0, -1, 0], [-1, 4, -1], [0, -1, 0]]
      }
    }

    const kernel = kernels[method]

    processingSteps.push({
      description: `Step 2: Apply ${method.toUpperCase()} kernel`,
      data: `Kernel X:\n${kernel.x.map(r => r.join(' ')).join('\n')}\n\nKernel Y:\n${kernel.y.map(r => r.join(' ')).join('\n')}`
    })

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx))
            const gray = grayscale[idx]
            gx += gray * kernel.x[ky + 1][kx + 1]
            gy += gray * kernel.y[ky + 1][kx + 1]
          }
        }

        const magnitude = Math.sqrt(gx * gx + gy * gy)
        const edge = magnitude > threshold ? 255 : 0

        const idx = (y * width + x) * 4
        result[idx] = edge
        result[idx + 1] = edge
        result[idx + 2] = edge
        result[idx + 3] = 255
      }
    }

    processingSteps.push({
      description: `Step 3: Calculate gradient magnitude and apply threshold`,
      data: `Pixels with magnitude > ${threshold} are marked as edges (white)`
    })

    const processedData = new ImageData(result, width, height)
    ctx.putImageData(processedData, 0, 0)

    if (canvasRef.current) {
      const ctx2 = canvasRef.current.getContext('2d')
      canvasRef.current.width = width
      canvasRef.current.height = height
      ctx2.drawImage(canvas, 0, 0)
    }

    processingSteps.push({
      description: `Edge detection complete`,
      result: `Edges detected using ${method.toUpperCase()} method`
    })

    setSteps(processingSteps)
    setResult({ method, threshold, edgeCount: 'Calculated' })
  }

  const explanation = (
    <>
      <h4>Edge Detection</h4>
      <p>Edge detection identifies boundaries between different regions in an image.</p>
      <p><strong>Methods:</strong></p>
      <ul>
        <li><strong>Sobel:</strong> Uses gradient approximation with 3×3 kernels</li>
        <li><strong>Prewitt:</strong> Similar to Sobel with different kernel values</li>
        <li><strong>Laplacian:</strong> Second derivative operator</li>
      </ul>
      <p><strong>Formula:</strong></p>
      <ul>
        <li>Gradient magnitude: G = √(Gx² + Gy²)</li>
        <li>Edge if: G &gt; threshold</li>
      </ul>
    </>
  )

  return (
    <InteractivePage
      title="Edge Detection"
      formula="G = √(Gx² + Gy²), Edge if G > threshold"
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

          <InputCard title="Edge Detection Method">
            <div className="input-group">
              <label>Select Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="sobel">Sobel</option>
                <option value="prewitt">Prewitt</option>
                <option value="laplacian">Laplacian</option>
              </select>
            </div>
          </InputCard>

          <InputCard title="Threshold">
            <div className="input-group">
              <label>Edge Threshold (0-255)</label>
              <input
                type="range"
                min="0"
                max="255"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
              />
              <div className="slider-value">{threshold}</div>
            </div>
          </InputCard>

          <div className="button-group">
            <button className="btn-primary" onClick={applyEdgeDetection}>
              Detect Edges
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
            <OutputCard title="Edge Detected Image">
              <canvas ref={canvasRef} style={{ maxWidth: '100%', borderRadius: '8px' }} />
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Method:</strong> {result.method.toUpperCase()}</p>
                <p><strong>Threshold:</strong> {result.threshold}</p>
              </div>
            </OutputCard>
          )}
          {steps.length > 0 && (
            <OutputCard title="Processing Steps">
              <ol style={{ paddingLeft: '1.5rem' }}>
                {steps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <strong>{step.description}</strong>
                    {step.data && <pre style={{ marginTop: '0.5rem', background: '#f0f0f0', padding: '0.5rem', borderRadius: '4px' }}>{step.data}</pre>}
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

export default EdgeDetection

