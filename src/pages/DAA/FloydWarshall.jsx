import { useState } from 'react'
import InteractivePage from '../../components/shared/InteractivePage'
import InputCard from '../../components/shared/InputCard'
import OutputCard from '../../components/shared/OutputCard'
import StepByStepDisplay from '../../components/shared/StepByStepDisplay'

function FloydWarshall() {
  const [graph, setGraph] = useState({
    nodes: ['A', 'B', 'C', 'D'],
    edges: {
      'A-B': 3,
      'A-C': 8,
      'A-D': 5,
      'B-C': 2,
      'B-D': 4,
      'C-D': 1
    }
  })
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])

  const solve = () => {
    const solutionSteps = []
    const n = graph.nodes.length
    const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity))

    // Initialize distance matrix
    for (let i = 0; i < n; i++) {
      dist[i][i] = 0
    }

    Object.entries(graph.edges).forEach(([key, value]) => {
      const [from, to] = key.split('-')
      const i = graph.nodes.indexOf(from)
      const j = graph.nodes.indexOf(to)
      if (i !== -1 && j !== -1) {
        dist[i][j] = value
        dist[j][i] = value
      }
    })

    solutionSteps.push({
      description: `Initialize distance matrix with direct edges`,
      data: `Matrix size: ${n} × ${n}\nDirect edges: ${Object.keys(graph.edges).length}`
    })

    // Floyd-Warshall algorithm
    for (let k = 0; k < n; k++) {
      solutionSteps.push({
        description: `Iteration ${k + 1}: Consider node ${graph.nodes[k]} as intermediate`,
      })

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
            const newDist = dist[i][k] + dist[k][j]
            if (newDist < dist[i][j]) {
              solutionSteps.push({
                description: `  Update dist[${graph.nodes[i]}][${graph.nodes[j]}] = min(${dist[i][j] === Infinity ? '∞' : dist[i][j]}, ${dist[i][k]} + ${dist[k][j]} = ${newDist})`,
              })
              dist[i][j] = newDist
            }
          }
        }
      }

      // Show matrix after this iteration
      const matrixStr = graph.nodes.map((node, i) => 
        `${node}: [${dist[i].map(d => d === Infinity ? '∞' : d).join(', ')}]`
      ).join('\n')
      
      solutionSteps.push({
        description: `Distance matrix after iteration ${k + 1}:`,
        data: matrixStr
      })
    }

    solutionSteps.push({
      description: `Final shortest distances between all pairs:`,
      result: `All-pairs shortest path computed`
    })

    setSteps(solutionSteps)
    setResult({ distances: dist, nodes: graph.nodes })
  }

  const explanation = (
    <>
      <h4>Floyd-Warshall Algorithm</h4>
      <p>Finds shortest paths between all pairs of vertices in a weighted graph.</p>
      <p><strong>Algorithm:</strong></p>
      <ol>
        <li>Initialize distance matrix with edge weights</li>
        <li>For each vertex k (intermediate):
          <ul>
            <li>For each pair (i, j):</li>
            <li>If dist[i][k] + dist[k][j] &lt; dist[i][j]:</li>
            <li>Update dist[i][j]</li>
          </ul>
        </li>
      </ol>
      <p><strong>Formula:</strong> dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])</p>
      <p><strong>Time Complexity:</strong> O(V³)</p>
    </>
  )

  return (
    <InteractivePage
      title="Floyd-Warshall - All-Pairs Shortest Path"
      formula="dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])"
      explanation={explanation}
      inputSection={
        <div>
          <InputCard title="Graph Nodes">
            <div className="input-group">
              <label>Nodes (comma-separated)</label>
              <input
                type="text"
                value={graph.nodes.join(', ')}
                onChange={(e) => setGraph({
                  ...graph,
                  nodes: e.target.value.split(',').map(n => n.trim()).filter(n => n)
                })}
                placeholder="A, B, C, D"
              />
            </div>
          </InputCard>

          <InputCard title="Edges (Format: A-B:weight)">
            <div className="input-group">
              <label>Edges (one per line)</label>
              <textarea
                rows="6"
                value={Object.entries(graph.edges).map(([k, v]) => `${k}:${v}`).join('\n')}
                onChange={(e) => {
                  const edges = {}
                  e.target.value.split('\n').forEach(line => {
                    const [key, value] = line.split(':')
                    if (key && value) {
                      edges[key.trim()] = parseInt(value.trim())
                    }
                  })
                  setGraph({ ...graph, edges })
                }}
                placeholder="A-B:3&#10;A-C:8&#10;B-C:2"
              />
            </div>
          </InputCard>

          <div className="button-group">
            <button className="btn-primary" onClick={solve}>
              Find All-Pairs Shortest Paths
            </button>
          </div>
        </div>
      }
      outputSection={
        <div>
          {result && (
            <OutputCard title="Shortest Distance Matrix">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>From \ To</th>
                    {result.nodes.map(node => (
                      <th key={node}>{node}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.distances.map((row, i) => (
                    <tr key={i}>
                      <td><strong>{result.nodes[i]}</strong></td>
                      {row.map((dist, j) => (
                        <td key={j}>
                          {dist === Infinity ? '∞' : dist}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </OutputCard>
          )}
          {steps.length > 0 && (
            <StepByStepDisplay steps={steps} title="Algorithm Steps" />
          )}
          {!result && <OutputCard isEmpty={true} />}
        </div>
      }
      algorithmExplanation={explanation}
    />
  )
}

export default FloydWarshall

