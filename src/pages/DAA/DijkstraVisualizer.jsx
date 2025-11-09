import { useState } from 'react'
import InteractivePage from '../../components/shared/InteractivePage'
import InputCard from '../../components/shared/InputCard'
import OutputCard from '../../components/shared/OutputCard'
import StepByStepDisplay from '../../components/shared/StepByStepDisplay'

function DijkstraVisualizer() {
  const [graph, setGraph] = useState({
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: {
      'A-B': 4,
      'A-C': 2,
      'B-C': 1,
      'B-D': 5,
      'C-D': 8,
      'C-E': 10,
      'D-E': 2
    }
  })
  const [source, setSource] = useState('A')
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])

  const solve = () => {
    const solutionSteps = []
    const distances = {}
    const previous = {}
    const unvisited = new Set(graph.nodes)
    
    // Initialize
    graph.nodes.forEach(node => {
      distances[node] = node === source ? 0 : Infinity
      previous[node] = null
    })

    solutionSteps.push({
      description: `Initialize distances: ${source} = 0, others = ∞`,
      data: Object.entries(distances).map(([n, d]) => `${n}: ${d === Infinity ? '∞' : d}`).join(', ')
    })

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = null
      let minDist = Infinity
      
      unvisited.forEach(node => {
        if (distances[node] < minDist) {
          minDist = distances[node]
          current = node
        }
      })

      if (current === null || minDist === Infinity) break

      unvisited.delete(current)
      
      solutionSteps.push({
        description: `Select node ${current} (distance = ${minDist})`,
        data: `Unvisited nodes: ${Array.from(unvisited).join(', ')}`
      })

      // Update neighbors
      graph.nodes.forEach(neighbor => {
        const edgeKey = `${current}-${neighbor}`
        const reverseEdgeKey = `${neighbor}-${current}`
        const weight = graph.edges[edgeKey] || graph.edges[reverseEdgeKey]
        
        if (weight && unvisited.has(neighbor)) {
          const alt = distances[current] + weight
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt
            previous[neighbor] = current
            solutionSteps.push({
              description: `Update ${neighbor}: distance = ${alt} (via ${current})`,
            })
          }
        }
      })
    }

    // Build paths
    const paths = {}
    graph.nodes.forEach(node => {
      const path = []
      let current = node
      while (current !== null) {
        path.unshift(current)
        current = previous[current]
      }
      paths[node] = {
        distance: distances[node],
        path: path.join(' → ')
      }
    })

    solutionSteps.push({
      description: `Final shortest distances from ${source}:`,
      result: Object.entries(paths).map(([n, p]) => `${n}: ${p.distance === Infinity ? '∞' : p.distance}`).join(', ')
    })

    setSteps(solutionSteps)
    setResult({ paths, distances })
  }

  const explanation = (
    <>
      <h4>Dijkstra's Algorithm</h4>
      <p>Finds shortest paths from a source vertex to all other vertices in a weighted graph.</p>
      <p><strong>Algorithm Steps:</strong></p>
      <ol>
        <li>Initialize distance to source as 0, others as ∞</li>
        <li>Create priority queue with all vertices</li>
        <li>While queue is not empty:
          <ul>
            <li>Extract vertex u with minimum distance</li>
            <li>For each neighbor v of u:
              <ul>
                <li>If distance[v] &gt; distance[u] + weight(u,v):</li>
                <li>Update distance[v] = distance[u] + weight(u,v)</li>
              </ul>
            </li>
          </ul>
        </li>
      </ol>
      <p><strong>Time Complexity:</strong> O((V + E) log V) with binary heap</p>
    </>
  )

  return (
    <InteractivePage
      title="Dijkstra's Algorithm - Shortest Path"
      formula="distance[v] = min(distance[v], distance[u] + weight(u, v))"
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
                placeholder="A, B, C, D, E"
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
                placeholder="A-B:4&#10;A-C:2&#10;B-C:1"
              />
            </div>
          </InputCard>

          <InputCard title="Source Node">
            <div className="input-group">
              <label>Starting Node</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                {graph.nodes.map(node => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>
            </div>
          </InputCard>

          <div className="button-group">
            <button className="btn-primary" onClick={solve}>
              Find Shortest Paths
            </button>
          </div>
        </div>
      }
      outputSection={
        <div>
          {result && (
            <OutputCard title="Shortest Distances">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Node</th>
                    <th>Distance</th>
                    <th>Path</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.paths).map(([node, data]) => (
                    <tr key={node}>
                      <td><strong>{node}</strong></td>
                      <td>{data.distance === Infinity ? '∞' : data.distance}</td>
                      <td>{data.path}</td>
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

export default DijkstraVisualizer

