import '../../shared/SectionStyles.css'
import './AlgorithmStyles.css'
import KnapsackSolverEnhanced from '../algorithms/KnapsackSolverEnhanced'
import CoinChangeSolverEnhanced from '../algorithms/CoinChangeSolverEnhanced'
import FormulaLayout from '../../shared/FormulaLayout'

function DynamicProgramming() {
  return (
    <div className="section-content">
      <h1>🧮 Dynamic Programming</h1>

      <section className="topic-card">
        <h2>Dynamic Programming Principle</h2>
        <p>Dynamic Programming solves complex problems by breaking them into simpler subproblems and storing results to avoid recomputation.</p>
        <div className="algorithm-box">
          <h3>Key Characteristics:</h3>
          <ul>
            <li><strong>Optimal Substructure:</strong> Optimal solution contains optimal solutions to subproblems</li>
            <li><strong>Overlapping Subproblems:</strong> Same subproblems are solved multiple times</li>
            <li><strong>Memoization:</strong> Store results of subproblems (top-down)</li>
            <li><strong>Tabulation:</strong> Build table of results (bottom-up)</li>
          </ul>
        </div>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="0/1 Knapsack Problem (Dynamic Programming)"
          formula="dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])"
          explanation={
            <>
              <p>Given items with weights and values, maximize value in a knapsack of limited capacity. Items cannot be split.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>dp[i][w]:</strong> Maximum value with first i items and capacity w</li>
                <li><strong>weight[i]:</strong> Weight of item i</li>
                <li><strong>value[i]:</strong> Value of item i</li>
              </ul>
              <p><strong>DP Algorithm:</strong></p>
              <ol>
                <li>Create 2D table dp[n+1][W+1]</li>
                <li>Initialize: dp[0][w] = 0 for all w</li>
                <li>For each item i and capacity w:
                  <ul>
                    <li>If weight[i] &gt; w: dp[i][w] = dp[i-1][w] (can't take)</li>
                    <li>Else: dp[i][w] = max(not take, take)</li>
                  </ul>
                </li>
                <li>Return dp[n][W]</li>
              </ol>
              <p><strong>Time Complexity:</strong> O(n × W)</p>
              <p><strong>Space Complexity:</strong> O(n × W) or O(W) with optimization</p>
              <p><strong>Optimal:</strong> Yes, DP always gives optimal solution</p>
            </>
          }
        >
          <KnapsackSolverEnhanced isFractional={false} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Coin Changing Problem (Dynamic Programming)"
          formula="dp[amount] = min(dp[amount - coin] + 1) for all coins where coin ≤ amount"
          explanation={
            <>
              <p>Find minimum number of coins to make a given amount. Works for any coin system.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>dp[amount]:</strong> Minimum coins needed for amount</li>
                <li><strong>coin:</strong> Value of available coin</li>
              </ul>
              <p><strong>DP Algorithm:</strong></p>
              <ol>
                <li>Create array dp[amount+1], initialize with ∞</li>
                <li>dp[0] = 0 (base case: 0 coins for amount 0)</li>
                <li>For each amount from 1 to target:
                  <ul>
                    <li>For each coin:</li>
                    <li>If coin ≤ amount: dp[amount] = min(dp[amount], dp[amount-coin] + 1)</li>
                  </ul>
                </li>
                <li>Return dp[target]</li>
              </ol>
              <p><strong>Time Complexity:</strong> O(amount × n) where n is number of coin types</p>
              <p><strong>Space Complexity:</strong> O(amount)</p>
              <p><strong>Optimal:</strong> Yes, DP always gives optimal solution for any coin system</p>
              <p><strong>Example:</strong> Amount = 11, Coins = [1, 3, 4]</p>
              <p>dp[0]=0, dp[1]=1, dp[2]=2, dp[3]=1, dp[4]=1, ..., dp[11]=3</p>
            </>
          }
        >
          <CoinChangeSolverEnhanced />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <h2>All-Pairs Shortest Path (Floyd–Warshall)</h2>
        <p>Finds shortest paths between all pairs of vertices in a weighted graph.</p>
        <div className="algorithm-box">
          <h3>Algorithm:</h3>
          <div className="formula">
            <p>dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])</p>
            <p>for all intermediate vertices k</p>
          </div>
          <ol>
            <li>Initialize dist matrix with edge weights</li>
            <li>For each vertex k (intermediate):
              <ul>
                <li>For each pair (i, j):</li>
                <li>If dist[i][k] + dist[k][j] &lt; dist[i][j]:</li>
                <li>Update dist[i][j]</li>
              </ul>
            </li>
          </ol>
        </div>
        <div className="formula">
          <p><strong>Time Complexity:</strong> O(V³)</p>
          <p><strong>Space Complexity:</strong> O(V²)</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Longest Common Subsequence Problem (LCS)</h2>
        <p>Find the longest subsequence common to two sequences (not necessarily contiguous).</p>
        <div className="algorithm-box">
          <h3>DP Approach:</h3>
          <div className="formula">
            <p>if X[i] == Y[j]: dp[i][j] = 1 + dp[i-1][j-1]</p>
            <p>else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])</p>
          </div>
          <ol>
            <li>Create 2D table dp[m+1][n+1]</li>
            <li>Initialize first row and column to 0</li>
            <li>Fill table using recurrence relation</li>
            <li>Length = dp[m][n]</li>
            <li>Backtrack to find actual LCS</li>
          </ol>
        </div>
        <div className="example-box">
          <p><strong>Example:</strong> X = "ABCDGH", Y = "AEDFHR"</p>
          <p>LCS = "ADH", Length = 3</p>
        </div>
        <div className="formula">
          <p><strong>Time Complexity:</strong> O(m × n)</p>
          <p><strong>Space Complexity:</strong> O(m × n) or O(min(m, n)) with optimization</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Traveling Salesman Problem (DP approach)</h2>
        <p>Find shortest route visiting all cities exactly once. DP solution uses bitmasking.</p>
        <div className="algorithm-box">
          <h3>DP with Bitmasking:</h3>
          <div className="formula">
            <p>dp[mask][i] = minimum cost to visit cities in mask ending at city i</p>
            <p>dp[mask][i] = min(dp[mask^(1&lt;&lt;i)][j] + dist[j][i]) for all j in mask</p>
          </div>
          <ol>
            <li>Create dp[2^n][n] table</li>
            <li>Initialize: dp[1][0] = 0 (starting at city 0)</li>
            <li>For each mask and city i:
              <ul>
                <li>If city i is in mask:</li>
                <li>Try all previous cities j in mask</li>
                <li>Update dp[mask][i]</li>
              </ul>
            </li>
            <li>Return min(dp[2^n-1][i] + dist[i][0]) for all i</li>
          </ol>
        </div>
        <div className="formula">
          <p><strong>Time Complexity:</strong> O(n² × 2^n)</p>
          <p><strong>Space Complexity:</strong> O(n × 2^n)</p>
        </div>
        <div className="example-box">
          <p><strong>Note:</strong> Much better than O(n!) brute force, but still exponential.</p>
        </div>
      </section>
    </div>
  )
}

export default DynamicProgramming

