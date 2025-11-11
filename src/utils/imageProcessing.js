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
    const { h, s, v } = rgbToHsv(data[i], data[i + 1], data[i + 2])
    const transformed = c * Math.log(1 + v * 255)
    const newV = Math.min(255, transformed) / 255
    const { r, g, b } = hsvToRgb(h, s, newV)
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Power-Law (Gamma) Transformation: s = c * r^γ
 */
export function applyGammaTransform(imageData, gamma = 1.0, c = 1.0) {
  const data = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < data.length; i += 4) {
    const { h, s, v } = rgbToHsv(data[i], data[i + 1], data[i + 2])
    const newV = Math.min(1, c * Math.pow(v, gamma))
    const { r, g, b } = hsvToRgb(h, s, newV)
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Contrast Stretching
 */
export function applyContrastStretch(imageData) {
  const data = new Uint8ClampedArray(imageData.data)
  const pixels = data.length / 4
  const hsvValues = new Array(pixels)
  let minV = 1
  let maxV = 0

  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4
    const hsv = rgbToHsv(data[i], data[i + 1], data[i + 2])
    hsvValues[idx] = hsv
    if (hsv.v < minV) minV = hsv.v
    if (hsv.v > maxV) maxV = hsv.v
  }

  const range = maxV - minV || 1

  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4
    const { h, s, v } = hsvValues[idx]
    const newV = (v - minV) / range
    const { r, g, b } = hsvToRgb(h, s, newV)
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }

  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Histogram Equalization
 */
export function applyHistogramEqualization(imageData) {
  const data = new Uint8ClampedArray(imageData.data)
  const pixels = data.length / 4
  const hist = new Array(256).fill(0)
  const hsvValues = new Array(pixels)

  // Build histogram on V channel and store HSV values
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const { h, s, v } = rgbToHsv(r, g, b)
    hsvValues[pixelIndex] = { h, s, v }
    const vIdx = Math.min(255, Math.max(0, Math.round(v * 255)))
    hist[vIdx]++
  }

  // Calculate cumulative distribution
  const cdf = new Array(256)
  cdf[0] = hist[0]
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + hist[i]
  }

  const cdfMin = cdf.find(v => v > 0) || 0
  const denom = pixels - cdfMin || 1

  // Normalize CDF to [0, 255]
  for (let i = 0; i < 256; i++) {
    cdf[i] = Math.round(((cdf[i] - cdfMin) / denom) * 255)
  }

  // Apply equalization on V channel and convert back to RGB
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4
    const { h, s, v } = hsvValues[pixelIndex]
    const vIdx = Math.min(255, Math.max(0, Math.round(v * 255)))
    const newV = (cdf[vIdx] || 0) / 255
    const { r, g, b } = hsvToRgb(h, s, newV)
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }

  return new ImageData(data, imageData.width, imageData.height)
}

export function rgbToHsv(r, g, b) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6
    } else if (max === gn) {
      h = (bn - rn) / delta + 2
    } else {
      h = (rn - gn) / delta + 4
    }
    h *= 60
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : delta / max
  return { h, s, v: max }
}

export function hsvToRgb(h, s, v) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let rPrime = 0, gPrime = 0, bPrime = 0

  if (h >= 0 && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0
  } else if (h >= 60 && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0
  } else if (h >= 120 && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x
  } else if (h >= 180 && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c
  } else if (h >= 240 && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c
  } else {
    rPrime = c; gPrime = 0; bPrime = x
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255)
  }
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

