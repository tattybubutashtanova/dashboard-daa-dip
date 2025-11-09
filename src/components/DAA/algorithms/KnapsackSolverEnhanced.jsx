import { useState } from 'react'
import StepByStepDisplay from '../../shared/StepByStepDisplay'
import './AlgorithmVisualizer.css'

function KnapsackSolverEnhanced({ isFractional = false }) {
  const [items, setItems] = useState([
    { id: 1, weight: 10, value: 60 },
    { id: 2, weight: 20, value: 100 },
    { id: 3, weight: 30, value: 120 },
  ])
  const [capacity, setCapacity] = useState(50)
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])
  const [newItem, setNewItem] = useState({ weight: '', value: '' })

  const addItem = () => {
    if (newItem.weight && newItem.value) {
      setItems([...items, {
        id: items.length + 1,
        weight: parseInt(newItem.weight),
        value: parseInt(newItem.value),
      }])
      setNewItem({ weight: '', value: '' })
    }
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const solve = () => {
    if (isFractional) {
      solveFractional()
    } else {
      solve01()
    }
  }

  const solveFractional = () => {
    const solutionSteps = []
    const sorted = [...items]
      .map(item => ({
        ...item,
        ratio: item.value / item.weight
      }))
      .sort((a, b) => b.ratio - a.ratio)

    solutionSteps.push({
      description: `Calculate value/weight ratio for each item and sort in descending order:`,
      data: sorted.map(item => `Item ${item.id}: Weight=${item.weight}, Value=${item.value}, Ratio=${item.ratio.toFixed(2)}`).join('\n')
    })

    let remaining = capacity
    let totalValue = 0
    const selected = []

    solutionSteps.push({
      description: `Start with capacity = ${capacity}. Process items in order of highest ratio:`,
    })

    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i]
      if (remaining >= item.weight) {
        selected.push({ ...item, fraction: 1.0, usedWeight: item.weight })
        totalValue += item.value
        remaining -= item.weight
        solutionSteps.push({
          description: `Step ${i + 1}: Take all of Item ${item.id} (Weight: ${item.weight}, Value: ${item.value})`,
          data: `Remaining capacity: ${remaining}, Total value: ${totalValue.toFixed(2)}`,
          result: `Added Item ${item.id} completely`
        })
      } else if (remaining > 0) {
        const fraction = remaining / item.weight
        selected.push({ ...item, fraction, usedWeight: remaining })
        totalValue += item.value * fraction
        solutionSteps.push({
          description: `Step ${i + 1}: Take ${(fraction * 100).toFixed(1)}% of Item ${item.id} (Weight: ${item.weight}, Value: ${item.value})`,
          data: `Fraction taken: ${fraction.toFixed(2)}, Value gained: ${(item.value * fraction).toFixed(2)}`,
          result: `Added ${(fraction * 100).toFixed(1)}% of Item ${item.id}`
        })
        remaining = 0
        break
      } else {
        solutionSteps.push({
          description: `Step ${i + 1}: Skip Item ${item.id} (no capacity remaining)`,
        })
      }
    }

    solutionSteps.push({
      description: `Final Solution:`,
      result: `Total Value: ${totalValue.toFixed(2)}`
    })

    setSteps(solutionSteps)
    setResult({ selected, totalValue: totalValue.toFixed(2), approach: 'Greedy' })
  }

  const solve01 = () => {
    const solutionSteps = []
    const n = items.length
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0))

    solutionSteps.push({
      description: `Initialize DP table: dp[i][w] = maximum value with first i items and capacity w`,
      data: `Table size: ${n + 1} rows × ${capacity + 1} columns`
    })

    solutionSteps.push({
      description: `Base case: dp[0][w] = 0 for all w (no items, no value)`,
    })

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1]
      solutionSteps.push({
        description: `Processing Item ${i} (Weight: ${item.weight}, Value: ${item.value}):`,
      })

      for (let w = 0; w <= capacity; w++) {
        if (item.weight <= w) {
          const notTake = dp[i - 1][w]
          const take = dp[i - 1][w - item.weight] + item.value
          dp[i][w] = Math.max(notTake, take)
          
          if (w === capacity || w === capacity - 1 || w === capacity - 2) {
            solutionSteps.push({
              description: `  For capacity ${w}: max(not take=${notTake}, take=${take}) = ${dp[i][w]}`,
            })
          }
        } else {
          dp[i][w] = dp[i - 1][w]
        }
      }
    }

    // Backtrack
    const selected = []
    let w = capacity
    solutionSteps.push({
      description: `Backtracking to find selected items:`,
    })

    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.push({ ...items[i - 1], fraction: 1.0, usedWeight: items[i - 1].weight })
        solutionSteps.push({
          description: `  Item ${i} selected (Weight: ${items[i - 1].weight}, Value: ${items[i - 1].value})`,
          data: `Remaining capacity: ${w - items[i - 1].weight}`
        })
        w -= items[i - 1].weight
      }
    }

    solutionSteps.push({
      description: `Final Solution:`,
      result: `Maximum Value: ${dp[n][capacity]}`
    })

    setSteps(solutionSteps)
    setResult({
      selected,
      totalValue: dp[n][capacity],
      approach: 'Dynamic Programming'
    })
  }

  return (
    <div className="algorithm-solver">
      <div className="solver-controls">
        <div className="input-group">
          <label>
            Capacity:
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
              min="1"
            />
          </label>
        </div>

        <div className="add-item">
          <h4>Add Item</h4>
          <div className="item-inputs">
            <input
              type="number"
              placeholder="Weight"
              value={newItem.weight}
              onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
            />
            <input
              type="number"
              placeholder="Value"
              value={newItem.value}
              onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
            />
            <button onClick={addItem}>Add</button>
          </div>
        </div>
      </div>

      <div className="items-list">
        <h4>Items:</h4>
        {items.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-info">
              <span>Item {item.id}:</span>
              <span>Weight: {item.weight}</span>
              <span>Value: {item.value}</span>
              <span>Ratio: {(item.value / item.weight).toFixed(2)}</span>
            </div>
            <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <button className="solve-btn" onClick={solve}>
        Solve {isFractional ? 'Fractional' : '0/1'} Knapsack
      </button>

      {steps.length > 0 && (
        <StepByStepDisplay steps={steps} title="Step-by-Step Solution" />
      )}

      {result && (
        <div className="result-box">
          <h4>Final Result ({result.approach}):</h4>
          <p className="total-value">Total Value: {result.totalValue}</p>
          <div className="selected-items">
            <h5>Selected Items:</h5>
            {result.selected.map((item, idx) => (
              <div key={idx} className="selected-item">
                <span>Item {item.id}:</span>
                <span>Weight: {item.usedWeight}/{item.weight}</span>
                <span>Value: {item.fraction < 1 ? (item.value * item.fraction).toFixed(2) : item.value}</span>
                {item.fraction < 1 && <span>Fraction: {(item.fraction * 100).toFixed(1)}%</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default KnapsackSolverEnhanced

