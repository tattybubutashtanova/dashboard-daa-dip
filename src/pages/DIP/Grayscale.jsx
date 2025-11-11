import FilterVisualizer from '../../components/DIP/FilterVisualizer'

function toGrayscale(imageData) {
  const data = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    data[i] = gray; data[i + 1] = gray; data[i + 2] = gray
  }
  return new ImageData(data, imageData.width, imageData.height)
}

export default function Grayscale() {
  return (
    <FilterVisualizer
      title="Grayscale Filter"
      formula="Y = 0.299 R + 0.587 G + 0.114 B"
      explanation={<p>Converts each pixel to luminance using a weighted sum of RGB channels.</p>}
      processImage={async (img) => {
        const result = toGrayscale(img)
        return { result, log: [{ description: 'Apply luminance formula', data: 'Y = 0.299R + 0.587G + 0.114B' }] }
      }}
    />
  )
}


