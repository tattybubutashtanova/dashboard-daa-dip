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
import FormulaLayout from './components/shared/FormulaLayout'
import DijkstraVisualizer from './pages/DAA/DijkstraVisualizer'
import FloydWarshall from './pages/DAA/FloydWarshall'
import KnapsackVisualizer from './pages/DAA/KnapsackVisualizer'
import TSPVisualizer from './pages/DAA/TSPVisualizer'
import ImageSamplingQuantization from './pages/DIP/ImageSamplingQuantization'
import EdgeDetection from './pages/DIP/EdgeDetection'
import ANNVisualizer from './pages/AI/ANNVisualizer'
import CNNVisualizer from './pages/AI/CNNVisualizer'

// DIP Pages
import ImageFundamentals from './components/DIP/sections/ImageFundamentals'
import ImageEnhancement from './components/DIP/sections/ImageEnhancement'
import ImageFiltering from './components/DIP/sections/ImageFiltering'
import ImageCompression from './components/DIP/sections/ImageCompression'
import Grayscale from './pages/DIP/Grayscale'
import Negative from './pages/DIP/Negative'
import HistogramEqualization from './pages/DIP/HistogramEqualization'
import HistogramMatching from './pages/DIP/HistogramMatching'
import Threshold from './pages/DIP/Threshold'
import Sharpen from './pages/DIP/Sharpen'
import Convolution from './pages/DIP/Convolution'
import SeparateChannels from './pages/DIP/SeparateChannels'
import DeepLearningCNN from './components/DIP/sections/DeepLearningCNN'

// Get page title based on route
function getPageTitle(pathname) {
  const titles = {
    '/': 'Dashboard Home',
    '/daa/knapsack': '0/1 Knapsack Visualizer',
    '/daa/huffman': 'Huffman Coding',
    '/daa/arithmetic': 'Arithmetic Encoding',
    '/daa/coin-change': 'Coin Changing Problem',
    '/daa/tsp': 'Traveling Salesman Problem',
    '/dip/grayscale': 'Grayscale Conversion',
    '/dip/negative': 'Image Negative',
    '/dip/histogram': 'Histogram Equalization',
    '/dip/hist-match': 'Histogram Matching',
    '/dip/brightness': 'Brightness & Contrast',
    '/dip/blur': 'Blur Filter',
    '/dip/edge': 'Edge Detection',
    '/dip/threshold': 'Threshold',
    '/dip/lecture1': 'Sampling & Quantization',
    '/dip/sharpen': 'Sharpen Filter',
    '/dip/convolution': 'Convolution',
    '/dip/channels': 'Separate Channels',
    '/ai/ann': 'ANN Visualizer',
    '/ai/cnn': 'CNN Visualizer',
  }
  return titles[pathname] || 'DAA & DIP Dashboard'
}

function getPageSubtitle(pathname) {
  if (pathname.startsWith('/daa')) {
    return 'Design and Analysis of Algorithms'
  } else if (pathname.startsWith('/dip')) {
    return 'Digital Image Processing'
  } else if (pathname.startsWith('/ai')) {
    return 'Neural Networks'
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
                <KnapsackVisualizer />
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
                <TSPVisualizer />
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
                <Grayscale />
              </div>
            } />
            <Route path="/dip/lecture1" element={
              <div className="card">
                <ImageSamplingQuantization />
              </div>
            } />
            <Route path="/dip/negative" element={
              <div className="card">
                <Negative />
              </div>
            } />
            <Route path="/dip/histogram" element={
              <div className="card">
                <HistogramEqualization />
              </div>
            } />
            <Route path="/dip/hist-match" element={
              <div className="card">
                <HistogramMatching />
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
                <Threshold />
              </div>
            } />
            <Route path="/dip/sharpen" element={
              <div className="card">
                <Sharpen />
              </div>
            } />
            <Route path="/dip/convolution" element={
              <div className="card">
                <Convolution />
              </div>
            } />
            <Route path="/dip/channels" element={
              <div className="card">
                <SeparateChannels />
              </div>
            } />

            {/* AI Routes */}
            <Route path="/ai/ann" element={
              <div className="card">
                <ANNVisualizer />
              </div>
            } />
            <Route path="/ai/cnn" element={
              <div className="card">
                <CNNVisualizer />
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
