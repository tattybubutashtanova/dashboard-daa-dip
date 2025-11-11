import FilterVisualizer from '../../components/DIP/FilterVisualizer'

function equalizeHistogram(imageData) {
  const width = imageData.width, height = imageData.height
  const src = imageData.data
  const gray = new Uint8Array(width * height)
  for (let i = 0, p = 0; i < src.length; i += 4, p++) {
    gray[p] = Math.round(0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2])
  }
  const hist = new Uint32Array(256)
  for (let i = 0; i < gray.length; i++) hist[gray[i]]++
  const cdf = new Uint32Array(256)
  let cum = 0
  for (let i = 0; i < 256; i++) { cum += hist[i]; cdf[i] = cum }
  const cdfMin = cdf.find(v => v > 0) || 0
  const total = width * height
  const map = new Uint8Array(256)
  for (let i = 0; i < 256; i++) {
    map[i] = Math.round(((cdf[i] - cdfMin) / (total - cdfMin)) * 255)
  }
  const out = new Uint8ClampedArray(src.length)
  for (let i = 0, p = 0; i < src.length; i += 4, p++) {
    const v = map[gray[p]]
    out[i] = out[i + 1] = out[i + 2] = v
    out[i + 3] = src[i + 3]
  }
  return new ImageData(out, width, height)
}

export default function HistogramEqualization() {
  return (
    <FilterVisualizer
      title="Histogram Equalization"
      formula="s_k = round((L-1) * Σ_{j=0..k} p(r_j))"
      explanation={<p>Stretches contrast by mapping cumulative histogram (CDF) to full intensity range.</p>}
      processImage={async (img) => {
        const result = equalizeHistogram(img)
        return { result, log: [
          { description: 'Compute histogram & CDF' },
          { description: 'Map intensities using normalized CDF' }
        ] }
      }}
    />
  )
}


