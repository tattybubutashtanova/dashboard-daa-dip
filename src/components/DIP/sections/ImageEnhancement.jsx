import '../../shared/SectionStyles.css'
import ImageProcessor from '../ImageProcessor'
import FormulaLayout from '../../shared/FormulaLayout'

const enhancementFilters = [
  { name: 'negative', label: 'Image Negative' },
  { name: 'log', label: 'Log Transformation', params: [
    { name: 'logC', label: 'Constant (c)', default: 45, min: 1, max: 100, step: 1 }
  ]},
  { name: 'gamma', label: 'Gamma Transformation', params: [
    { name: 'gamma', label: 'Gamma (γ)', default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
    { name: 'gammaC', label: 'Constant (c)', default: 1.0, min: 0.1, max: 2.0, step: 0.1 }
  ]},
  { name: 'contrast', label: 'Contrast Stretching' },
  { name: 'histogram', label: 'Histogram Equalization' }
]

function ImageEnhancement() {
  return (
    <div className="section-content">
      <h1>🎨 Image Enhancement Operations</h1>

      <section className="topic-card">
        <h2>Types of Image Enhancement</h2>
        <p>Image enhancement techniques improve the visual quality of images or make certain features more visible. They can be classified into:</p>
        <ul>
          <li><strong>Spatial Domain:</strong> Direct manipulation of pixel values</li>
          <li><strong>Frequency Domain:</strong> Manipulation of Fourier transform coefficients</li>
        </ul>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Image Negative"
          formula="s = L - 1 - r"
          explanation={
            <>
              <p>Inverts the intensity values of an image. Useful for enhancing white or gray detail embedded in dark regions.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>s:</strong> Output pixel value</li>
                <li><strong>L:</strong> Maximum gray level (typically 255)</li>
                <li><strong>r:</strong> Input pixel value</li>
              </ul>
            </>
          }
        >
          <ImageProcessor availableFilters={[{ name: 'negative', label: 'Apply Image Negative' }]} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Log Transformation"
          formula="s = c × log(1 + r)"
          explanation={
            <>
              <p>Compresses the dynamic range of images with large variations in pixel values. Useful for displaying Fourier spectra.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>s:</strong> Output pixel value</li>
                <li><strong>c:</strong> Scaling constant (typically 45)</li>
                <li><strong>r:</strong> Input pixel value (normalized to 0-1)</li>
              </ul>
              <p><strong>Effect:</strong> Expands dark pixels and compresses bright pixels.</p>
            </>
          }
        >
          <ImageProcessor availableFilters={[
            { name: 'log', label: 'Apply Log Transformation', params: [
              { name: 'logC', label: 'Constant (c)', default: 45, min: 1, max: 100, step: 1 }
            ]}
          ]} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Power-Law (Gamma) Transformation"
          formula="s = c × r^γ"
          explanation={
            <>
              <p>Also known as gamma correction. Used to adjust image brightness and contrast.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>s:</strong> Output pixel value</li>
                <li><strong>c:</strong> Scaling constant (typically 1.0)</li>
                <li><strong>r:</strong> Input pixel value (normalized to 0-1)</li>
                <li><strong>γ (gamma):</strong> Transformation parameter</li>
              </ul>
              <p><strong>Effects:</strong></p>
              <ul>
                <li>γ &lt; 1: Brightens the image</li>
                <li>γ = 1: No change</li>
                <li>γ &gt; 1: Darkens the image</li>
              </ul>
            </>
          }
        >
          <ImageProcessor availableFilters={[
            { name: 'gamma', label: 'Apply Gamma Transformation', params: [
              { name: 'gamma', label: 'Gamma (γ)', default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
              { name: 'gammaC', label: 'Constant (c)', default: 1.0, min: 0.1, max: 2.0, step: 0.1 }
            ]}
          ]} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Contrast Stretching"
          formula="s = (r - r_min) × (L-1) / (r_max - r_min)"
          explanation={
            <>
              <p>Expands the range of intensity levels in an image to utilize the full dynamic range.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>s:</strong> Output pixel value</li>
                <li><strong>r:</strong> Input pixel value</li>
                <li><strong>r_min:</strong> Minimum intensity in input image</li>
                <li><strong>r_max:</strong> Maximum intensity in input image</li>
                <li><strong>L:</strong> Maximum gray level (typically 255)</li>
              </ul>
              <p><strong>Effect:</strong> Maps the input range [r_min, r_max] to the full output range [0, L-1], enhancing contrast.</p>
            </>
          }
        >
          <ImageProcessor availableFilters={[{ name: 'contrast', label: 'Apply Contrast Stretching' }]} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <h2>Min–Max Matching</h2>
        <p>Normalizes pixel values to a specific range, typically [0, 255]. Useful for standardizing images.</p>
        <div className="formula">
          <p><strong>Formula:</strong> s = (r - min) × (new_max - new_min) / (max - min) + new_min</p>
        </div>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Histogram Equalization"
          formula="s_k = T(r_k) = (L-1) × Σ(j=0 to k) n_j / n"
          explanation={
            <>
              <p>Redistributes pixel intensities to achieve a uniform distribution, enhancing contrast automatically.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>s_k:</strong> Output intensity level k</li>
                <li><strong>T(r_k):</strong> Transformation function</li>
                <li><strong>L:</strong> Maximum gray level (typically 255)</li>
                <li><strong>n_j:</strong> Number of pixels with intensity j</li>
                <li><strong>n:</strong> Total number of pixels</li>
              </ul>
              <p><strong>Algorithm Steps:</strong></p>
              <ol>
                <li>Calculate histogram of input image</li>
                <li>Compute cumulative distribution function (CDF)</li>
                <li>Normalize CDF to [0, L-1] range</li>
                <li>Map each pixel using normalized CDF</li>
              </ol>
              <p><strong>Benefits:</strong> Automatic contrast enhancement, works well for images with low contrast.</p>
            </>
          }
        >
          <ImageProcessor availableFilters={[{ name: 'histogram', label: 'Apply Histogram Equalization' }]} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <h2>Histogram Matching</h2>
        <p>Also known as histogram specification. Transforms an image so that its histogram matches a specified histogram.</p>
        <p><strong>Steps:</strong></p>
        <ol>
          <li>Compute histogram of input image</li>
          <li>Compute cumulative distribution function (CDF) of input</li>
          <li>Compute CDF of desired histogram</li>
          <li>Map input intensities to output intensities using the CDFs</li>
        </ol>
      </section>

    </div>
  )
}

export default ImageEnhancement

