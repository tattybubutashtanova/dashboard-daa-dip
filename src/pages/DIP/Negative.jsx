import FilterVisualizer from '../../components/DIP/FilterVisualizer'
import { } from '../../utils/imageProcessing'

function negative(imageData) {
  const data = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }
  return new ImageData(data, imageData.width, imageData.height)
}

export default function Negative() {
  return (
    <FilterVisualizer
      title="Image Negative"
      formula="s = 255 - r"
      explanation={<p>Inverts intensities: bright becomes dark and vice versa.</p>}
      processImage={async (img) => {
        const result = negative(img)
        return { result, log: [{ description: 'Invert each channel', data: 's = 255 - r' }] }
      }}
    />
  )
}


