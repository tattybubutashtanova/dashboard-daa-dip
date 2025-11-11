import { useMemo, useRef, useState } from 'react'
import FilterVisualizer from '../../components/DIP/FilterVisualizer'
import OutputCard from '../../components/shared/OutputCard'
import { loadImageFromFile, imageToCanvas, getImageData, rgbToHsv, hsvToRgb } from '../../utils/imageProcessing'

function computeCDF(gray) {
  const hist = new Uint32Array(256)
  for (let i = 0; i < gray.length; i++) hist[gray[i]]++
  const cdf = new Float32Array(256)
  let cum = 0
  const total = gray.length
  for (let i = 0; i < 256; i++) {
    cum += hist[i]
    cdf[i] = cum / total
  }
  return cdf
}

function toGrayArray(imageData) {
  const src = imageData.data
  const gray = new Uint8Array(imageData.width * imageData.height)
  for (let i = 0, p = 0; i < src.length; i += 4, p++) {
    gray[p] = Math.round(0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2])
  }
  return gray
}

function matchHistogram(srcImg, targetImg) {
  const srcGray = toGrayArray(srcImg)
  const tarGray = toGrayArray(targetImg)
  const cdfS = computeCDF(srcGray)
  const cdfT = computeCDF(tarGray)
  const map = new Uint8Array(256)
  for (let i = 0; i < 256; i++) {
    const val = cdfS[i]
    let j = 0
    for (; j < 256; j++) {
      if (cdfT[j] >= val) break
    }
    map[i] = j
  }
  const matched = new Uint8ClampedArray(srcImg.data.length)
  const equalized = new Uint8ClampedArray(srcImg.data.length)
  const eqHist = new Uint32Array(256)
  for (let i = 0, p = 0; i < srcImg.data.length; i += 4, p++) {
    const r = srcImg.data[i]
    const g = srcImg.data[i + 1]
    const b = srcImg.data[i + 2]
    const a = srcImg.data[i + 3]
    const { h, s } = rgbToHsv(r, g, b)

    const matchVal = map[srcGray[p]] / 255
    const { r: mr, g: mg, b: mb } = hsvToRgb(h, s, matchVal)
    matched[i] = mr
    matched[i + 1] = mg
    matched[i + 2] = mb
    matched[i + 3] = a

    const eqNorm = cdfS[srcGray[p]]
    const { r: er, g: eg, b: eb } = hsvToRgb(h, s, eqNorm)
    equalized[i] = er
    equalized[i + 1] = eg
    equalized[i + 2] = eb
    equalized[i + 3] = a

    const eqIdx = Math.min(255, Math.max(0, Math.round(eqNorm * 255)))
    eqHist[eqIdx]++
  }
  return {
    matchedImage: new ImageData(matched, srcImg.width, srcImg.height),
    equalizedImage: new ImageData(equalized, srcImg.width, srcImg.height),
    cdfS,
    cdfT,
    map,
    eqHist,
  }
}

export default function HistogramMatching() {
  const [targetImage, setTargetImage] = useState(null)
  const targetInputRef = useRef(null)
  const [vizData, setVizData] = useState(null) // { srcHist, tarHist, eqHist, cdfS, cdfT, map }
  const [equalizedCanvas, setEqualizedCanvas] = useState(null)

  const equalizedPreview = useMemo(
    () => (equalizedCanvas ? equalizedCanvas.toDataURL('image/png') : null),
    [equalizedCanvas]
  )

  const extraInputs = (
    <div className="input-group">
      <label>Target Image</label>
      <div className="file-upload-area" onClick={() => targetInputRef.current?.click()}>
        <input
          type="file"
          ref={targetInputRef}
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0]
            if (!file) return
            const img = await loadImageFromFile(file)
            setTargetImage(img)
          }}
        />
        <div>Upload Target Image</div>
      </div>
      {targetImage && <div className="file-upload-text">✓ {targetImage.width} × {targetImage.height}</div>}
    </div>
  )

  return (
    <FilterVisualizer
      title="Histogram Matching"
      formula="Find g s.t. CDF_f(f) ≈ CDF_t(g)"
      explanation={<p>Transforms source image to have a histogram similar to a target image by matching their CDFs.</p>}
      extraInputs={extraInputs}
      processImage={async (srcImg) => {
        if (!targetImage) {
          setVizData(null)
          setEqualizedCanvas(null)
          return { result: srcImg, log: [{ description: 'Please upload a target image' }] }
        }
        const tarCanvas = imageToCanvas(targetImage)
        const tarData = getImageData(tarCanvas)
        // Compute histograms for source and target (grayscale)
        const srcGray = toGrayArray(srcImg)
        const tarGray = toGrayArray(tarData)
        const srcHist = new Uint32Array(256)
        const tarHist = new Uint32Array(256)
        for (let i = 0; i < srcGray.length; i++) srcHist[srcGray[i]]++
        for (let i = 0; i < tarGray.length; i++) tarHist[tarGray[i]]++

        const { matchedImage, equalizedImage, cdfS, cdfT, map, eqHist } = matchHistogram(srcImg, tarData)

        const eqCanvas = document.createElement('canvas')
        eqCanvas.width = equalizedImage.width
        eqCanvas.height = equalizedImage.height
        eqCanvas.getContext('2d').putImageData(equalizedImage, 0, 0)
        setEqualizedCanvas(eqCanvas)

        setVizData({
          srcHist: Array.from(srcHist),
          tarHist: Array.from(tarHist),
          eqHist: Array.from(eqHist),
          cdfS: Array.from(cdfS),
          cdfT: Array.from(cdfT),
          map: Array.from(map),
        })
        return {
          result: matchedImage,
          log: [{ description: 'Computed source/target CDFs, equalized source, and applied intensity mapping' }],
        }
      }}
      extraOutputAboveProcessed={({ image }) => {
        if (!image || !targetImage) return null
        return (
          <OutputCard title="Source & Target Images">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <figure style={{ flex: '1 1 260px', margin: 0 }}>
                <img src={image.src} alt="Source" style={{ width: '100%', borderRadius: 8 }} />
                <figcaption style={{ marginTop: 8, textAlign: 'center', fontWeight: 600 }}>Source Image</figcaption>
              </figure>
              <figure style={{ flex: '1 1 260px', margin: 0 }}>
                <img src={targetImage.src} alt="Target" style={{ width: '100%', borderRadius: 8 }} />
                <figcaption style={{ marginTop: 8, textAlign: 'center', fontWeight: 600 }}>Target Image</figcaption>
              </figure>
            </div>
          </OutputCard>
        )
      }}
      extraOutput={({ image, processed }) => {
        if (!vizData || !processed) return null
        const matchedPreview = typeof processed.toDataURL === 'function' ? processed.toDataURL('image/png') : null
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matchedPreview && (
              <OutputCard title="Histogram-Matched Result">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={matchedPreview} alt="Histogram Matched" style={{ maxWidth: '100%', borderRadius: 8 }} />
                </div>
              </OutputCard>
            )}
            {equalizedPreview && (
              <OutputCard title="Histogram Equalized Source">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={equalizedPreview} alt="Histogram Equalized Source" style={{ maxWidth: '100%', borderRadius: 8 }} />
                </div>
              </OutputCard>
            )}
            <OutputCard title="Histograms, CDFs, and Mapping">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0' }}>Source vs Target Histograms</h4>
                  <HistogramChart histA={vizData.srcHist} histB={vizData.tarHist} labelA="Source" labelB="Target" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 8px 0' }}>Source vs Equalized Histograms</h4>
                  <HistogramChart histA={vizData.srcHist} histB={vizData.eqHist} labelA="Source" labelB="Equalized" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 8px 0' }}>Source vs Target CDFs</h4>
                  <CDFChart cdfA={vizData.cdfS} cdfB={vizData.cdfT} labelA="Source" labelB="Target" />
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <h4 style={{ margin: '8px 0' }}>Intensity Mapping (Source → Target)</h4>
                  <MappingChart map={vizData.map} />
                </div>
              </div>
            </OutputCard>
          </div>
        )
      }}
    />
  )
}

function HistogramChart({ histA, histB, labelA = 'A', labelB = 'B', width = 420, height = 160 }) {
  const maxCount = Math.max(1, ...histA, ...histB)
  const barW = width / 256
  return (
    <svg width={width} height={height} style={{ background: '#fafafa', borderRadius: 8 }}>
      {[...Array(256)].map((_, i) => {
        const hA = (histA[i] / maxCount) * (height - 20)
        const hB = (histB[i] / maxCount) * (height - 20)
        return (
          <g key={i}>
            <rect x={i * barW} y={height - hA} width={barW / 2} height={hA} fill="#3b82f6" opacity={0.6} />
            <rect x={i * barW + barW / 2} y={height - hB} width={barW / 2} height={hB} fill="#ef4444" opacity={0.6} />
          </g>
        )
      })}
      <text x={8} y={14} fill="#374151" fontSize="12">{labelA} (blue) vs {labelB} (red)</text>
    </svg>
  )
}

function CDFChart({ cdfA, cdfB, labelA = 'A', labelB = 'B', width = 420, height = 160 }) {
  const pathFromCDF = (cdf, color) => {
    const points = cdf.map((v, i) => {
      const x = (i / 255) * (width - 20) + 10
      const y = height - 10 - v * (height - 20)
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    }).join(' ')
    return <path d={points} stroke={color} strokeWidth="2" fill="none" />
  }
  return (
    <svg width={width} height={height} style={{ background: '#fafafa', borderRadius: 8 }}>
      {pathFromCDF(cdfA, '#3b82f6')}
      {pathFromCDF(cdfB, '#ef4444')}
      <text x={8} y={14} fill="#374151" fontSize="12">{labelA} (blue) vs {labelB} (red)</text>
    </svg>
  )
}

function MappingChart({ map, width = 860, height = 180 }) {
  const points = map.map((y, x) => {
    const px = (x / 255) * (width - 20) + 10
    const py = height - 10 - (y / 255) * (height - 20)
    return `${x === 0 ? 'M' : 'L'}${px},${py}`
  }).join(' ')
  return (
    <svg width={width} height={height} style={{ background: '#fafafa', borderRadius: 8 }}>
      <path d={points} stroke="#10b981" strokeWidth="2" fill="none" />
      <text x={8} y={14} fill="#374151" fontSize="12">Mapping function</text>
      <line x1={10} y1={height - 10} x2={width - 10} y2={height - 10} stroke="#ddd" />
      <line x1={10} y1={10} x2={10} y2={height - 10} stroke="#ddd" />
    </svg>
  )
}


