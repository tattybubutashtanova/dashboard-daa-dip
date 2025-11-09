import { useState } from 'react'
import StepByStepDisplay from '../../shared/StepByStepDisplay'
import './AlgorithmVisualizer.css'

function TSPSolver() {
  const [cities, setCities] = useState(['A', 'B', 'C', 'D'])
  const [distances, setDistances] = useState({
    'A-B': 10, 'A-C': 15, 'A-D': 20,
    'B-C': 35, 'B-D': 25,
    'C-D': 30
  })
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])
  const [newCity, setNewCity] = useState('')

  const addCity = () => {
    if (newCity && !cities.includes(newCity)) {
      setCities([...cities, newCity])
      setNewCity('')
    }
  }

  const solve = () => {
    const solutionSteps = []
    
    // Build distance matrix
    const n = cities.length
    const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity))
    
    for (let i = 0; i < n; i++) {
      dist[i][i] = 0
    }

    Object.entries(distances).forEach(([key, value]) => {
      const [from, to] = key.split('-')
      const i = cities.indexOf(from)
      const j = cities.indexOf(to)
      if (i !== -1 && j !== -1) {
        dist[i][j] = value
        dist[j][i] = value
      }
    })

    solutionSteps.push({
      description: `TSP Problem: Find shortest route visiting all ${n} cities`,
      data: `Cities: ${cities.join(', ')}\nDistance matrix created`
    })

    // Branch and Bound approach
    solutionSteps.push({
      description: `Using Branch and Bound algorithm:`,
    })

    let bestCost = Infinity
    let bestPath = null
    const visited = new Set()

    const calculateLowerBound = (path) => {
      // Simple lower bound: sum of minimum edges
      let bound = 0
      for (let i = 0; i < n; i++) {
        if (!path.includes(i)) {
          let minEdge = Infinity
          for (let j = 0; j < n; j++) {
            if (i !== j && dist[i][j] < minEdge) {
              minEdge = dist[i][j]
            }
          }
          if (minEdge !== Infinity) bound += minEdge
        }
      }
      return bound
    }

    const branchAndBound = (currentPath, currentCost) => {
      if (currentPath.length === n) {
        const returnCost = dist[currentPath[currentPath.length - 1]][currentPath[0]]
        const totalCost = currentCost + returnCost
        if (totalCost < bestCost) {
          bestCost = totalCost
          bestPath = [...currentPath, currentPath[0]]
          solutionSteps.push({
            description: `Found complete tour: ${bestPath.map(i => cities[i]).join(' → ')}`,
            data: `Cost: ${totalCost}`,
            result: `New best solution found!`
          })
        }
        return
      }

      const bound = calculateLowerBound(currentPath)
      if (currentCost + bound >= bestCost) {
        solutionSteps.push({
          description: `Prune branch (bound ${currentCost + bound} >= best ${bestCost})`,
        })
        return
      }

      for (let i = 0; i < n; i++) {
        if (!currentPath.includes(i)) {
          const nextCost = currentPath.length === 0 
            ? 0 
            : currentCost + dist[currentPath[currentPath.length - 1]][i]
          
          solutionSteps.push({
            description: `Branch: Add city ${cities[i]} to path`,
            data: `Current path: ${currentPath.map(idx => cities[idx]).join(' → ')} → ${cities[i]}\nCost so far: ${nextCost}`
          })

          branchAndBound([...currentPath, i], nextCost)
        }
      }
    }

    solutionSteps.push({
      description: `Starting branch and bound search:`,
    })

    branchAndBound([0], 0)

    solutionSteps.push({
      description: `Final Solution:`,
      result: `Shortest tour: ${bestPath ? bestPath.map(i => cities[i]).join(' → ') : 'N/A'}\nTotal distance: ${bestCost !== Infinity ? bestCost : 'N/A'}`
    })

    setSteps(solutionSteps)
    setResult({ path: bestPath, cost: bestCost })
  }

  return (
    <div className="algorithm-solver">
      <div className="solver-controls">
        <div className="input-group">
          <label>
            Add City:
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value.toUpperCase())}
                placeholder="City name"
                maxLength="1"
              />
              <button onClick={addCity}>Add</button>
            </div>
          </label>
        </div>
      </div>

      <div className="items-list">
        <h4>Cities: {cities.join(', ')}</h4>
        <h4>Distances:</h4>
        {Object.entries(distances).map(([key, value]) => {
          const [from, to] = key.split('-')
          if (cities.includes(from) && cities.includes(to)) {
            return (
              <div key={key} className="item-card">
                <span>{from} → {to}: {value}</span>
              </div>
            )
          }
          return null
        })}
      </div>

      <button className="solve-btn" onClick={solve}>
        Solve TSP (Branch & Bound)
      </button>

      {steps.length > 0 && (
        <StepByStepDisplay steps={steps} title="TSP Branch & Bound Steps" />
      )}

      {result && result.path && (
        <div className="result-box">
          <h4>Optimal Tour:</h4>
          <p className="total-value">
            {result.path.map(i => cities[i]).join(' → ')}
          </p>
          <p className="total-value">Total Distance: {result.cost}</p>
        </div>
      )}
    </div>
  )
}

export default TSPSolver

