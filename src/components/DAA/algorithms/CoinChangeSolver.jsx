import { useState } from 'react'
import './AlgorithmVisualizer.css'

function CoinChangeSolver() {
  const [coins, setCoins] = useState([1, 3, 4])
  const [amount, setAmount] = useState(6)
  const [result, setResult] = useState(null)
  const [newCoin, setNewCoin] = useState('')
  const [approach, setApproach] = useState('dp') // 'dp' or 'greedy'

  const addCoin = () => {
    const coin = parseInt(newCoin)
    if (coin && !coins.includes(coin)) {
      setCoins([...coins].sort((a, b) => b - a))
      setNewCoin('')
    }
  }

  const removeCoin = (coin) => {
    setCoins(coins.filter(c => c !== coin))
  }

  const solveDP = () => {
    const dp = Array(amount + 1).fill(Infinity)
    dp[0] = 0
    const usedCoins = Array(amount + 1).fill(null)

    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (i >= coin && dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1
          usedCoins[i] = coin
        }
      }
    }

    if (dp[amount] === Infinity) {
      setResult({ possible: false, approach: 'DP' })
      return
    }

    // Reconstruct solution
    const solution = []
    let remaining = amount
    while (remaining > 0) {
      const coin = usedCoins[remaining]
      solution.push(coin)
      remaining -= coin
    }

    setResult({
      possible: true,
      minCoins: dp[amount],
      coins: solution,
      approach: 'DP'
    })
  }

  const solveGreedy = () => {
    const sortedCoins = [...coins].sort((a, b) => b - a)
    const solution = []
    let remaining = amount
    let totalCoins = 0

    for (const coin of sortedCoins) {
      const count = Math.floor(remaining / coin)
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          solution.push(coin)
        }
        totalCoins += count
        remaining -= coin * count
      }
    }

    if (remaining === 0) {
      setResult({
        possible: true,
        minCoins: totalCoins,
        coins: solution,
        approach: 'Greedy'
      })
    } else {
      setResult({ possible: false, approach: 'Greedy' })
    }
  }

  const solve = () => {
    if (approach === 'dp') {
      solveDP()
    } else {
      solveGreedy()
    }
  }

  return (
    <div className="algorithm-solver">
      <div className="solver-controls">
        <div className="input-group">
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              min="1"
            />
          </label>
        </div>

        <div className="approach-selector">
          <label>
            <input
              type="radio"
              value="dp"
              checked={approach === 'dp'}
              onChange={(e) => setApproach(e.target.value)}
            />
            Dynamic Programming
          </label>
          <label>
            <input
              type="radio"
              value="greedy"
              checked={approach === 'greedy'}
              onChange={(e) => setApproach(e.target.value)}
            />
            Greedy
          </label>
        </div>

        <div className="add-item">
          <h4>Add Coin</h4>
          <div className="item-inputs">
            <input
              type="number"
              placeholder="Coin value"
              value={newCoin}
              onChange={(e) => setNewCoin(e.target.value)}
              min="1"
            />
            <button onClick={addCoin}>Add</button>
          </div>
        </div>
      </div>

      <div className="items-list">
        <h4>Available Coins:</h4>
        <div className="coins-display">
          {coins.map(coin => (
            <div key={coin} className="coin-item">
              <span>{coin}</span>
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
          <h4>Result ({result.approach}):</h4>
          {result.possible ? (
            <>
              <p className="total-value">Minimum Coins: {result.minCoins}</p>
              <div className="selected-items">
                <h5>Coins Used:</h5>
                <div className="coins-solution">
                  {result.coins.map((coin, idx) => (
                    <span key={idx} className="coin-badge">{coin}</span>
                  ))}
                </div>
                <p className="solution-text">
                  {result.coins.join(' + ')} = {amount}
                </p>
              </div>
            </>
          ) : (
            <p className="error-text">Cannot make {amount} with given coins!</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CoinChangeSolver

