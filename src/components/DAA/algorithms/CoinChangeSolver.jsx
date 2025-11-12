import { useMemo, useState } from 'react'
import './AlgorithmVisualizer.css'

function normalizeCoins(arr) {
  return Array.from(new Set(arr.filter((n) => n > 0).map((n) => Math.floor(n)))).sort((a, b) => a - b)
}

function CoinChangeSolver() {
  const [coins, setCoins] = useState([1, 3, 4])
  const [amount, setAmount] = useState(6)
  const [dpWidth, setDpWidth] = useState(6) // maximum j for DP table columns
  const [result, setResult] = useState(null)
  const [newCoin, setNewCoin] = useState('')
  const [approach, setApproach] = useState('dp') // 'dp' or 'greedy'
  const [steps, setSteps] = useState([])
  const [dpTable, setDpTable] = useState(null)

  const sortedCoins = useMemo(() => normalizeCoins(coins), [coins])

  const addCoin = () => {
    const coin = Math.floor(Number(newCoin))
    if (!coin || coin <= 0) return
    const next = normalizeCoins([...coins, coin])
    setCoins(next)
    setNewCoin('')
    resetOutputs()
  }

  const updateCoin = (idx, value) => {
    const coin = Math.floor(Number(value))
    if (!coin || coin <= 0) return
    const next = normalizeCoins(coins.map((c, i) => (i === idx ? coin : c)))
    setCoins(next)
    resetOutputs()
  }

  const removeCoin = (coin) => {
    setCoins(normalizeCoins(coins.filter((c) => c !== coin)))
    resetOutputs()
  }

  const resetOutputs = () => {
    setResult(null)
    setSteps([])
    setDpTable(null)
  }

  const solveDP = () => {
    if (!sortedCoins.length || dpWidth <= 0) {
      resetOutputs()
      return
    }
    const n = sortedCoins.length
    const maxAmount = Math.max(dpWidth, 0)
    const table = Array.from({ length: n + 1 }, () => Array(maxAmount + 1).fill(Infinity))
    const choice = Array.from({ length: n + 1 }, () => Array(maxAmount + 1).fill(false))

    for (let i = 0; i <= n; i++) table[i][0] = 0

    const logSteps = [
      { title: 'Initialise', detail: 'Set first column (amount 0) to 0 and others to Infinity.' },
    ]

    for (let i = 1; i <= n; i++) {
      const coin = sortedCoins[i - 1]
      for (let amt = 1; amt <= maxAmount; amt++) {
        const without = table[i - 1][amt]
        let withCoin = Infinity
        if (amt >= coin && table[i][amt - coin] !== Infinity) {
          withCoin = table[i][amt - coin] + 1
        }
        if (withCoin < without) {
          table[i][amt] = withCoin
          choice[i][amt] = true
        } else {
          table[i][amt] = without
        }
      }
      logSteps.push({
        title: `Process coin d${i} = ${coin}`,
        detail: `Update row ${i} using unlimited ${coin}s.`,
      })
    }

    if (table[n][Math.min(amount, maxAmount)] === Infinity) {
      setResult({ possible: false, approach: 'Dynamic Programming', coins: [], minCoins: Infinity })
      setSteps([
        ...logSteps,
        { title: 'Conclusion', detail: `Amount ${amount} cannot be formed with given denominations.` },
      ])
      setDpTable({ table, coins: sortedCoins, amount: maxAmount })
      return
    }

    // Reconstruct coins
    const usedCoins = []
    let i = n
    let amt = Math.min(amount, maxAmount)
    while (amt > 0 && i > 0) {
      const coin = sortedCoins[i - 1]
      if (choice[i][amt]) {
        usedCoins.push(coin)
        amt -= coin
        logSteps.push({ title: 'Select coin', detail: `Take ${coin}, remaining amount ${amt}.` })
      } else {
        i--
      }
    }

    usedCoins.reverse()
    setResult({
      possible: true,
      minCoins: table[n][Math.min(amount, maxAmount)],
      coins: usedCoins,
      approach: 'Dynamic Programming',
    })
    setSteps([
      ...logSteps,
      { title: 'Conclusion', detail: `Optimal solution uses ${usedCoins.length} coins: ${usedCoins.join(', ')}.` },
    ])
    setDpTable({ table, coins: sortedCoins, amount: maxAmount })
  }

  const solveGreedy = () => {
    if (!sortedCoins.length || amount <= 0) {
      resetOutputs()
      return
    }
    const descending = [...sortedCoins].sort((a, b) => b - a)
    const solution = []
    const logSteps = [
      { title: 'Sort coins', detail: `Descending order: ${descending.join(', ')}.` },
    ]
    let remaining = amount
    let totalCoins = 0

    for (const coin of descending) {
      if (remaining <= 0) break
      const count = Math.floor(remaining / coin)
      if (count > 0) {
        solution.push(...Array(count).fill(coin))
        remaining -= coin * count
        totalCoins += count
        logSteps.push({
          title: `Use coin ${coin}`,
          detail: `Take ${count} × ${coin}. Remaining amount: ${remaining}.`,
        })
      } else {
        logSteps.push({
          title: `Skip coin ${coin}`,
          detail: `Too large for remaining amount ${remaining}.`,
        })
      }
    }

    if (remaining === 0) {
      logSteps.push({
        title: 'Conclusion',
        detail: `Greedy found a solution with ${totalCoins} coins: ${solution.join(', ')}.`,
      })
      setResult({
        possible: true,
        minCoins: totalCoins,
        coins: solution,
        approach: 'Greedy',
      })
    } else {
      logSteps.push({
        title: 'Conclusion',
        detail: `Remaining amount ${remaining} cannot be formed with greedy choices.`,
      })
      setResult({ possible: false, approach: 'Greedy', coins: [], minCoins: Infinity })
    }
    setSteps(logSteps)
    setDpTable(null)
  }

  const solve = () => {
    if (approach === 'dp') {
      solveDP()
    } else {
      solveGreedy()
    }
  }

  const renderSteps = () => {
    if (!steps.length) return null
    return (
      <div className="steps-display">
        <h5>Solution Steps</h5>
        <ol>
          {steps.map((step, idx) => (
            <li key={`${step.title}-${idx}`}>
              <strong>{step.title}:</strong> {step.detail}
            </li>
          ))}
        </ol>
      </div>
    )
  }

  const renderDpTable = () => {
    if (!dpTable) return null
    const { table, coins: tableCoins, amount: maxAmount } = dpTable
    return (
      <div className="dp-table-wrapper">
        <h5>Dynamic Programming Table (rows: coin types d, columns: amount)</h5>
        <div className="dp-table-scroll">
          <table className="dp-table">
            <thead>
              <tr>
                <th>d / amount</th>
                {Array.from({ length: maxAmount + 1 }, (_, amt) => (
                  <th key={`amt-${amt}`}>{amt}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, rIdx) => (
                <tr key={`row-${rIdx}`}>
                  <th>{rIdx === 0 ? '0 (no coin)' : `d${rIdx} = ${tableCoins[rIdx - 1]}`}</th>
                  {row.map((val, cIdx) => (
                    <td key={`cell-${rIdx}-${cIdx}`}>{val === Infinity ? '∞' : val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="algorithm-solver">
      <div className="solver-controls">
        <div className="input-group">
          <label>
            Target Amount:
            <input
              type="number"
              value={amount}
              min="1"
              onChange={(e) => {
                setAmount(Math.max(0, Math.floor(Number(e.target.value) || 0)))
                resetOutputs()
              }}
            />
          </label>
        </div>
        <div className="input-group">
          <label>
            DP Table Max j (weight/capacity):
            <input
              type="number"
              value={dpWidth}
              min="1"
              onChange={(e) => {
                setDpWidth(Math.max(0, Math.floor(Number(e.target.value) || 0)))
                resetOutputs()
              }}
            />
          </label>
        </div>

        <div className="approach-selector">
          <label>
            <input
              type="radio"
              value="dp"
              checked={approach === 'dp'}
              onChange={(e) => {
                setApproach(e.target.value)
                resetOutputs()
              }}
            />
            Dynamic Programming (Unbounded)
          </label>
          <label>
            <input
              type="radio"
              value="greedy"
              checked={approach === 'greedy'}
              onChange={(e) => {
                setApproach(e.target.value)
                resetOutputs()
              }}
            />
            Greedy (Largest-first)
          </label>
        </div>

        <div className="add-item">
          <h4>Add Coin Denomination</h4>
          <div className="item-inputs">
            <input
              type="number"
              placeholder="d (denomination)"
              value={newCoin}
              onChange={(e) => setNewCoin(e.target.value)}
              min="1"
            />
            <button onClick={addCoin}>Add</button>
          </div>
        </div>
      </div>

      <div className="items-list">
        <h4>Coin Types (dᵢ and weight wᵢ = denomination)</h4>
        <div className="coins-display detailed">
          {sortedCoins.length === 0 && <p>No coins added yet.</p>}
          {sortedCoins.map((coin, idx) => (
            <div key={`coin-${coin}-${idx}`} className="coin-item editable">
              <div className="coin-label">d{idx + 1}</div>
              <input
                type="number"
                min="1"
                value={coin}
                onChange={(e) => updateCoin(idx, e.target.value)}
              />
              <span className="coin-weight">w = {coin}</span>
              <button className="remove-btn" onClick={() => removeCoin(coin)}>×</button>
            </div>
          ))}
        </div>
      </div>

      <button className="solve-btn" onClick={solve}>
        Solve Coin Change
      </button>

      {result && (
        <div className="result-box">
          <h4>Result — {result.approach}</h4>
          {result.possible ? (
            <>
              <p className="total-value">Coins required: {result.minCoins}</p>
              <div className="selected-items">
                <h5>Coins Used (in order selected):</h5>
                <div className="coins-solution">
                  {result.coins.map((coin, idx) => (
                    <span key={`${coin}-${idx}`} className="coin-badge">{coin}</span>
                  ))}
                </div>
                <p className="solution-text">
                  {result.coins.join(' + ')} = {amount}
                </p>
              </div>
            </>
          ) : (
            <p className="error-text">Unable to form {amount} with the provided denominations.</p>
          )}
        </div>
      )}

      {renderSteps()}
      {renderDpTable()}
    </div>
  )
}

export default CoinChangeSolver

