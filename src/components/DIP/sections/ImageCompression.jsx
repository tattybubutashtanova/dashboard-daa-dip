import { useState, useRef } from 'react'
import '../../shared/SectionStyles.css'
import InputCard from '../../shared/InputCard'
import OutputCard from '../../shared/OutputCard'
import StepByStepDisplay from '../../shared/StepByStepDisplay'
import { loadImageFromFile, imageToCanvas, getImageData, putImageData } from '../../../utils/imageProcessing'

function ImageCompression() {
  const [image, setImage] = useState(null)
  const [compressionMethod, setCompressionMethod] = useState('rle')
  const [rleResult, setRleResult] = useState(null)
  const [rleSteps, setRleSteps] = useState([])
  const [huffmanResult, setHuffmanResult] = useState(null)
  const [huffmanSteps, setHuffmanSteps] = useState([])
  const fileInputRef = useRef(null)
  const originalCanvasRef = useRef(null)
  const compressedCanvasRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const img = await loadImageFromFile(file)
      setImage(img)
      
      // Draw original image
      const canvas = imageToCanvas(img)
      if (originalCanvasRef.current) {
        const ctx = originalCanvasRef.current.getContext('2d')
        originalCanvasRef.current.width = canvas.width
        originalCanvasRef.current.height = canvas.height
        ctx.drawImage(canvas, 0, 0)
      }
      
      // Reset results
      setRleResult(null)
      setHuffmanResult(null)
      setRleSteps([])
      setHuffmanSteps([])
    } catch (error) {
      console.error('Error loading image:', error)
      alert('Error loading image. Please try again.')
    }
  }

  // Convert image to grayscale pixel array
  const imageToGrayscale = (imageData) => {
    const data = imageData.data
    const grayscale = []
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
      grayscale.push(gray)
    }
    return grayscale
  }

  // RLE Compression for image
  const compressRLE = () => {
    if (!image) {
      alert('Please upload an image first')
      return
    }

    const solutionSteps = []
    const canvas = imageToCanvas(image)
    const imageData = getImageData(canvas)
    const width = imageData.width
    const height = imageData.height

    solutionSteps.push({
      description: `Loaded image: ${width} × ${height} pixels`,
      data: `Total pixels: ${width * height}`
    })

    // Convert to grayscale
    const grayscale = imageToGrayscale(imageData)
    solutionSteps.push({
      description: `Step 1: Convert image to grayscale`,
      data: `Extracted ${grayscale.length} pixel values`
    })

    // Apply RLE encoding row by row
    let encoded = []
    let totalOriginalSize = 0
    let totalEncodedSize = 0
    let stepNum = 2

    for (let row = 0; row < height; row++) {
      const rowStart = row * width
      const rowPixels = grayscale.slice(rowStart, rowStart + width)
      
      let rowEncoded = []
      let i = 0
      
      while (i < rowPixels.length) {
        const pixel = rowPixels[i]
        let count = 1
        
        while (i + count < rowPixels.length && rowPixels[i + count] === pixel) {
          count++
        }
        
        rowEncoded.push({ count, value: pixel })
        i += count
      }
      
      encoded.push(rowEncoded)
      totalOriginalSize += rowPixels.length
      totalEncodedSize += rowEncoded.length * 2 // count + value
    }

    solutionSteps.push({
      description: `Step ${stepNum}: Apply RLE encoding row by row`,
      data: `Processed ${height} rows\nExample from first row: ${encoded[0].slice(0, 3).map(e => `${e.count}×${e.value}`).join(', ')}...`
    })

    // Calculate compression statistics
    const originalBits = totalOriginalSize * 8
    const encodedBits = totalEncodedSize * 8
    const compressionRatio = (originalBits / encodedBits).toFixed(2)
    const compressionPercent = ((1 - encodedBits / originalBits) * 100).toFixed(1)

    solutionSteps.push({
      description: `Step ${stepNum + 1}: Calculate compression statistics`,
      data: `Original size: ${totalOriginalSize} pixels (${originalBits} bits)\nEncoded size: ${totalEncodedSize} pairs (${encodedBits} bits)\nCompression ratio: ${compressionRatio}:1\nSpace saved: ${compressionPercent}%`
    })

    solutionSteps.push({
      description: `Final Result:`,
      result: `RLE compression complete! Compression ratio: ${compressionRatio}:1`
    })

    setRleSteps(solutionSteps)
    setRleResult({
      originalSize: totalOriginalSize,
      encodedSize: totalEncodedSize,
      originalBits,
      encodedBits,
      compressionRatio,
      compressionPercent,
      encoded
    })
  }

  // Huffman Compression for image
  const compressHuffman = () => {
    if (!image) {
      alert('Please upload an image first')
      return
    }

    const solutionSteps = []
    const canvas = imageToCanvas(image)
    const imageData = getImageData(canvas)
    const width = imageData.width
    const height = imageData.height

    solutionSteps.push({
      description: `Loaded image: ${width} × ${height} pixels`,
      data: `Total pixels: ${width * height}`
    })

    // Convert to grayscale
    const grayscale = imageToGrayscale(imageData)
    solutionSteps.push({
      description: `Step 1: Convert image to grayscale`,
      data: `Extracted ${grayscale.length} pixel values`
    })

    // Count frequencies
    const freq = {}
    for (const pixel of grayscale) {
      freq[pixel] = (freq[pixel] || 0) + 1
    }

    const uniquePixels = Object.keys(freq).length
    solutionSteps.push({
      description: `Step 2: Count frequency of each pixel value`,
      data: `Found ${uniquePixels} unique pixel values\nTop 5 most frequent:\n${Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([pixel, count]) => `  Pixel ${pixel}: ${count} times (${((count / grayscale.length) * 100).toFixed(1)}%)`)
        .join('\n')}`
    })

    // Create nodes
    const nodes = Object.entries(freq).map(([pixel, count]) => ({
      pixel: parseInt(pixel),
      freq: count,
      left: null,
      right: null
    }))

    solutionSteps.push({
      description: `Step 3: Create leaf nodes for each pixel value`,
      data: `Created ${nodes.length} leaf nodes`
    })

    // Build Huffman tree
    const tree = [...nodes]
    let stepNum = 4

    while (tree.length > 1) {
      tree.sort((a, b) => a.freq - b.freq)
      const left = tree.shift()
      const right = tree.shift()
      const merged = {
        pixel: null,
        freq: left.freq + right.freq,
        left,
        right
      }
      tree.push(merged)

      if (stepNum <= 6) {
        solutionSteps.push({
          description: `Step ${stepNum}: Merge two nodes with minimum frequencies`,
          data: `Left: ${left.pixel !== null ? `Pixel ${left.pixel}` : 'Internal'} (freq=${left.freq})\nRight: ${right.pixel !== null ? `Pixel ${right.pixel}` : 'Internal'} (freq=${right.freq})\nNew node: freq=${merged.freq}`,
          result: `Merged into internal node`
        })
      }
      stepNum++
    }

    if (stepNum > 7) {
      solutionSteps.push({
        description: `Step 4-${stepNum - 1}: Continue merging nodes...`,
        data: `Total merges: ${stepNum - 4}`
      })
    }

    // Generate codes
    const codes = {}
    const generateCodes = (node, code = '') => {
      if (!node.left && !node.right) {
        codes[node.pixel] = code
        return
      }
      if (node.left) generateCodes(node.left, code + '0')
      if (node.right) generateCodes(node.right, code + '1')
    }

    generateCodes(tree[0])

    const topCodes = Object.entries(codes)
      .sort((a, b) => freq[a[0]] - freq[b[0]])
      .reverse()
      .slice(0, 5)

    solutionSteps.push({
      description: `Step ${stepNum}: Assign codes (left=0, right=1)`,
      data: `Generated codes for ${Object.keys(codes).length} pixel values\nTop 5 codes:\n${topCodes.map(([pixel, code]) => `  Pixel ${pixel}: ${code} (freq=${freq[pixel]})`).join('\n')}`
    })

    // Encode
    const encoded = grayscale.map(pixel => codes[pixel]).join('')
    const originalBits = grayscale.length * 8
    const encodedBits = encoded.length
    const compressionRatio = (originalBits / encodedBits).toFixed(2)
    const compressionPercent = ((1 - encodedBits / originalBits) * 100).toFixed(1)
    const avgCodeLength = (encodedBits / grayscale.length).toFixed(2)

    solutionSteps.push({
      description: `Step ${stepNum + 1}: Encode all pixels`,
      data: `Original: ${grayscale.length} pixels × 8 bits = ${originalBits} bits\nEncoded: ${encodedBits} bits\nAverage code length: ${avgCodeLength} bits per pixel\nCompression ratio: ${compressionRatio}:1\nSpace saved: ${compressionPercent}%`
    })

    solutionSteps.push({
      description: `Final Result:`,
      result: `Huffman compression complete! Compression ratio: ${compressionRatio}:1`
    })

    setHuffmanSteps(solutionSteps)
    setHuffmanResult({
      codes,
      encoded,
      originalBits,
      encodedBits,
      compressionRatio,
      compressionPercent,
      avgCodeLength,
      totalPixels: grayscale.length
    })
  }

  const handleCompress = () => {
    if (compressionMethod === 'rle') {
      compressRLE()
    } else {
      compressHuffman()
    }
  }

  return (
    <div className="section-content">
      <h1>🧮 Image Compression & Encoding</h1>

      <section className="topic-card">
        <h2>Compression Fundamentals</h2>
        <p>Image compression reduces the number of bits required to represent an image while maintaining acceptable image quality.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Lossless Compression</h3>
            <p>Original image can be perfectly reconstructed. Compression ratio: 2:1 to 5:1</p>
            <p><strong>Examples:</strong> RLE, Huffman, Arithmetic, LZW</p>
          </div>
          <div className="sub-topic">
            <h3>Lossy Compression</h3>
            <p>Some information is lost, but higher compression ratios (10:1 to 50:1) are achievable.</p>
            <p><strong>Examples:</strong> JPEG, MPEG, Wavelet compression</p>
          </div>
        </div>
        <div className="formula">
          <p><strong>Compression Ratio:</strong> CR = n1 / n2</p>
          <p>Where n1 = number of bits in original, n2 = number of bits in compressed</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Image Compression Tool</h2>
        <p>Upload an image and apply compression algorithms to see how they work on real image data.</p>
        
        <div style={{ marginTop: '1.5rem' }}>
          <InputCard title="Upload Image">
            <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div>📷 Click to upload image</div>
              {image && (
                <div className="file-upload-text">
                  ✓ {image.width} × {image.height} pixels
                </div>
              )}
            </div>
          </InputCard>

          {image && (
            <>
              <InputCard title="Select Compression Method">
                <div className="input-group">
                  <label>
                    Compression Algorithm:
                    <select
                      value={compressionMethod}
                      onChange={(e) => setCompressionMethod(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    >
                      <option value="rle">Run-Length Encoding (RLE)</option>
                      <option value="huffman">Huffman Encoding</option>
                    </select>
                  </label>
                </div>
              </InputCard>

              <div style={{ marginTop: '1rem' }}>
                <button 
                  className="btn-primary" 
                  onClick={handleCompress}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                >
                  Compress Image
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h4>Original Image</h4>
                  <canvas 
                    ref={originalCanvasRef} 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '8px' 
                    }} 
                  />
                </div>
              </div>
            </>
          )}

          {compressionMethod === 'rle' && rleSteps.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <StepByStepDisplay steps={rleSteps} title="RLE Compression Steps" />
            </div>
          )}

          {compressionMethod === 'huffman' && huffmanSteps.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <StepByStepDisplay steps={huffmanSteps} title="Huffman Compression Steps" />
            </div>
          )}

          {compressionMethod === 'rle' && rleResult && (
            <OutputCard title="RLE Compression Results">
              <div style={{ padding: '1rem' }}>
                <p><strong>Original Size:</strong> {rleResult.originalSize} pixels ({rleResult.originalBits} bits)</p>
                <p><strong>Encoded Size:</strong> {rleResult.encodedSize} pairs ({rleResult.encodedBits} bits)</p>
                <p><strong>Compression Ratio:</strong> {rleResult.compressionRatio}:1</p>
                <p><strong>Space Saved:</strong> {rleResult.compressionPercent}%</p>
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '4px' }}>
                  <p><strong>Note:</strong> RLE works best on images with large areas of constant intensity.</p>
                </div>
              </div>
            </OutputCard>
          )}

          {compressionMethod === 'huffman' && huffmanResult && (
            <OutputCard title="Huffman Compression Results">
              <div style={{ padding: '1rem' }}>
                <p><strong>Total Pixels:</strong> {huffmanResult.totalPixels}</p>
                <p><strong>Original Size:</strong> {huffmanResult.originalBits} bits</p>
                <p><strong>Encoded Size:</strong> {huffmanResult.encodedBits} bits</p>
                <p><strong>Average Code Length:</strong> {huffmanResult.avgCodeLength} bits per pixel</p>
                <p><strong>Compression Ratio:</strong> {huffmanResult.compressionRatio}:1</p>
                <p><strong>Space Saved:</strong> {huffmanResult.compressionPercent}%</p>
                <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto', padding: '0.5rem', background: '#f0f0f0', borderRadius: '4px' }}>
                  <p><strong>Sample Codes (Top 10):</strong></p>
                  {Object.entries(huffmanResult.codes)
                    .sort((a, b) => huffmanResult.codes[b[0]]?.length - huffmanResult.codes[a[0]]?.length)
                    .slice(0, 10)
                    .map(([pixel, code]) => (
                      <div key={pixel} style={{ marginBottom: '0.25rem' }}>
                        <strong>Pixel {pixel}:</strong> {code} ({code.length} bits)
                      </div>
                    ))}
                </div>
              </div>
            </OutputCard>
          )}
        </div>
      </section>

      <section className="topic-card">
        <h2>Run-Length Encoding (RLE)</h2>
        <p>Simple compression technique that replaces sequences of identical values with a count and the value.</p>
        <div className="example-box">
          <p><strong>Example:</strong></p>
          <p><strong>Original:</strong> AAAAABBBCCCCCC</p>
          <p><strong>Encoded:</strong> 5A3B6C</p>
          <p>Works best for images with large areas of constant intensity.</p>
        </div>
        <div className="algorithm-box">
          <h3>Algorithm:</h3>
          <ol>
            <li>Scan image row by row</li>
            <li>Count consecutive identical pixels</li>
            <li>Store (count, value) pairs</li>
            <li>Repeat until end of image</li>
          </ol>
        </div>
      </section>

      <section className="topic-card">
        <h2>Huffman Encoding</h2>
        <p>Variable-length encoding that assigns shorter codes to more frequent symbols. Optimal prefix code.</p>
        <div className="algorithm-box">
          <h3>Algorithm:</h3>
          <ol>
            <li>Count frequency of each symbol</li>
            <li>Build Huffman tree:
              <ul>
                <li>Create leaf nodes for each symbol with frequency</li>
                <li>Repeatedly merge two nodes with lowest frequencies</li>
                <li>Continue until one root node remains</li>
              </ul>
            </li>
            <li>Assign codes: left = 0, right = 1</li>
            <li>Encode symbols using their codes</li>
          </ol>
        </div>
        <div className="example-box">
          <p><strong>Example:</strong></p>
          <p>Symbols: A(50%), B(30%), C(15%), D(5%)</p>
          <p>Codes: A=0, B=10, C=110, D=111</p>
          <p>Average code length: 0.5×1 + 0.3×2 + 0.15×3 + 0.05×3 = 1.7 bits</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Arithmetic Encoding</h2>
        <p>More efficient than Huffman coding. Encodes entire message as a single fractional number between 0 and 1.</p>
        <div className="algorithm-box">
          <h3>Algorithm:</h3>
          <ol>
            <li>Divide interval [0, 1) based on symbol probabilities</li>
            <li>For each symbol:
              <ul>
                <li>Select sub-interval corresponding to symbol</li>
                <li>Subdivide that interval based on probabilities</li>
              </ul>
            </li>
            <li>Output any number within final interval</li>
          </ol>
        </div>
        <div className="example-box">
          <p><strong>Advantages:</strong></p>
          <ul>
            <li>Can achieve compression close to entropy limit</li>
            <li>Better compression than Huffman for skewed distributions</li>
            <li>Handles adaptive probabilities</li>
          </ul>
        </div>
      </section>

      <section className="topic-card">
        <h2>Compression Standards</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>JPEG</h3>
            <p>Lossy compression standard for images. Uses DCT (Discrete Cosine Transform) and quantization.</p>
            <p><strong>Steps:</strong> Color space conversion → DCT → Quantization → Entropy encoding</p>
          </div>
          <div className="sub-topic">
            <h3>PNG</h3>
            <p>Lossless compression using LZ77 and Huffman coding. Supports transparency and multiple color depths.</p>
          </div>
          <div className="sub-topic">
            <h3>GIF</h3>
            <p>Uses LZW compression. Limited to 256 colors, supports animation.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ImageCompression

