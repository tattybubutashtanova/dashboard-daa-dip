import { useState } from 'react'
import FilterVisualizer from '../../components/DIP/FilterVisualizer'

function selectChannel(imageData, channel) {
  const data = new Uint8ClampedArray(imageData.data)
  const idxMap = { r: 0, g: 1, b: 2 }
  const keep = idxMap[channel] ?? 0
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i + keep]
    data[i] = data[i + 1] = data[i + 2] = v
  }
  return new ImageData(data, imageData.width, imageData.height)
}

export default function SeparateChannels() {
  const initial = { channel: 'r' }
  return (
    <FilterVisualizer
      title="Separate Channels"
      formula="Show a single channel as a grayscale image"
      explanation={<p>Select one of the RGB channels and view it in grayscale.</p>}
      initialParams={initial}
      controls={({ params, setParams }) => (
        <div className="input-group">
          <label>Channel</label>
          <select
            value={params.channel}
            onChange={(e) => setParams({ ...params, channel: e.target.value })}
          >
            <option value="r">Red</option>
            <option value="g">Green</option>
            <option value="b">Blue</option>
          </select>
        </div>
      )}
      processImage={async (img, p) => {
        const result = selectChannel(img, p.channel)
        return { result, log: [{ description: 'Extract channel', data: `Channel = ${p.channel.toUpperCase()}` }] }
      }}
    />
  )
}


