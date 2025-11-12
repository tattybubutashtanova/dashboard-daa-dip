import '../../shared/SectionStyles.css'
import './AlgorithmStyles.css'
import FormulaLayout from '../../shared/FormulaLayout'
import CoinChangeSolver from '../algorithms/CoinChangeSolver'

function GreedyAlgorithms() {
  return (
    <div className="section-content">
      <h1>🪙 Coin Changing Problem</h1>

      <section className="topic-card">
        <FormulaLayout
          title="Coin Changing — Greedy and Dynamic Programming"
          formula="DP (unbounded): dp[i][j] = min(dp[i-1][j], 1 + dp[i][j - d_i])"
          explanation={
            <>
              <p>Enter coin denominations (ascending d₁..dₙ), choose a target amount, and optionally set the DP table width j (0..W). The solver shows:</p>
              <ul>
                <li>Greedy steps: largest-first selection with running remainder</li>
                <li>DP table: rows are coin types i with denomination dᵢ; columns j from 0..W</li>
                <li>Backtracked optimal set of coins for the amount</li>
              </ul>
            </>
          }
        >
          <CoinChangeSolver />
        </FormulaLayout>
      </section>
    </div>
  )
}

export default GreedyAlgorithms

