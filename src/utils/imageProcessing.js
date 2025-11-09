// Image Processing Utilities

/**
 * Convert image to canvas
 */
export function imageToCanvas(image) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  return canvas
}

/**
 * Get image data from canvas
 */
export function getImageData(canvas) {
  const ctx = canvas.getContext('2d')
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

/**
 * Put image data to canvas
 */
export function putImageData(canvas, imageData) {
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

/**
 * Image Negative
 */
export function applyNegative(imageData) {
  const data = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]       // R
    data[i + 1] = 255 - data[i + 1] // G
    data[i + 2] = 255 - data[i + 2] // B
    // Alpha channel (i + 3) remains unchanged
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Log Transformation: s = c * log(1 + r)
 */
export function applyLogTransform(imageData, c = 45) {
  const data = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255
    const s = c * Math.log(1 + r)
    data[i] = Math.min(255, s * 255)
    data[i + 1] = Math.min(255, s * 255)
    data[i + 2] = Math.min(255, s * 255)
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Power-Law (Gamma) Transformation: s = c * r^γ
 */
export function applyGammaTransform(imageData, gamma = 1.0, c = 1.0) {
  const data = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255
    const s = c * Math.pow(r, gamma)
    data[i] = Math.min(255, s * 255)
    data[i + 1] = Math.min(255, s * 255)
    data[i + 2] = Math.min(255, s * 255)
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Contrast Stretching
 */
export function applyContrastStretch(imageData) {
  const data = new Uint8ClampedArray(imageData.data)
  
  // Find min and max
  let min = 255, max = 0
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    min = Math.min(min, gray)
    max = Math.max(max, gray)
  }
  
  // Apply stretching: s = (r - r_min) * (L-1) / (r_max - r_min)
  const L = 255
  const range = max - min || 1
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    const stretched = ((gray - min) * (L - 1)) / range
    data[i] = stretched
    data[i + 1] = stretched
    data[i + 2] = stretched
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Histogram Equalization
 */
export function applyHistogramEqualization(imageData) {
  const data = new Uint8ClampedArray(imageData.data)
  const hist = new Array(256).fill(0)
  const pixels = data.length / 4
  
  // Calculate histogram
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    hist[gray]++
  }
  
  // Calculate cumulative distribution
  const cdf = new Array(256)
  cdf[0] = hist[0]
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + hist[i]
  }
  
  // Normalize CDF
  const cdfMin = cdf.find(v => v > 0)
  for (let i = 0; i < 256; i++) {
    cdf[i] = Math.round(((cdf[i] - cdfMin) / (pixels - cdfMin)) * 255)
  }
  
  // Apply transformation
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    const newGray = cdf[gray]
    data[i] = newGray
    data[i + 1] = newGray
    data[i + 2] = newGray
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Mean Filter (Averaging)
 */
export function applyMeanFilter(imageData, kernelSize = 3) {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height
  const result = new Uint8ClampedArray(data.length)
  const radius = Math.floor(kernelSize / 2)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sumR = 0, sumG = 0, sumB = 0, count = 0
      
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const px = x + kx
          const py = y + ky
          
          if (px >= 0 && px < width && py >= 0 && py < height) {
            const idx = (py * width + px) * 4
            sumR += data[idx]
            sumG += data[idx + 1]
            sumB += data[idx + 2]
            count++
          }
        }
      }
      
      const idx = (y * width + x) * 4
      result[idx] = sumR / count
      result[idx + 1] = sumG / count
      result[idx + 2] = sumB / count
      result[idx + 3] = data[idx + 3]
    }
  }
  return new ImageData(result, width, height)
}

/**
 * Median Filter
 */
export function applyMedianFilter(imageData, kernelSize = 3) {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height
  const result = new Uint8ClampedArray(data.length)
  const radius = Math.floor(kernelSize / 2)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rValues = [], gValues = [], bValues = []
      
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const px = x + kx
          const py = y + ky
          
          if (px >= 0 && px < width && py >= 0 && py < height) {
            const idx = (py * width + px) * 4
            rValues.push(data[idx])
            gValues.push(data[idx + 1])
            bValues.push(data[idx + 2])
          }
        }
      }
      
      // Sort and get median
      rValues.sort((a, b) => a - b)
      gValues.sort((a, b) => a - b)
      bValues.sort((a, b) => a - b)
      
      const mid = Math.floor(rValues.length / 2)
      const idx = (y * width + x) * 4
      result[idx] = rValues[mid]
      result[idx + 1] = gValues[mid]
      result[idx + 2] = bValues[mid]
      result[idx + 3] = data[idx + 3]
    }
  }
  return new ImageData(result, width, height)
}

/**
 * Add Gaussian Noise
 */
export function addGaussianNoise(imageData, variance = 0.1) {
  const data = new Uint8ClampedArray(imageData.data)
  const stdDev = Math.sqrt(variance) * 255
  
  for (let i = 0; i < data.length; i += 4) {
    const noiseR = gaussianRandom() * stdDev
    const noiseG = gaussianRandom() * stdDev
    const noiseB = gaussianRandom() * stdDev
    
    data[i] = Math.max(0, Math.min(255, data[i] + noiseR))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noiseG))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noiseB))
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Add Salt and Pepper Noise
 */
export function addSaltPepperNoise(imageData, probability = 0.05) {
  const data = new Uint8ClampedArray(imageData.data)
  
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < probability) {
      const salt = Math.random() < 0.5
      data[i] = salt ? 255 : 0
      data[i + 1] = salt ? 255 : 0
      data[i + 2] = salt ? 255 : 0
    }
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Gaussian random number generator (Box-Muller transform)
 */
function gaussianRandom() {
  if (gaussianRandom.spare !== undefined) {
    const temp = gaussianRandom.spare
    gaussianRandom.spare = undefined
    return temp
  }
  
  const u1 = Math.random()
  const u2 = Math.random()
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2)
  
  gaussianRandom.spare = z1
  return z0
}

/**
 * Load image from file
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

