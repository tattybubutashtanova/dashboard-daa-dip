import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <div className="home-section">
        <h2>Design and Analysis of Algorithms</h2>
        <div className="cards-grid">
          <Link to="/daa/knapsack" className="algorithm-card">
            <h3>0/1 Knapsack</h3>
            <p>Solve the classic knapsack problem using dynamic programming. Maximize value within weight constraints.</p>
          </Link>
          <Link to="/daa/huffman" className="algorithm-card">
            <h3>Huffman Coding</h3>
            <p>Variable-length encoding algorithm for lossless data compression. Optimal prefix code generation.</p>
          </Link>
          <Link to="/daa/coin-change" className="algorithm-card">
            <h3>Coin Changing</h3>
            <p>Find minimum coins to make change using greedy or dynamic programming approaches.</p>
          </Link>
          <Link to="/daa/tsp" className="algorithm-card">
            <h3>TSP (Branch & Bound)</h3>
            <p>Traveling Salesman Problem solved using branch and bound technique with optimal path finding.</p>
          </Link>
          <Link to="/daa/dijkstra" className="algorithm-card">
            <h3>Dijkstra's Algorithm</h3>
            <p>Find shortest paths from a source vertex to all other vertices in a weighted graph.</p>
          </Link>
        </div>
      </div>

      <div className="home-section">
        <h2>Digital Image Processing</h2>
        <div className="cards-grid">
          <Link to="/dip/grayscale" className="filter-card">
            <h3>Grayscale</h3>
            <p>Convert color images to grayscale using weighted average or luminance methods.</p>
          </Link>
          <Link to="/dip/histogram" className="filter-card">
            <h3>Histogram Equalization</h3>
            <p>Enhance image contrast by redistributing pixel intensities uniformly across the histogram.</p>
          </Link>
          <Link to="/dip/edge" className="filter-card">
            <h3>Edge Detection</h3>
            <p>Detect edges using Sobel, Prewitt, or Canny algorithms for feature extraction.</p>
          </Link>
          <Link to="/dip/sharpen" className="filter-card">
            <h3>Sharpen</h3>
            <p>Enhance image sharpness using unsharp masking or high-pass filtering techniques.</p>
          </Link>
          <Link to="/dip/lecture1" className="filter-card">
            <h3>Sampling & Quantization</h3>
            <p>Interactive demonstration of image sampling and quantization with adjustable parameters.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

