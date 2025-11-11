import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>🧠 DAA & DIP</h1>
        <p>Learning Dashboard</p>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">DAA – Algorithms</div>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/daa/knapsack">
              0/1 Knapsack
            </NavLink>
          </li>
          <li>
            <NavLink to="/daa/huffman">
              Huffman Coding
            </NavLink>
          </li>
          <li>
            <NavLink to="/daa/arithmetic">
              Arithmetic Encoding
            </NavLink>
          </li>
          <li>
            <NavLink to="/daa/coin-change">
              Coin Changing
            </NavLink>
          </li>
          <li>
            <NavLink to="/daa/tsp">
              TSP (Branch & Bound)
            </NavLink>
          </li>
          <li>
            <NavLink to="/daa/dijkstra">
              Dijkstra's Algorithm
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">DIP – Image Filters</div>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/dip/grayscale">
              Grayscale
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/negative">
              Negative
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/histogram">
              Histogram Equalization
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/hist-match">
              Histogram Matching
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/brightness">
              Brightness & Contrast
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/blur">
              Blur
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/edge">
              Edge Detection
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/threshold">
              Threshold
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/sharpen">
              Sharpen
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/convolution">
              Convolution
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/channels">
              Separate Channels
            </NavLink>
          </li>
          <li>
            <NavLink to="/dip/lecture1">
              Sampling & Quantization
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">AI – Neural Networks</div>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/ai/ann">
              ANN Visualizer
            </NavLink>
          </li>
          <li>
            <NavLink to="/ai/cnn">
              CNN Visualizer
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar

