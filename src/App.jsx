import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

// DAA Pages
import GreedyAlgorithms from './components/DAA/sections/GreedyAlgorithms'
import DynamicProgramming from './components/DAA/sections/DynamicProgramming'
import BranchAndBound from './components/DAA/sections/BranchAndBound'
import GeneticAlgorithm from './components/DAA/sections/GeneticAlgorithm'
import BruteForce from './components/DAA/sections/BruteForce'
import SupportingConcepts from './components/DAA/sections/SupportingConcepts'
import HuffmanSolver from './components/DAA/algorithms/HuffmanSolver'
import TSPSolver from './components/DAA/algorithms/TSPSolver'
import FormulaLayout from './components/shared/FormulaLayout'
import DijkstraVisualizer from './pages/DAA/DijkstraVisualizer'
import FloydWarshall from './pages/DAA/FloydWarshall'
import ImageSamplingQuantization from './pages/DIP/ImageSamplingQuantization'
import EdgeDetection from './pages/DIP/EdgeDetection'

// DIP Pages
import ImageFundamentals from './components/DIP/sections/ImageFundamentals'
import ImageEnhancement from './components/DIP/sections/ImageEnhancement'
import ImageFiltering from './components/DIP/sections/ImageFiltering'
import ImageCompression from './components/DIP/sections/ImageCompression'
import DeepLearningCNN from './components/DIP/sections/DeepLearningCNN'

// Get page title based on route
function getPageTitle(pathname) {
  const titles = {
    '/': 'Dashboard Home',
    '/daa/knapsack': '0/1 Knapsack Problem',
    '/daa/huffman': 'Huffman Coding',
    '/daa/arithmetic': 'Arithmetic Encoding',
    '/daa/coin-change': 'Coin Changing Problem',
    '/daa/tsp': 'Traveling Salesman Problem',
    '/dip/grayscale': 'Grayscale Conversion',
    '/dip/negative': 'Image Negative',
    '/dip/histogram': 'Histogram Equalization',
    '/dip/brightness': 'Brightness & Contrast',
    '/dip/blur': 'Blur Filter',
    '/dip/edge': 'Edge Detection',
    '/dip/threshold': 'Threshold',
    '/dip/lecture1': 'Sampling & Quantization',
    '/dip/sharpen': 'Sharpen Filter',
    '/dip/convolution': 'Convolution',
    '/dip/channels': 'Separate Channels',
  }
  return titles[pathname] || 'DAA & DIP Dashboard'
}

function getPageSubtitle(pathname) {
  if (pathname.startsWith('/daa')) {
    return 'Design and Analysis of Algorithms'
  } else if (pathname.startsWith('/dip')) {
    return 'Digital Image Processing'
  }
  return 'Interactive Learning Platform'
}

function App() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-container">
        <Navbar 
          title={getPageTitle(location.pathname)}
          subtitle={getPageSubtitle(location.pathname)}
        />
        <div className="content-area">
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* DAA Routes */}
            <Route path="/daa/knapsack" element={
              <div className="card">
                <DynamicProgramming />
              </div>
            } />
            <Route path="/daa/huffman" element={
              <div className="card">
                <FormulaLayout
                  title="Huffman Coding"
                  formula="Code length inversely proportional to frequency"
                  explanation={
                    <>
                      <p>Variable-length encoding that assigns shorter codes to frequent characters.</p>
                      <p><strong>Algorithm:</strong></p>
                      <ol>
                        <li>Count frequency of each character</li>
                        <li>Create min-heap with character frequencies</li>
                        <li>Repeatedly merge two nodes with minimum frequency</li>
                        <li>Build Huffman tree</li>
                        <li>Assign codes: left=0, right=1</li>
                      </ol>
                    </>
                  }
                >
                  <HuffmanSolver />
                </FormulaLayout>
              </div>
            } />
            <Route path="/daa/arithmetic" element={
              <div className="card">
                <ImageCompression />
              </div>
            } />
            <Route path="/daa/coin-change" element={
              <div className="card">
                <GreedyAlgorithms />
              </div>
            } />
            <Route path="/daa/dijkstra" element={
              <div className="card">
                <DijkstraVisualizer />
              </div>
            } />
            <Route path="/daa/tsp" element={
              <div className="card">
                <FormulaLayout
                  title="Traveling Salesman Problem (Branch & Bound)"
                  formula="Minimize: Σ dist(path[i], path[i+1]) + dist(path[n], path[0])"
                  explanation={
                    <>
                      <p>Find shortest route visiting all cities exactly once and returning to start.</p>
                      <p><strong>Branch & Bound Algorithm:</strong></p>
                      <ol>
                        <li>Calculate lower bound for partial tour</li>
                        <li>Branch into child nodes (add next city)</li>
                        <li>Prune nodes if bound ≥ current best</li>
                        <li>Continue until all tours explored</li>
                      </ol>
                    </>
                  }
                >
                  <TSPSolver />
                </FormulaLayout>
              </div>
            } />
            
            {/* Additional DAA routes for backward compatibility */}
            <Route path="/daa/greedy" element={
              <div className="card">
                <GreedyAlgorithms />
              </div>
            } />
            <Route path="/daa/dp" element={
              <div className="card">
                <DynamicProgramming />
              </div>
            } />
            <Route path="/daa/floyd-warshall" element={
              <div className="card">
                <FloydWarshall />
              </div>
            } />
            <Route path="/daa/bnb" element={
              <div className="card">
                <BranchAndBound />
              </div>
            } />
            <Route path="/daa/genetic" element={
              <div className="card">
                <GeneticAlgorithm />
              </div>
            } />
            <Route path="/daa/brute" element={
              <div className="card">
                <BruteForce />
              </div>
            } />
            <Route path="/daa/supporting" element={
              <div className="card">
                <SupportingConcepts />
              </div>
            } />

            {/* DIP Routes */}
            <Route path="/dip/grayscale" element={
              <div className="card">
                <ImageFundamentals />
              </div>
            } />
            <Route path="/dip/lecture1" element={
              <div className="card">
                <ImageSamplingQuantization />
              </div>
            } />
            <Route path="/dip/negative" element={
              <div className="card">
                <ImageEnhancement />
              </div>
            } />
            <Route path="/dip/histogram" element={
              <div className="card">
                <ImageEnhancement />
              </div>
            } />
            <Route path="/dip/brightness" element={
              <div className="card">
                <ImageEnhancement />
              </div>
            } />
            <Route path="/dip/blur" element={
              <div className="card">
                <ImageFiltering />
              </div>
            } />
            <Route path="/dip/edge" element={
              <div className="card">
                <EdgeDetection />
              </div>
            } />
            <Route path="/dip/threshold" element={
              <div className="card">
                <ImageFiltering />
              </div>
            } />
            <Route path="/dip/sharpen" element={
              <div className="card">
                <ImageFiltering />
              </div>
            } />
            <Route path="/dip/convolution" element={
              <div className="card">
                <ImageFiltering />
              </div>
            } />
            <Route path="/dip/channels" element={
              <div className="card">
                <ImageFundamentals />
              </div>
            } />
            
            {/* Additional DIP routes for backward compatibility */}
            <Route path="/dip/fundamentals" element={
              <div className="card">
                <ImageFundamentals />
              </div>
            } />
            <Route path="/dip/enhancement" element={
              <div className="card">
                <ImageEnhancement />
              </div>
            } />
            <Route path="/dip/filtering" element={
              <div className="card">
                <ImageFiltering />
              </div>
            } />
            <Route path="/dip/compression" element={
              <div className="card">
                <ImageCompression />
              </div>
            } />
            <Route path="/dip/cnn" element={
              <div className="card">
                <DeepLearningCNN />
              </div>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default App
