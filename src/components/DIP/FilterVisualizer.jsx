import { useEffect, useRef, useState } from 'react'
import InteractivePage from '../shared/InteractivePage'
import InputCard from '../shared/InputCard'
import OutputCard from '../shared/OutputCard'
import { loadImageFromFile, imageToCanvas, getImageData, putImageData } from '../../utils/imageProcessing'

function FilterVisualizer({
  title,
  formula,
  explanation,
  controls,
  processImage, // async (ImageData, params) => ImageData
  initialParams = {},
  extraInputs = null, // optional extra input elements (e.g., target image)
  extraOutput = null, // optional render function ({ image, processed, steps, params }) => ReactNode
  extraOutputAboveProcessed = null, // optional render function placed before processed canvas
}) {
  const [image, setImage] = useState(null)
  const [params, setParams] = useState(initialParams)
  const [steps, setSteps] = useState([])
  const [error, setError] = useState('')
  const [processed, setProcessed] = useState(null)
  const fileInputRef = useRef(null)
  const resultCanvasRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const img = await loadImageFromFile(file)
      setImage(img)
      setProcessed(null)
      setSteps([])
      setError('')
    } catch (err) {
      setError('Failed to load image')
    }
  }

  const run = async () => {
    if (!image) {
      setError('Please upload an image')
      return
    }
    setError('')
    const srcCanvas = imageToCanvas(image)
    const srcData = getImageData(srcCanvas)
    const { result, log } = await processImage(srcData, params)
    if (log && Array.isArray(log)) setSteps(log)
    const outCanvas = putImageData(srcCanvas, result)
    setProcessed(outCanvas)
  }

  useEffect(() => {
    if (!processed || !resultCanvasRef.current) return
    const canvasEl = resultCanvasRef.current
    canvasEl.width = processed.width
    canvasEl.height = processed.height
    const ctx = canvasEl.getContext('2d')
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    ctx.drawImage(processed, 0, 0)
  }, [processed])

  return (
    <InteractivePage
      title={title}
      formula={formula}
      explanation={explanation}
      inputSection={
        <div>
          <InputCard title="Input">
            <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
              />
              <div>Upload Image</div>
            </div>
            {extraInputs}
          </InputCard>
          {controls && (
            <InputCard title="Parameters">
              {controls({ params, setParams })}
            </InputCard>
          )}
          <div className="button-group">
            <button className="btn-primary" onClick={run}>Run</button>
            <button className="btn-secondary" onClick={() => { setProcessed(null); setSteps([]); setError('') }}>Reset</button>
          </div>
          {error && <p style={{ color: '#c62828' }}>{error}</p>}
        </div>
      }
      outputSection={
        <div>
          {image && (
            <OutputCard title="Original Image">
              <img
                src={image.src}
                alt="Original"
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            </OutputCard>
          )}
          {extraOutputAboveProcessed && (
            <div style={{ marginBottom: '1rem' }}>
              {extraOutputAboveProcessed({ image, processed, steps, params })}
            </div>
          )}
          {processed && (
            <OutputCard title="Processed Image">
              <canvas ref={resultCanvasRef} style={{ maxWidth: '100%', borderRadius: 8 }} />
            </OutputCard>
          )}
          {!processed && <OutputCard isEmpty={true} />}
          {extraOutput && (
            <div style={{ marginTop: '1rem' }}>
              {extraOutput({ image, processed, steps, params })}
            </div>
          )}
          {steps.length > 0 && (
            <OutputCard title="Steps">
              <ol style={{ paddingLeft: '1.5rem' }}>
                {steps.map((s, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <strong>{s.description}</strong>
                    {s.data && <div style={{ marginLeft: '1rem', color: '#666', whiteSpace: 'pre-wrap' }}>{s.data}</div>}
                  </li>
                ))}
              </ol>
            </OutputCard>
          )}
        </div>
      }
    />
  )
}

export default FilterVisualizer


