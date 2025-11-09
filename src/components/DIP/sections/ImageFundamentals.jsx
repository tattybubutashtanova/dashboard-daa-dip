import '../../shared/SectionStyles.css'

function ImageFundamentals() {
  return (
    <div className="section-content">
      <h1>📍 Image Fundamentals</h1>

      <section className="topic-card">
        <h2>What is an Image?</h2>
        <p>An image is a two-dimensional function f(x, y) where x and y are spatial coordinates, and the amplitude of f at any pair of coordinates (x, y) is called the intensity or gray level of the image at that point.</p>
      </section>

      <section className="topic-card">
        <h2>Representation of an Image</h2>
        <p>Images are represented as matrices or arrays where each element corresponds to a pixel value. The dimensions of the matrix represent the spatial resolution of the image.</p>
        <div className="code-block">
          <pre>{`// Image as a 2D array
image[height][width] = pixel_value`}</pre>
        </div>
      </section>

      <section className="topic-card">
        <h2>Types of Images</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Binary Image</h3>
            <p>Images with only two possible values: 0 (black) and 1 (white). Each pixel is represented by 1 bit.</p>
          </div>
          <div className="sub-topic">
            <h3>Grayscale Image</h3>
            <p>Images with intensity values ranging from 0 (black) to 255 (white). Typically 8 bits per pixel (256 gray levels).</p>
          </div>
          <div className="sub-topic">
            <h3>RGB Image</h3>
            <p>Color images with three channels: Red, Green, and Blue. Each channel has values from 0 to 255. Total: 24 bits per pixel.</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Image Sampling and Quantization</h2>
        <ul>
          <li><strong>Sampling:</strong> Digitizing the coordinate values (spatial resolution)</li>
          <li><strong>Quantization:</strong> Digitizing the amplitude values (gray levels)</li>
        </ul>
      </section>

      <section className="topic-card">
        <h2>Gray Levels</h2>
        <p>The number of distinct intensity values in an image. Common values: 256 (8-bit), 1024 (10-bit), 4096 (12-bit).</p>
      </section>

      <section className="topic-card">
        <h2>Spatial Resolution</h2>
        <p>The number of pixels per unit length. Higher resolution means more pixels, resulting in finer detail.</p>
      </section>

      <section className="topic-card">
        <h2>Relationship Between Pixels</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Neighborhoods</h3>
            <ul>
              <li><strong>N4 (4-neighbors):</strong> Top, bottom, left, right pixels</li>
              <li><strong>N8 (8-neighbors):</strong> All 8 surrounding pixels (including diagonals)</li>
              <li><strong>ND (Diagonal neighbors):</strong> Only diagonal pixels</li>
            </ul>
          </div>
          <div className="sub-topic">
            <h3>Adjacency</h3>
            <ul>
              <li><strong>N4 Adjacency:</strong> Connected via 4-neighborhood</li>
              <li><strong>N8 Adjacency:</strong> Connected via 8-neighborhood</li>
              <li><strong>Mixed Adjacency:</strong> Combination of N4 and N8</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Distances</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>N4 (City Block Distance)</h3>
            <p>D4(p, q) = |x1 - x2| + |y1 - y2|</p>
            <p>Also known as Manhattan distance. Only horizontal and vertical movements allowed.</p>
          </div>
          <div className="sub-topic">
            <h3>N8 (Chess Board Distance)</h3>
            <p>D8(p, q) = max(|x1 - x2|, |y1 - y2|)</p>
            <p>Allows diagonal movements, similar to a king's move in chess.</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Region, Boundary, and Edge</h2>
        <ul>
          <li><strong>Region:</strong> A connected set of pixels</li>
          <li><strong>Boundary:</strong> The set of pixels in a region that have neighbors outside the region</li>
          <li><strong>Edge:</strong> A local discontinuity in image intensity, often detected using gradient operators</li>
        </ul>
      </section>
    </div>
  )
}

export default ImageFundamentals

