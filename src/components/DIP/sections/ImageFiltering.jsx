import { useState, useRef } from 'react'
import '../../shared/SectionStyles.css'
import ImageProcessor from '../ImageProcessor'
import FormulaLayout from '../../shared/FormulaLayout'
import InputCard from '../../shared/InputCard'
import OutputCard from '../../shared/OutputCard'
import StepByStepDisplay from '../../shared/StepByStepDisplay'
import { loadImageFromFile, imageToCanvas, getImageData, putImageData } from '../../../utils/imageProcessing'

const filteringFilters = [
  { name: 'mean', label: 'Mean Filter', params: [
    { name: 'kernelSize', label: 'Kernel Size', default: 3, min: 3, max: 15, step: 2 }
  ]},
  { name: 'median', label: 'Median Filter', params: [
    { name: 'kernelSize', label: 'Kernel Size', default: 3, min: 3, max: 15, step: 2 }
  ]},
  { name: 'gaussian-noise', label: 'Add Gaussian Noise', params: [
    { name: 'variance', label: 'Variance', default: 0.1, min: 0.01, max: 0.5, step: 0.01 }
  ]},
  { name: 'salt-pepper-noise', label: 'Add Salt & Pepper Noise', params: [
    { name: 'probability', label: 'Probability', default: 0.05, min: 0.01, max: 0.2, step: 0.01 }
  ]}
]

function ImageFiltering() {
  // Convolution tool state
  const [convImage, setConvImage] = useState(null)
  const [kernelType, setKernelType] = useState('custom')
  const [kernelSize, setKernelSize] = useState(3)
  const [customKernel, setCustomKernel] = useState([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ])
  const [convResult, setConvResult] = useState(null)
  const [convSteps, setConvSteps] = useState([])
  const convFileInputRef = useRef(null)
  const convOriginalCanvasRef = useRef(null)
  const convProcessedCanvasRef = useRef(null)

  // Predefined kernels
  const predefinedKernels = {
    identity: {
      name: 'Identity',
      kernel: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
      description: 'No change to image'
    },
    blur: {
      name: 'Blur (Box)',
      kernel: [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]],
      description: 'Smooths image'
    },
    sharpen: {
      name: 'Sharpen',
      kernel: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
      description: 'Enhances edges and details'
    },
    edgeDetect: {
      name: 'Edge Detection',
      kernel: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
      description: 'Detects edges'
    },
    laplacian: {
      name: 'Laplacian',
      kernel: [[0, -1, 0], [-1, 4, -1], [0, -1, 0]],
      description: 'Second derivative for edge detection'
    },
    sobelX: {
      name: 'Sobel X',
      kernel: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
      description: 'Horizontal edge detection'
    },
    sobelY: {
      name: 'Sobel Y',
      kernel: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
      description: 'Vertical edge detection'
    },
    emboss: {
      name: 'Emboss',
      kernel: [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]],
      description: 'Creates embossed effect'
    }
  }

  const handleConvFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const img = await loadImageFromFile(file)
      setConvImage(img)
      
      const canvas = imageToCanvas(img)
      if (convOriginalCanvasRef.current) {
        const ctx = convOriginalCanvasRef.current.getContext('2d')
        convOriginalCanvasRef.current.width = canvas.width
        convOriginalCanvasRef.current.height = canvas.height
        ctx.drawImage(canvas, 0, 0)
      }
      
      setConvResult(null)
      setConvSteps([])
    } catch (error) {
      console.error('Error loading image:', error)
      alert('Error loading image. Please try again.')
    }
  }

  const updateCustomKernel = (row, col, value) => {
    const newKernel = customKernel.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? parseFloat(value) || 0 : c))
    )
    setCustomKernel(newKernel)
  }

  const applyConvolution = () => {
    if (!convImage) {
      alert('Please upload an image first')
      return
    }

    const solutionSteps = []
    const canvas = imageToCanvas(convImage)
    const imageData = getImageData(canvas)
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data

    solutionSteps.push({
      description: `Loaded image: ${width} × ${height} pixels`,
      data: `Total pixels: ${width * height}`
    })

    // Get kernel
    let kernel
    if (kernelType === 'custom') {
      kernel = customKernel
    } else {
      kernel = predefinedKernels[kernelType].kernel
    }

    const kSize = kernel.length
    const kRadius = Math.floor(kSize / 2)

    solutionSteps.push({
      description: `Step 1: Selected kernel (${kSize}×${kSize})`,
      data: `Kernel:\n${kernel.map(r => r.map(v => v.toString().padStart(6)).join(' ')).join('\n')}\n${kernelType !== 'custom' ? `Type: ${predefinedKernels[kernelType].name}\n${predefinedKernels[kernelType].description}` : 'Custom kernel'}`
    })

    // Apply convolution
    const result = new Uint8ClampedArray(data.length)
    let processedCount = 0

    solutionSteps.push({
      description: `Step 2: Apply convolution operation`,
      data: `Formula: (f * g)(x, y) = Σ Σ f(i, j) × g(x-i, y-j)\nProcessing RGB channels independently with ${kSize}×${kSize} kernel\nUsing zero padding for edge pixels`
    })

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sumR = 0
        let sumG = 0
        let sumB = 0

        // Apply kernel
        for (let ky = 0; ky < kSize; ky++) {
          for (let kx = 0; kx < kSize; kx++) {
            const px = x + kx - kRadius
            const py = y + ky - kRadius

            if (px >= 0 && px < width && py >= 0 && py < height) {
              const srcIdx = (py * width + px) * 4
              const weight = kernel[ky][kx]
              sumR += data[srcIdx] * weight
              sumG += data[srcIdx + 1] * weight
              sumB += data[srcIdx + 2] * weight
            }
            // Zero padding: contributions stay 0 if outside bounds
          }
        }

        // Clamp values to [0, 255]
        const outputR = Math.max(0, Math.min(255, Math.round(sumR)))
        const outputG = Math.max(0, Math.min(255, Math.round(sumG)))
        const outputB = Math.max(0, Math.min(255, Math.round(sumB)))

        const idx = (y * width + x) * 4
        result[idx] = outputR
        result[idx + 1] = outputG
        result[idx + 2] = outputB
        result[idx + 3] = data[idx + 3]

        processedCount++
      }
    }

    solutionSteps.push({
      description: `Step 3: Convolution complete`,
      data: `Processed ${processedCount} pixels\nApplied kernel to entire image\nValues clamped to [0, 255] range`
    })

    // Create result image
    const processedData = new ImageData(result, width, height)
    const processedCanvas = putImageData(canvas, processedData)
    
    if (convProcessedCanvasRef.current) {
      const ctx = convProcessedCanvasRef.current.getContext('2d')
      convProcessedCanvasRef.current.width = width
      convProcessedCanvasRef.current.height = height
      ctx.drawImage(processedCanvas, 0, 0)
    }

    solutionSteps.push({
      description: `Final Result:`,
      result: `Convolution applied successfully!`
    })

    setConvSteps(solutionSteps)
    setConvResult({
      kernelSize: kSize,
      kernelType: kernelType === 'custom' ? 'Custom' : predefinedKernels[kernelType].name,
      processedPixels: processedCount
    })
  }

  const loadPredefinedKernel = (type) => {
    setKernelType(type)
    if (predefinedKernels[type].kernel.length === 3) {
      setCustomKernel(predefinedKernels[type].kernel.map(row => [...row]))
      setKernelSize(3)
    }
  }

  return (
    <div className="section-content">
      <h1>🔧 Image Filtering & Restoration</h1>

      <section className="topic-card">
        <h2>Image Restoration</h2>
        <p>Process of recovering an image that has been degraded by noise, blur, or other distortions. The goal is to restore the image to its original quality.</p>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Convolution"
          formula="(f * g)(x, y) = Σ Σ f(i, j) × g(x-i, y-j)"
          explanation={
            <>
              <p>Mathematical operation used to apply filters to images. It involves sliding a kernel (filter) over the image and computing the sum of element-wise products.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>f:</strong> Input image</li>
                <li><strong>g:</strong> Kernel (filter mask)</li>
                <li><strong>(x, y):</strong> Output pixel coordinates</li>
                <li><strong>(i, j):</strong> Kernel coordinates</li>
              </ul>
              <p><strong>Process:</strong></p>
              <ol>
                <li>Place kernel over each pixel</li>
                <li>Multiply corresponding values</li>
                <li>Sum all products</li>
                <li>Place result at center pixel</li>
              </ol>
            </>
          }
        >
          <div className="info-box">
            <p>Convolution is the fundamental operation for applying filters. Use the interactive tool below to experiment with different kernels.</p>
          </div>
        </FormulaLayout>
      </section>

      {/* Interactive Convolution Tool */}
      <section className="topic-card">
        <h2>Interactive Convolution Tool</h2>
        <p>Upload an image and apply convolution with predefined or custom kernels to see how it works.</p>
        
        <div style={{ marginTop: '1.5rem' }}>
          <InputCard title="Upload Image">
            <div className="file-upload-area" onClick={() => convFileInputRef.current?.click()}>
              <input
                type="file"
                ref={convFileInputRef}
                accept="image/*"
                onChange={handleConvFileSelect}
                style={{ display: 'none' }}
              />
              <div>📷 Click to upload image</div>
              {convImage && (
                <div className="file-upload-text">
                  ✓ {convImage.width} × {convImage.height} pixels
                </div>
              )}
            </div>
          </InputCard>

          {convImage && (
            <>
              <InputCard title="Select Kernel">
                <div className="input-group">
                  <label>
                    Kernel Type:
                    <select
                      value={kernelType}
                      onChange={(e) => {
                        setKernelType(e.target.value)
                        if (e.target.value !== 'custom') {
                          loadPredefinedKernel(e.target.value)
                        }
                      }}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    >
                      <option value="custom">Custom Kernel</option>
                      {Object.keys(predefinedKernels).map(key => (
                        <option key={key} value={key}>
                          {predefinedKernels[key].name} - {predefinedKernels[key].description}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {kernelType === 'custom' && (
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Custom Kernel ({kernelSize}×{kernelSize}):
                    </label>
                    <div style={{ display: 'inline-block', border: '2px solid #e0e0e0', borderRadius: '4px', padding: '0.5rem' }}>
                      {customKernel.map((row, rowIdx) => (
                        <div key={rowIdx} style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                          {row.map((val, colIdx) => (
                            <input
                              key={colIdx}
                              type="number"
                              value={val}
                              onChange={(e) => updateCustomKernel(rowIdx, colIdx, e.target.value)}
                              style={{
                                width: '60px',
                                padding: '0.5rem',
                                textAlign: 'center',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                              }}
                              step="0.1"
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        onClick={() => {
                          const newSize = kernelSize === 3 ? 5 : 3
                          setKernelSize(newSize)
                          const newKernel = Array(newSize).fill(0).map(() => Array(newSize).fill(0))
                          newKernel[Math.floor(newSize/2)][Math.floor(newSize/2)] = 1
                          setCustomKernel(newKernel)
                        }}
                        style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}
                      >
                        {kernelSize === 3 ? 'Switch to 5×5' : 'Switch to 3×3'}
                      </button>
                      <button
                        onClick={() => {
                          const newKernel = Array(kernelSize).fill(0).map(() => Array(kernelSize).fill(0))
                          newKernel[Math.floor(kernelSize/2)][Math.floor(kernelSize/2)] = 1
                          setCustomKernel(newKernel)
                        }}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        Reset to Identity
                      </button>
                    </div>
                  </div>
                )}

                {kernelType !== 'custom' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
                    <p><strong>Selected:</strong> {predefinedKernels[kernelType].name}</p>
                    <p><strong>Description:</strong> {predefinedKernels[kernelType].description}</p>
                    <p><strong>Kernel:</strong></p>
                    <pre style={{ background: '#fff', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                      {predefinedKernels[kernelType].kernel.map(r => 
                        r.map(v => v.toString().padStart(6)).join(' ')
                      ).join('\n')}
                    </pre>
                  </div>
                )}
              </InputCard>

              <div style={{ marginTop: '1rem' }}>
                <button 
                  className="btn-primary" 
                  onClick={applyConvolution}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                >
                  Apply Convolution
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h4>Original Image</h4>
                  <canvas 
                    ref={convOriginalCanvasRef} 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '8px' 
                    }} 
                  />
                </div>
                {convResult && (
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <h4>Convolved Image</h4>
                    <canvas 
                      ref={convProcessedCanvasRef} 
                      style={{ 
                        maxWidth: '100%', 
                        height: 'auto', 
                        border: '2px solid #e0e0e0', 
                        borderRadius: '8px' 
                      }} 
                    />
                  </div>
                )}
              </div>

              {convSteps.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <StepByStepDisplay steps={convSteps} title="Convolution Steps" />
                </div>
              )}

              {convResult && (
                <OutputCard title="Convolution Results">
                  <div style={{ padding: '1rem' }}>
                    <p><strong>Kernel Type:</strong> {convResult.kernelType}</p>
                    <p><strong>Kernel Size:</strong> {convResult.kernelSize}×{convResult.kernelSize}</p>
                    <p><strong>Processed Pixels:</strong> {convResult.processedPixels}</p>
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '4px' }}>
                      <p><strong>Note:</strong> Convolution uses zero padding for edge pixels. The result shows how the kernel affects the image.</p>
                    </div>
                  </div>
                </OutputCard>
              )}
            </>
          )}
        </div>
      </section>

      <section className="topic-card">
        <h2>Padding</h2>
        <p>Technique to handle edge pixels during convolution. Common methods:</p>
        <ul>
          <li><strong>Zero Padding:</strong> Add zeros around the image</li>
          <li><strong>Replicate Padding:</strong> Duplicate edge pixels</li>
          <li><strong>Mirror Padding:</strong> Reflect edge pixels</li>
          <li><strong>Wrap Padding:</strong> Wrap around to opposite edge</li>
        </ul>
      </section>

      <section className="topic-card">
        <h2>Noise in Images</h2>
        <p>Unwanted random variations in pixel values that degrade image quality. Noise can occur during image acquisition, transmission, or storage.</p>
      </section>

      <section className="topic-card">
        <h2>Types of Noise</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Gaussian Noise</h3>
            <p>Also known as additive white Gaussian noise (AWGN). Characterized by a normal distribution with mean μ and variance σ².</p>
            <div className="formula">
              <p><strong>PDF:</strong> p(z) = (1/√(2πσ²)) × e^(-(z-μ)²/(2σ²))</p>
            </div>
            <p>Common in images due to sensor noise, electronic interference, etc.</p>
          </div>
          <div className="sub-topic">
            <h3>Salt-and-Pepper Noise</h3>
            <p>Also called impulse noise. Random pixels are set to either maximum (salt) or minimum (pepper) intensity values.</p>
            <p>Common in digital images due to transmission errors or faulty memory locations.</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Mean Filter (Averaging)"
          formula="g(x,y) = (1/k²) × Σ Σ f(x+i, y+j)"
          explanation={
            <>
              <p>Also known as averaging filter. Replaces each pixel with the average of its neighborhood.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>g(x,y):</strong> Output pixel value</li>
                <li><strong>f(x+i, y+j):</strong> Input pixel values in neighborhood</li>
                <li><strong>k:</strong> Kernel size (k×k)</li>
              </ul>
              <p><strong>Kernel (3×3):</strong></p>
              <pre style={{background: '#e8f0fe', padding: '0.5rem', borderRadius: '4px'}}>{`1/9  1/9  1/9
1/9  1/9  1/9
1/9  1/9  1/9`}</pre>
              <p><strong>Pros:</strong> Simple, effective for Gaussian noise</p>
              <p><strong>Cons:</strong> Blurs edges and fine details</p>
            </>
          }
        >
          <ImageProcessor availableFilters={[
            { name: 'mean', label: 'Apply Mean Filter', params: [
              { name: 'kernelSize', label: 'Kernel Size', default: 3, min: 3, max: 15, step: 2 }
            ]}
          ]} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Median Filter"
          formula="g(x,y) = median{f(x+i, y+j) | (i,j) ∈ neighborhood}"
          explanation={
            <>
              <p>Replaces each pixel with the median value of its neighborhood. Excellent for salt-and-pepper noise.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>g(x,y):</strong> Output pixel value</li>
                <li><strong>f(x+i, y+j):</strong> Input pixel values in neighborhood</li>
                <li><strong>median:</strong> Middle value after sorting</li>
              </ul>
              <p><strong>Algorithm:</strong></p>
              <ol>
                <li>Collect all pixel values in neighborhood</li>
                <li>Sort values in ascending order</li>
                <li>Select middle value (median)</li>
                <li>Replace center pixel with median</li>
              </ol>
              <p><strong>Pros:</strong> Preserves edges, effective for impulse noise</p>
              <p><strong>Cons:</strong> More computationally expensive than mean filter</p>
            </>
          }
        >
          <ImageProcessor availableFilters={[
            { name: 'median', label: 'Apply Median Filter', params: [
              { name: 'kernelSize', label: 'Kernel Size', default: 3, min: 3, max: 15, step: 2 }
            ]}
          ]} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <h2>Convolutional Filters</h2>
        <p>Various filters used for different purposes:</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Low-Pass Filter</h3>
            <p>Smooths images by removing high-frequency components. Examples: Mean filter, Gaussian filter.</p>
          </div>
          <div className="sub-topic">
            <h3>High-Pass Filter</h3>
            <p>Enhances edges and details by emphasizing high-frequency components. Examples: Laplacian, Sobel, Prewitt.</p>
          </div>
          <div className="sub-topic">
            <h3>Edge Detection Filters</h3>
            <ul>
              <li><strong>Sobel:</strong> Detects edges using gradient approximation</li>
              <li><strong>Prewitt:</strong> Similar to Sobel with different kernel</li>
              <li><strong>Laplacian:</strong> Second derivative operator for edge detection</li>
              <li><strong>Canny:</strong> Multi-stage edge detection algorithm</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Gaussian Noise"
          formula="p(z) = (1/√(2πσ²)) × e^(-(z-μ)²/(2σ²))"
          explanation={
            <>
              <p>Also known as additive white Gaussian noise (AWGN). Characterized by a normal distribution.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>p(z):</strong> Probability density function</li>
                <li><strong>μ:</strong> Mean (typically 0)</li>
                <li><strong>σ:</strong> Standard deviation</li>
                <li><strong>σ²:</strong> Variance</li>
              </ul>
              <p><strong>Effect:</strong> Adds random variations to pixel values, common in sensor noise.</p>
            </>
          }
        >
          <ImageProcessor availableFilters={[
            { name: 'gaussian-noise', label: 'Add Gaussian Noise', params: [
              { name: 'variance', label: 'Variance', default: 0.1, min: 0.01, max: 0.5, step: 0.01 }
            ]}
          ]} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Salt and Pepper Noise"
          formula="f'(x,y) = {255 (salt) or 0 (pepper) with probability p, f(x,y) otherwise}"
          explanation={
            <>
              <p>Also called impulse noise. Random pixels are set to either maximum (salt) or minimum (pepper) intensity values.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>f'(x,y):</strong> Noisy pixel value</li>
                <li><strong>f(x,y):</strong> Original pixel value</li>
                <li><strong>p:</strong> Probability of noise (typically 0.01-0.05)</li>
              </ul>
              <p><strong>Effect:</strong> Creates random white and black spots in the image.</p>
              <p><strong>Removal:</strong> Use median filter (very effective) or mean filter.</p>
            </>
          }
        >
          <ImageProcessor availableFilters={[
            { name: 'salt-pepper-noise', label: 'Add Salt & Pepper Noise', params: [
              { name: 'probability', label: 'Probability', default: 0.05, min: 0.01, max: 0.2, step: 0.01 }
            ]}
          ]} />
        </FormulaLayout>
      </section>
    </div>
  )
}

export default ImageFiltering

