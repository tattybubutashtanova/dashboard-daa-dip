import { useState } from 'react'
import FilterVisualizer from '../../components/DIP/FilterVisualizer'

function convolveCustom(imageData, kernel) {
  const n = kernel.length
  const r = Math.floor(n / 2)
  const w = imageData.width, h = imageData.height
  const src = imageData.data
  const gray = new Uint8ClampedArray(w * h)
  for (let i = 0, p = 0; i < src.length; i += 4, p++) {
    gray[p] = Math.round(0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2])
  }
  const out = new Uint8ClampedArray(src.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0
      for (let j = -r; j <= r; j++) {
        for (let i2 = -r; i2 <= r; i2++) {
          const yy = Math.min(h - 1, Math.max(0, y + j))
          const xx = Math.min(w - 1, Math.max(0, x + i2))
          sum += gray[yy * w + xx] * kernel[j + r][i2 + r]
        }
      }
      const v = Math.max(0, Math.min(255, Math.round(sum)))
      const idx = (y * w + x) * 4
      out[idx] = out[idx + 1] = out[idx + 2] = v
      out[idx + 3] = src[idx + 3]
    }
  }
  return new ImageData(out, w, h)
}

export default function Convolution() {
  const [kernel, setKernel] = useState([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
  return (
    <FilterVisualizer
      title="Convolution"
      formula="(f * g)(x,y) = Σ Σ f(i,j)·g(x-i,y-j)"
      explanation={<p>Apply a custom convolution kernel to the image (grayscale).</p>}
      initialParams={{}}
      controls={({}) => (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gap: 6 }}>
            {kernel.map((row, i) => row.map((v, j) => (
              <input
                key={`${i}-${j}`}
                type="number"
                step="0.1"
                value={v}
                onChange={(e) => {
                  const k = kernel.map(r => r.slice())
                  k[i][j] = parseFloat(e.target.value) || 0
                  setKernel(k)
                }}
              />
            )))}
          </div>
        </div>
      )}
      processImage={async (img) => {
        const result = convolveCustom(img, kernel)
        return { result, log: [{ description: 'Apply custom kernel', data: kernel.map(r => r.join(' ')).join('\n') }] }
      }}
    />
  )
}


