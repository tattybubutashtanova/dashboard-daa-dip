import FilterVisualizer from '../../components/DIP/FilterVisualizer'
import { useState } from 'react'

function thresholdImage(imageData, t) {
  const data = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    const v = gray >= t ? 255 : 0
    data[i] = data[i + 1] = data[i + 2] = v
  }
  return new ImageData(data, imageData.width, imageData.height)
}

export default function Threshold() {
  const initial = { t: 128 }
  return (
    <FilterVisualizer
      title="Threshold Filter"
      formula="g(x,y) = 255 if f(x,y) ≥ T, else 0"
      explanation={<p>Binarizes image by comparing pixel luminance against a threshold T.</p>}
      initialParams={initial}
      controls={({ params, setParams }) => (
        <div className="input-group">
          <label>Threshold (0-255)</label>
          <input
            type="number"
            min="0"
            max="255"
            step="1"
            value={params.t}
            onChange={(e) => setParams({ ...params, t: Math.max(0, Math.min(255, parseInt(e.target.value) || 0)) })}
          />
        </div>
      )}
      processImage={async (img, p) => {
        const result = thresholdImage(img, p.t)
        return { result, log: [{ description: 'Compute luminance & apply threshold', data: `T = ${p.t}` }] }
      }}
    />
  )
}


