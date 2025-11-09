import { useState } from 'react'
import './AlgorithmVisualizer.css'

function KnapsackSolver({ isFractional = false }) {
  const [items, setItems] = useState([
    { id: 1, weight: 10, value: 60, selected: false },
    { id: 2, weight: 20, value: 100, selected: false },
    { id: 3, weight: 30, value: 120, selected: false },
  ])
  const [capacity, setCapacity] = useState(50)
  const [result, setResult] = useState(null)
  const [newItem, setNewItem] = useState({ weight: '', value: '' })

  const addItem = () => {
    if (newItem.weight && newItem.value) {
      setItems([...items, {
        id: items.length + 1,
        weight: parseInt(newItem.weight),
        value: parseInt(newItem.value),
        selected: false
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
    // Greedy approach for fractional knapsack
    const sorted = [...items]
      .map(item => ({
        ...item,
        ratio: item.value / item.weight
      }))
      .sort((a, b) => b.ratio - a.ratio)

    let remaining = capacity
    let totalValue = 0
    const selected = []

    for (const item of sorted) {
      if (remaining >= item.weight) {
        selected.push({ ...item, fraction: 1.0, usedWeight: item.weight })
        totalValue += item.value
        remaining -= item.weight
      } else if (remaining > 0) {
        const fraction = remaining / item.weight
        selected.push({ ...item, fraction, usedWeight: remaining })
        totalValue += item.value * fraction
        remaining = 0
      }
    }

    setResult({ selected, totalValue: totalValue.toFixed(2), approach: 'Greedy' })
  }

  const solve01 = () => {
    // Dynamic Programming for 0/1 knapsack
    const n = items.length
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0))

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (items[i - 1].weight <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - items[i - 1].weight] + items[i - 1].value
          )
        } else {
          dp[i][w] = dp[i - 1][w]
        }
      }
    }

    // Backtrack to find selected items
    const selected = []
    let w = capacity
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.push({ ...items[i - 1], fraction: 1.0, usedWeight: items[i - 1].weight })
        w -= items[i - 1].weight
      }
    }

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

      {result && (
        <div className="result-box">
          <h4>Result ({result.approach}):</h4>
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

export default KnapsackSolver

