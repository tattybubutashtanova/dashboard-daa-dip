import FilterVisualizer from '../../components/DIP/FilterVisualizer'

function convolve3x3Gray(imageData, kernel) {
  const w = imageData.width, h = imageData.height
  const src = imageData.data
  const gray = new Uint8ClampedArray(w * h)
  for (let i = 0, p = 0; i < src.length; i += 4, p++) {
    gray[p] = Math.round(0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2])
  }
  const out = new Uint8ClampedArray(src.length)
  const k = kernel
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let sum = 0
      for (let j = -1; j <= 1; j++) {
        for (let i2 = -1; i2 <= 1; i2++) {
          sum += gray[(y + j) * w + (x + i2)] * k[j + 1][i2 + 1]
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

export default function Sharpen() {
  const kernel = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]]
  return (
    <FilterVisualizer
      title="Sharpen Filter"
      formula="g = f * K,  K = [[0,-1,0],[-1,5,-1],[0,-1,0]]"
      explanation={<p>Enhances edges and fine details via a sharpening convolution kernel.</p>}
      processImage={async (img) => {
        const result = convolve3x3Gray(img, kernel)
        return { result, log: [{ description: 'Convolution with sharpen kernel' }] }
      }}
    />
  )
}


