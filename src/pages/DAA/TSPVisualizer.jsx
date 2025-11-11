import { useState } from 'react'
import InteractivePage from '../../components/shared/InteractivePage'
import InputCard from '../../components/shared/InputCard'
import OutputCard from '../../components/shared/OutputCard'
import StepByStepDisplay from '../../components/shared/StepByStepDisplay'

const INF = Number.POSITIVE_INFINITY

const defaultMatrix = [
  [INF, 10, 15, 20],
  [10, INF, 35, 25],
  [15, 35, INF, 30],
  [20, 25, 30, INF]
]

const defaultLabels = ['A', 'B', 'C', 'D']

function cloneMatrix(matrix) {
  return matrix.map(row => row.slice())
}

function formatValue(value) {
  if (value === INF || Number.isNaN(value)) return '∞'
  return Number.isInteger(value) ? value.toString() : value.toFixed(2)
}

function formatMatrix(matrix, labels) {
  const header = [''].concat(labels).join('\t')
  const rows = matrix.map((row, i) => (
    [labels[i]].concat(row.map(formatValue)).join('\t')
  ))
  return [header, ...rows].join('\n')
}

function reduceMatrix(matrix) {
  const n = matrix.length
  const reduced = cloneMatrix(matrix)
  let cost = 0
  const rowReductions = []
  const colReductions = []

  const finiteMin = (values) => {
    let min = INF
    for (const v of values) {
      if (v < min) min = v
    }
    return min
  }

  for (let i = 0; i < n; i++) {
    const row = reduced[i]
    const minVal = finiteMin(row)
    if (minVal !== INF && minVal > 0) {
      cost += minVal
      rowReductions.push({ row: i, value: minVal })
      for (let j = 0; j < n; j++) {
        if (reduced[i][j] !== INF) {
          reduced[i][j] -= minVal
        }
      }
    }
  }

  for (let j = 0; j < n; j++) {
    let colVals = []
    for (let i = 0; i < n; i++) colVals.push(reduced[i][j])
    const minVal = finiteMin(colVals)
    if (minVal !== INF && minVal > 0) {
      cost += minVal
      colReductions.push({ col: j, value: minVal })
      for (let i = 0; i < n; i++) {
        if (reduced[i][j] !== INF) {
          reduced[i][j] -= minVal
        }
      }
    }
  }

  const detailLines = []
  if (rowReductions.length) {
    detailLines.push('Row reductions: ' + rowReductions.map(r => `R${r.row + 1}(-${r.value})`).join(', '))
  }
  if (colReductions.length) {
    detailLines.push('Column reductions: ' + colReductions.map(c => `C${c.col + 1}(-${c.value})`).join(', '))
  }

  return {
    matrix: reduced,
    cost,
    detail: detailLines.join('\n')
  }
}

function findBestZero(matrix, fromSet, toSet) {
  const n = matrix.length
  let best = null

  const getRowMinExcluding = (rowIdx, excludeIdx) => {
    let min = INF
    for (let j = 0; j < n; j++) {
      if (j !== excludeIdx && matrix[rowIdx][j] < min) {
        min = matrix[rowIdx][j]
      }
    }
    return min
  }

  const getColMinExcluding = (colIdx, excludeIdx) => {
    let min = INF
    for (let i = 0; i < n; i++) {
      if (i !== excludeIdx && matrix[i][colIdx] < min) {
        min = matrix[i][colIdx]
      }
    }
    return min
  }

  for (let i = 0; i < n; i++) {
    if (fromSet.has(i)) continue
    for (let j = 0; j < n; j++) {
      if (toSet.has(j)) continue
      if (matrix[i][j] === 0) {
        const rowMin = getRowMinExcluding(i, j)
        const colMin = getColMinExcluding(j, i)
        const penalty = (rowMin === INF ? 0 : rowMin) + (colMin === INF ? 0 : colMin)
        if (!best || penalty > best.penalty) {
          best = { i, j, penalty }
        }
      }
    }
  }

  return best
}

function blockSubcycles(matrix, path, size) {
  const nextMap = new Map()
  path.forEach(([from, to]) => nextMap.set(from, to))

  for (const [start] of nextMap) {
    let current = start
    const visited = new Set()
    const sequence = []

    while (nextMap.has(current) && !visited.has(current)) {
      visited.add(current)
      sequence.push(current)
      current = nextMap.get(current)
    }

    if (current === start && sequence.length > 0 && sequence.length < size) {
      const last = sequence[sequence.length - 1]
      matrix[last][start] = INF
    }
  }
}

function solveBranchAndBound(baseMatrix, labels) {
  const steps = []
  const n = baseMatrix.length
  const rootMatrix = cloneMatrix(baseMatrix)
  const rootReduction = reduceMatrix(rootMatrix)

  steps.push({
    description: 'Initial matrix reduction',
    data: `${rootReduction.detail}\nReduced matrix:\n${formatMatrix(rootReduction.matrix, labels)}`,
    result: `Initial lower bound = ${rootReduction.cost}`
  })

  const queue = [{
    matrix: rootReduction.matrix,
    lowerBound: rootReduction.cost,
    cost: 0,
    path: [],
    level: 0,
    vertex: 0,
    fromSet: new Set(),
    toSet: new Set()
  }]

  let bestCost = INF
  let bestPath = null

  while (queue.length) {
    queue.sort((a, b) => a.lowerBound - b.lowerBound)
    const node = queue.shift()

    if (node.lowerBound >= bestCost) {
      steps.push({
        description: 'Prune node',
        data: `Lower bound ${node.lowerBound} ≥ current best ${bestCost}`
      })
      continue
    }

    const zeroChoice = findBestZero(node.matrix, node.fromSet, node.toSet)

    if (!zeroChoice) {
      // No zero: treat as leaf or invalid
      if (node.path.length === n - 1) {
        const lastCity = node.path[node.path.length - 1][1]
        const totalCost = node.cost + baseMatrix[lastCity][0]
        if (totalCost < bestCost) {
          bestCost = totalCost
          bestPath = [...node.path, [lastCity, 0]]
          steps.push({
            description: 'Complete tour',
            data: `Tour: ${bestPath.map(([from, to]) => `${labels[from]}→${labels[to]}`).join(', ')}`,
            result: `Cost = ${totalCost}`
          })
        }
      }
      continue
    }

    const { i, j, penalty } = zeroChoice

    steps.push({
      description: 'Select zero with largest penalty',
      data: `Selected edge ${labels[i]} → ${labels[j]} (penalty = ${penalty})`
    })

    // INCLUDE branch (take edge i->j)
    {
      const includeMatrix = cloneMatrix(node.matrix)
      for (let col = 0; col < n; col++) includeMatrix[i][col] = INF
      for (let row = 0; row < n; row++) includeMatrix[row][j] = INF
      includeMatrix[j][i] = INF
      const includePath = [...node.path, [i, j]]
      blockSubcycles(includeMatrix, includePath, n)

      const includeReduction = reduceMatrix(includeMatrix)
      const includeCost = node.cost + baseMatrix[i][j]
      const includeLowerBound = includeCost + includeReduction.cost

      steps.push({
        description: `Include edge ${labels[i]} → ${labels[j]}`,
        data: `${includeReduction.detail}\nReduced matrix:\n${formatMatrix(includeReduction.matrix, labels)}`,
        result: `Lower bound = ${includeLowerBound}`
      })

      if (includePath.length === n - 1) {
        const lastCity = j
        const finalCost = includeCost + baseMatrix[lastCity][0]
        steps.push({
          description: 'Complete tour',
          data: `Edges: ${[...includePath, [lastCity, 0]].map(([from, to]) => `${labels[from]}→${labels[to]}`).join(', ')}`,
          result: `Cost = ${finalCost}`
        })
        if (finalCost < bestCost) {
          bestCost = finalCost
          bestPath = [...includePath, [lastCity, 0]]
        }
      } else if (includeLowerBound < bestCost) {
        queue.push({
          matrix: includeReduction.matrix,
          lowerBound: includeLowerBound,
          cost: includeCost,
          path: includePath,
          level: node.level + 1,
          vertex: j,
          fromSet: new Set([...node.fromSet, i]),
          toSet: new Set([...node.toSet, j])
        })
      }
    }

    // EXCLUDE branch (set edge to Infinity)
    {
      const excludeMatrix = cloneMatrix(node.matrix)
      excludeMatrix[i][j] = INF
      const excludeReduction = reduceMatrix(excludeMatrix)
      const excludeLowerBound = node.cost + excludeReduction.cost

      steps.push({
        description: `Exclude edge ${labels[i]} → ${labels[j]}`,
        data: `${excludeReduction.detail}\nReduced matrix:\n${formatMatrix(excludeReduction.matrix, labels)}`,
        result: `Lower bound = ${excludeLowerBound}`
      })

      if (excludeLowerBound < bestCost) {
        queue.push({
          matrix: excludeReduction.matrix,
          lowerBound: excludeLowerBound,
          cost: node.cost,
          path: [...node.path],
          level: node.level,
          vertex: node.vertex,
          fromSet: new Set(node.fromSet),
          toSet: new Set(node.toSet)
        })
      }
    }
  }

  return {
    steps,
    path: bestPath,
    cost: bestCost
  }
}

function permutations(arr) {
  if (arr.length <= 1) return [arr]
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i]
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1))
    permutations(remaining).forEach(per => result.push([current, ...per]))
  }
  return result
}

function solveBruteForce(baseMatrix, labels) {
  const steps = []
  const n = baseMatrix.length
  const cities = Array.from({ length: n }, (_, i) => i)
  const others = cities.slice(1)
  let bestCost = INF
  let bestPath = null

  permutations(others).forEach(order => {
    const route = [0, ...order, 0]
    let cost = 0
    let feasible = true
    for (let i = 0; i < route.length - 1; i++) {
      const from = route[i]
      const to = route[i + 1]
      const dist = baseMatrix[from][to]
      if (dist === INF) {
        feasible = false
        break
      }
      cost += dist
    }
    const tourStr = route.map(idx => labels[idx]).join(' → ')
    if (!feasible) {
      steps.push({
        description: 'Evaluate permutation',
        data: tourStr,
        result: 'Infeasible (∞ edge)'
      })
      return
    }
    steps.push({
      description: 'Evaluate permutation',
      data: tourStr,
      result: `Cost = ${cost}`
    })
    if (cost < bestCost) {
      bestCost = cost
      bestPath = route
    }
  })

  if (bestPath) {
    steps.push({
      description: 'Best tour found',
      data: bestPath.map(idx => labels[idx]).join(' → '),
      result: `Cost = ${bestCost}`
    })
  }

  return {
    steps,
    path: bestPath,
    cost: bestCost
  }
}

function buildTourFromEdges(edges, labels) {
  if (!edges || edges.length === 0) return null
  const nextMap = new Map(edges.map(([from, to]) => [from, to]))
  const start = edges[0][0]
  const tour = [start]
  let current = start
  const n = labels.length
  for (let i = 0; i < n; i++) {
    if (!nextMap.has(current)) return null
    current = nextMap.get(current)
    tour.push(current)
    if (current === start) break
  }
  return tour
}

function TSPVisualizer() {
  const [cityLabels, setCityLabels] = useState(defaultLabels)
  const [matrix, setMatrix] = useState(defaultMatrix)
  const [method, setMethod] = useState('bnb')
  const [steps, setSteps] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const explanation = (
    <>
      <p>Traveling Salesman Problem (TSP): find the minimum cost tour visiting each city exactly once and returning to the start.</p>
      <ul>
        <li><strong>Branch and Bound (Matrix Reduction):</strong> reduce rows/columns to compute a lower bound, select promising edges, and prune suboptimal branches.</li>
        <li><strong>Brute Force:</strong> enumerates all possible tours (n! permutations). Works only for small n.</li>
      </ul>
    </>
  )

  const updateDistance = (i, j, value) => {
    if (i === j) return
    const parsed = value === '' ? INF : Math.max(0, parseFloat(value))
    const next = cloneMatrix(matrix)
    next[i][j] = Number.isFinite(parsed) ? parsed : INF
    next[j][i] = Number.isFinite(parsed) ? parsed : INF
    setMatrix(next)
  }

  const addCity = () => {
    if (matrix.length >= 6) return
    const nextLabels = [...cityLabels, String.fromCharCode(65 + cityLabels.length)]
    const size = matrix.length + 1
    const nextMatrix = matrix.map(row => row.concat(25))
    nextMatrix.push(Array(size).fill(25))
    for (let i = 0; i < size; i++) nextMatrix[i][size - 1] = 25
    for (let i = 0; i < size; i++) nextMatrix[size - 1][i] = 25
    nextMatrix[size - 1][size - 1] = INF
    const sanitized = nextMatrix.map((row, i) =>
      row.map((val, j) => (i === j ? INF : val))
    )
    setCityLabels(nextLabels)
    setMatrix(sanitized)
  }

  const removeCity = () => {
    if (matrix.length <= 3) return
    setCityLabels(cityLabels.slice(0, -1))
    setMatrix(matrix.slice(0, -1).map(row => row.slice(0, -1)))
  }

  const runSolver = () => {
    setError('')
    if (matrix.length < 3) {
      setError('Need at least 3 cities.')
      return
    }
    if (method === 'bnb') {
      const { steps: algoSteps, path, cost } = solveBranchAndBound(matrix, cityLabels)
      setSteps(algoSteps)
      if (path) {
        const tour = buildTourFromEdges(path, cityLabels)
        setResult({ tour, cost, pathType: 'Branch and Bound' })
      } else {
        setResult(null)
      }
    } else {
      const { steps: algoSteps, path, cost } = solveBruteForce(matrix, cityLabels)
      setSteps(algoSteps)
      if (path) {
        setResult({ tour: path, cost, pathType: 'Brute Force' })
      } else {
        setResult(null)
      }
    }
  }

  const resetSolver = () => {
    setSteps([])
    setResult(null)
    setError('')
  }

  const renderMatrixInputs = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: 6 }}></th>
            {cityLabels.map((label, idx) => (
              <th key={`h-${idx}`} style={{ padding: 6 }}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={`row-${i}`}>
              <th style={{ padding: 6, textAlign: 'left' }}>{cityLabels[i]}</th>
              {row.map((value, j) => (
                <td key={`cell-${i}-${j}`} style={{ padding: 4 }}>
                  {i === j ? (
                    <div style={{
                      width: 70,
                      textAlign: 'center',
                      color: '#999',
                      fontStyle: 'italic'
                    }}>—</div>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={value === INF ? '' : value}
                      onChange={(e) => updateDistance(i, j, e.target.value)}
                      style={{ width: 80 }}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <InteractivePage
      title="TSP Visualizer"
      formula="Goal: Minimize Σ dist(city_i, city_{i+1}) + dist(city_n, city_1)"
      explanation={explanation}
      inputSection={
        <div>
          <InputCard title="Cities & Distances">
            <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={addCity}>Add City</button>
              <button className="btn-secondary" onClick={removeCity}>Remove City</button>
              <span style={{ alignSelf: 'center', color: '#555' }}>
                Cities: {cityLabels.join(', ')} (max 6)
              </span>
            </div>
            {renderMatrixInputs()}
          </InputCard>

          <InputCard title="Solution Method">
            <div className="input-group">
              <label>Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="bnb">Branch and Bound (Matrix Reduction)</option>
                <option value="brute">Brute Force (All permutations)</option>
              </select>
            </div>
            <div className="button-group">
              <button className="btn-primary" onClick={runSolver}>Solve TSP</button>
              <button className="btn-secondary" onClick={resetSolver}>Reset</button>
            </div>
            {error && <p style={{ color: '#c62828', marginTop: '0.5rem' }}>{error}</p>}
          </InputCard>
        </div>
      }
      outputSection={
        <div>
          <OutputCard title="Distance Matrix">
            <pre style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              {formatMatrix(matrix, cityLabels)}
            </pre>
          </OutputCard>

          {result && result.tour && (
            <OutputCard title={`Best Tour (${result.pathType})`}>
              <div style={{ padding: '0.5rem 0' }}>
                <p><strong>Route:</strong> {result.tour.map(idx => cityLabels[idx]).join(' → ')}</p>
                <p><strong>Total Cost:</strong> {result.cost}</p>
              </div>
            </OutputCard>
          )}

          {steps.length > 0 && (
            <StepByStepDisplay
              steps={steps}
              title={method === 'bnb' ? 'Branch and Bound Steps' : 'Brute Force Evaluation'}
            />
          )}

          {!result && steps.length === 0 && <OutputCard isEmpty={true} />}
        </div>
      }
      algorithmExplanation={explanation}
    />
  )
}

export default TSPVisualizer


