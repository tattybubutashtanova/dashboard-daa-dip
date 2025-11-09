# DAA & DIP Dashboard - Project Structure

## 📁 Directory Structure

```
src/
├── components/
│   ├── shared/
│   │   ├── InteractivePage.jsx          # Main template for interactive pages
│   │   ├── InteractivePage.css
│   │   ├── InputCard.jsx               # Reusable input card component
│   │   ├── InputCard.css
│   │   ├── OutputCard.jsx              # Reusable output card component
│   │   ├── OutputCard.css
│   │   ├── FormulaLayout.jsx           # Formula + explanation layout
│   │   ├── FormulaLayout.css
│   │   ├── StepByStepDisplay.jsx       # Step-by-step visualization
│   │   └── StepByStepDisplay.css
│   ├── DAA/
│   │   ├── algorithms/
│   │   │   ├── KnapsackSolverEnhanced.jsx
│   │   │   ├── CoinChangeSolverEnhanced.jsx
│   │   │   ├── HuffmanSolver.jsx
│   │   │   └── TSPSolver.jsx
│   │   └── sections/
│   │       ├── GreedyAlgorithms.jsx
│   │       ├── DynamicProgramming.jsx
│   │       ├── BranchAndBound.jsx
│   │       ├── GeneticAlgorithm.jsx
│   │       ├── BruteForce.jsx
│   │       └── SupportingConcepts.jsx
│   ├── DIP/
│   │   ├── ImageProcessor.jsx
│   │   ├── ImageProcessor.css
│   │   └── sections/
│   │       ├── ImageFundamentals.jsx
│   │       ├── ImageEnhancement.jsx
│   │       ├── ImageFiltering.jsx
│   │       ├── ImageCompression.jsx
│   │       └── DeepLearningCNN.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── DAA/
│   │   └── DijkstraVisualizer.jsx
│   └── DIP/
│       └── ImageSamplingQuantization.jsx
├── utils/
│   └── imageProcessing.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🎯 Interactive Page Template

Every topic page follows this structure:

```jsx
<InteractivePage
  title="Topic Title"
  formula="Formula here"
  explanation={<Explanation JSX>}
  inputSection={<Input controls>}
  outputSection={<Results display>}
  algorithmExplanation={<Detailed explanation>}
/>
```

## 📋 Routes Structure

### DAA Routes
- `/daa/knapsack` - 0/1 Knapsack (DP)
- `/daa/huffman` - Huffman Coding
- `/daa/arithmetic` - Arithmetic Encoding
- `/daa/coin-change` - Coin Change (Greedy/DP)
- `/daa/tsp` - TSP (Branch & Bound)
- `/daa/dijkstra` - Dijkstra's Algorithm

### DIP Routes
- `/dip/lecture1` - Sampling & Quantization
- `/dip/grayscale` - Grayscale Conversion
- `/dip/negative` - Image Negative
- `/dip/histogram` - Histogram Equalization
- `/dip/brightness` - Brightness & Contrast
- `/dip/blur` - Blur Filter
- `/dip/edge` - Edge Detection
- `/dip/threshold` - Threshold
- `/dip/sharpen` - Sharpen
- `/dip/convolution` - Convolution
- `/dip/channels` - Separate Channels

## 🎨 Design System

- **Sidebar:** `#0d1b2a` (dark navy)
- **Background:** `linear-gradient(135deg, #5666f5, #8a6ddf)`
- **Cards:** White, `border-radius: 1rem`, soft shadows
- **Typography:** Inter/Segoe UI
- **Hover Effects:** Subtle transitions

## ✨ Features

1. **User Input:** All algorithms accept custom inputs
2. **Step-by-Step:** Detailed algorithm execution steps
3. **Live Results:** Dynamic computation and visualization
4. **Image Processing:** Upload and process images in real-time
5. **Responsive:** Works on desktop and mobile

