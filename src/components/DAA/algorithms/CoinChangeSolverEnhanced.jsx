import { useState } from 'react'
import StepByStepDisplay from '../../shared/StepByStepDisplay'
import './AlgorithmVisualizer.css'

function CoinChangeSolverEnhanced() {
  const [coins, setCoins] = useState([1, 3, 4])
  const [amount, setAmount] = useState(6)
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])
  const [newCoin, setNewCoin] = useState('')
  const [approach, setApproach] = useState('dp')

  const addCoin = () => {
    const coin = parseInt(newCoin)
    if (coin && !coins.includes(coin)) {
      setCoins([...coins, coin].sort((a, b) => b - a))
      setNewCoin('')
    }
  }

  const removeCoin = (coin) => {
    setCoins(coins.filter(c => c !== coin))
  }

  const solveDP = () => {
    const solutionSteps = []
    const dp = Array(amount + 1).fill(Infinity)
    dp[0] = 0
    const usedCoins = Array(amount + 1).fill(null)

    solutionSteps.push({
      description: `Initialize DP array: dp[amount] = minimum coins needed for amount`,
      data: `Array size: ${amount + 1}, dp[0] = 0 (base case)`
    })

    for (let i = 1; i <= amount; i++) {
      solutionSteps.push({
        description: `Computing dp[${i}]:`,
      })

      let minCoins = Infinity
      let bestCoin = null

      for (const coin of coins) {
        if (i >= coin && dp[i - coin] + 1 < minCoins) {
          minCoins = dp[i - coin] + 1
          bestCoin = coin
          solutionSteps.push({
            description: `  Try coin ${coin}: dp[${i - coin}] + 1 = ${dp[i - coin]} + 1 = ${minCoins}`,
          })
        }
      }

      if (minCoins < Infinity) {
        dp[i] = minCoins
        usedCoins[i] = bestCoin
        solutionSteps.push({
          description: `  dp[${i}] = ${minCoins} (using coin ${bestCoin})`,
          result: `Minimum coins for ${i}: ${minCoins}`
        })
      } else {
        solutionSteps.push({
          description: `  Cannot make ${i} with given coins`,
        })
      }
    }

    if (dp[amount] === Infinity) {
      setSteps(solutionSteps)
      setResult({ possible: false, approach: 'DP' })
      return
    }

    // Reconstruct
    const solution = []
    let remaining = amount
    solutionSteps.push({
      description: `Reconstructing solution:`,
    })

    while (remaining > 0) {
      const coin = usedCoins[remaining]
      solution.push(coin)
      solutionSteps.push({
        description: `  Use coin ${coin}, remaining: ${remaining} - ${coin} = ${remaining - coin}`,
      })
      remaining -= coin
    }

    solutionSteps.push({
      description: `Final Solution:`,
      data: solution.join(' + ') + ` = ${amount}`,
      result: `Minimum coins: ${dp[amount]}`
    })

    setSteps(solutionSteps)
    setResult({
      possible: true,
      minCoins: dp[amount],
      coins: solution,
      approach: 'DP'
    })
  }

  const solveGreedy = () => {
    const solutionSteps = []
    const sortedCoins = [...coins].sort((a, b) => b - a)
    const solution = []
    let remaining = amount
    let totalCoins = 0

    solutionSteps.push({
      description: `Sort coins in descending order: ${sortedCoins.join(', ')}`,
    })

    solutionSteps.push({
      description: `Start with amount = ${amount}`,
    })

    for (let i = 0; i < sortedCoins.length; i++) {
      const coin = sortedCoins[i]
      const count = Math.floor(remaining / coin)
      if (count > 0) {
        for (let j = 0; j < count; j++) {
          solution.push(coin)
        }
        totalCoins += count
        const valueUsed = coin * count
        solutionSteps.push({
          description: `Step ${i + 1}: Use ${count} coin(s) of ${coin} (value: ${valueUsed})`,
          data: `Remaining: ${remaining} - ${valueUsed} = ${remaining - valueUsed}`,
          result: `Added ${count} coin(s) of ${coin}`
        })
        remaining -= valueUsed
      }
    }

    if (remaining === 0) {
      solutionSteps.push({
        description: `Final Solution:`,
        data: solution.join(' + ') + ` = ${amount}`,
        result: `Total coins: ${totalCoins}`
      })
      setSteps(solutionSteps)
      setResult({
        possible: true,
        minCoins: totalCoins,
        coins: solution,
        approach: 'Greedy'
      })
    } else {
      solutionSteps.push({
        description: `Cannot make exact amount! Remaining: ${remaining}`,
      })
      setSteps(solutionSteps)
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

      {steps.length > 0 && (
        <StepByStepDisplay steps={steps} title="Step-by-Step Solution" />
      )}

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

export default CoinChangeSolverEnhanced

