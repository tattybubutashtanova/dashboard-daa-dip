# DAA & DIP Learning Dashboard

A comprehensive interactive dashboard for learning **Design and Analysis of Algorithms (DAA)** and **Digital Image Processing (DIP)** built with Vite and React.

## Features

### 🧠 Digital Image Processing (DIP)
- **Image Fundamentals**: Types of images, sampling, quantization, neighborhoods, distances
- **Image Enhancement**: Negative, log transformation, gamma correction, histogram operations
- **Image Filtering & Restoration**: Convolution, noise types, filtering methods
- **Image Compression**: RLE, Huffman, Arithmetic encoding
- **Deep Learning & CNN**: CNN architecture, activation functions, training concepts

### ⚙️ Design and Analysis of Algorithms (DAA)
- **Greedy Algorithms**: Knapsack, Huffman coding, Dijkstra's, TSP
- **Dynamic Programming**: 0/1 Knapsack, Coin change, Floyd-Warshall, LCS, TSP
- **Branch and Bound**: TSP with bounding and pruning
- **Genetic Algorithm**: Encoding, selection, crossover, mutation
- **Brute Force**: Complete enumeration methods
- **Supporting Concepts**: Complexity analysis, algorithm comparisons

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── DIP/
│   │   │   ├── DIPDashboard.jsx
│   │   │   └── sections/
│   │   │       ├── ImageFundamentals.jsx
│   │   │       ├── ImageEnhancement.jsx
│   │   │       ├── ImageFiltering.jsx
│   │   │       ├── ImageCompression.jsx
│   │   │       └── DeepLearningCNN.jsx
│   │   └── DAA/
│   │       ├── DAADashboard.jsx
│   │       └── sections/
│   │           ├── GreedyAlgorithms.jsx
│   │           ├── DynamicProgramming.jsx
│   │           ├── BranchAndBound.jsx
│   │           ├── GeneticAlgorithm.jsx
│   │           ├── BruteForce.jsx
│   │           └── SupportingConcepts.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Technologies Used

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **CSS3**: Styling (no Tailwind, pure CSS)

## Usage

1. **Navigate between DIP and DAA**: Use the tabs at the top
2. **Browse Topics**: Click on topics in the sidebar
3. **Interactive Demos**: Some sections include interactive examples
4. **Learn Concepts**: Each topic includes explanations, algorithms, formulas, and examples

## Customization

- Modify content in the section components under `src/components/`
- Update styles in the respective CSS files
- Add new sections by creating new component files and adding them to the dashboard

## License

This project is for educational purposes.

