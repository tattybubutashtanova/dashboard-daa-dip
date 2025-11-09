import { useState } from 'react'
import StepByStepDisplay from '../../shared/StepByStepDisplay'
import './AlgorithmVisualizer.css'

function HuffmanSolver() {
  const [input, setInput] = useState('AABBC')
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])

  const solve = () => {
    if (!input.trim()) {
      alert('Please enter a string')
      return
    }

    const solutionSteps = []
    
    // Count frequencies
    const freq = {}
    for (const char of input) {
      freq[char] = (freq[char] || 0) + 1
    }

    solutionSteps.push({
      description: `Input string: "${input}"`,
    })

    solutionSteps.push({
      description: `Step 1: Count frequency of each character`,
      data: Object.entries(freq)
        .map(([char, count]) => `${char}: ${count}`)
        .join('\n')
    })

    // Create nodes
    const nodes = Object.entries(freq).map(([char, count]) => ({
      char,
      freq: count,
      left: null,
      right: null
    }))

    solutionSteps.push({
      description: `Step 2: Create leaf nodes for each character`,
      data: nodes.map(n => `Node(${n.char}, freq=${n.freq})`).join('\n')
    })

    // Build tree
    const tree = [...nodes]
    let stepNum = 3

    while (tree.length > 1) {
      tree.sort((a, b) => a.freq - b.freq)
      const left = tree.shift()
      const right = tree.shift()
      const merged = {
        char: null,
        freq: left.freq + right.freq,
        left,
        right
      }
      tree.push(merged)

      solutionSteps.push({
        description: `Step ${stepNum}: Merge two nodes with minimum frequencies`,
        data: `Left: ${left.char || 'Internal'} (freq=${left.freq})\nRight: ${right.char || 'Internal'} (freq=${right.freq})\nNew node: freq=${merged.freq}`,
        result: `Merged into internal node`
      })
      stepNum++
    }

    // Generate codes
    const codes = {}
    const generateCodes = (node, code = '') => {
      if (!node.left && !node.right) {
        codes[node.char] = code
        return
      }
      if (node.left) generateCodes(node.left, code + '0')
      if (node.right) generateCodes(node.right, code + '1')
    }

    generateCodes(tree[0])

    solutionSteps.push({
      description: `Step ${stepNum}: Assign codes (left=0, right=1)`,
      data: Object.entries(codes)
        .map(([char, code]) => `${char} = ${code}`)
        .join('\n')
    })

    // Encode
    const encoded = input.split('').map(char => codes[char]).join('')
    const originalBits = input.length * 8
    const encodedBits = encoded.length
    const compression = ((1 - encodedBits / originalBits) * 100).toFixed(1)

    solutionSteps.push({
      description: `Step ${stepNum + 1}: Encode the string`,
      data: `Original: ${input}\nEncoded: ${encoded}\nOriginal bits: ${originalBits}\nEncoded bits: ${encodedBits}\nCompression: ${compression}%`
    })

    solutionSteps.push({
      description: `Final Result:`,
      result: `Encoded string: ${encoded}`
    })

    setSteps(solutionSteps)
    setResult({ codes, encoded, compression })
  }

  return (
    <div className="algorithm-solver">
      <div className="solver-controls">
        <div className="input-group">
          <label>
            Input String:
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter string (e.g., AABBC)"
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            />
          </label>
        </div>
      </div>

      <button className="solve-btn" onClick={solve}>
        Solve Huffman Coding
      </button>

      {steps.length > 0 && (
        <StepByStepDisplay steps={steps} title="Huffman Coding Steps" />
      )}

      {result && (
        <div className="result-box">
          <h4>Huffman Codes:</h4>
          <div className="selected-items">
            {Object.entries(result.codes).map(([char, code]) => (
              <div key={char} className="selected-item">
                <span><strong>{char}:</strong> {code}</span>
              </div>
            ))}
          </div>
          <p className="total-value">Encoded: {result.encoded}</p>
          <p className="total-value">Compression: {result.compression}%</p>
        </div>
      )}
    </div>
  )
}

export default HuffmanSolver

