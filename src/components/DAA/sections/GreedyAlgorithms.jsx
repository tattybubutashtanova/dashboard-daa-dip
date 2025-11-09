import '../../shared/SectionStyles.css'
import './AlgorithmStyles.css'
import KnapsackSolverEnhanced from '../algorithms/KnapsackSolverEnhanced'
import CoinChangeSolverEnhanced from '../algorithms/CoinChangeSolverEnhanced'
import FormulaLayout from '../../shared/FormulaLayout'

function GreedyAlgorithms() {

  return (
    <div className="section-content">
      <h1>📍 Greedy Algorithms</h1>

      <section className="topic-card">
        <h2>Greedy Algorithm Principle</h2>
        <p>A greedy algorithm makes the locally optimal choice at each step, hoping to find a global optimum. It never reconsiders previous choices.</p>
        <div className="algorithm-box">
          <h3>Characteristics:</h3>
          <ul>
            <li>Makes greedy choice at each step</li>
            <li>No backtracking</li>
            <li>Fast but may not always give optimal solution</li>
            <li>Works well for optimization problems with greedy-choice property</li>
          </ul>
        </div>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Fractional Knapsack Problem (Greedy)"
          formula="Maximize: Σ(v_i × x_i) subject to Σ(w_i × x_i) ≤ W, 0 ≤ x_i ≤ 1"
          explanation={
            <>
              <p>Given items with weights and values, maximize value in a knapsack of limited capacity. Items can be taken fractionally.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>v_i:</strong> Value of item i</li>
                <li><strong>w_i:</strong> Weight of item i</li>
                <li><strong>x_i:</strong> Fraction of item i taken (0 to 1)</li>
                <li><strong>W:</strong> Knapsack capacity</li>
              </ul>
              <p><strong>Greedy Algorithm:</strong></p>
              <ol>
                <li>Calculate value/weight ratio for each item</li>
                <li>Sort items by ratio in descending order</li>
                <li>Take items greedily until knapsack is full</li>
                <li>If item doesn't fit completely, take fractional part</li>
              </ol>
              <p><strong>Time Complexity:</strong> O(n log n) due to sorting</p>
              <p><strong>Optimal:</strong> Yes, greedy gives optimal solution for fractional knapsack</p>
            </>
          }
        >
          <KnapsackSolverEnhanced isFractional={true} />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <h2>0/1 Knapsack Problem (Greedy approach)</h2>
        <p>Same as fractional knapsack, but items cannot be split. Greedy approach doesn't guarantee optimal solution.</p>
        <div className="example-box">
          <p><strong>Note:</strong> Greedy approach for 0/1 knapsack is not optimal. Dynamic Programming is preferred.</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Huffman Coding (Compression via Greedy method)</h2>
        <p>Variable-length encoding that assigns shorter codes to frequent characters. Optimal prefix code.</p>
        <div className="algorithm-box">
          <h3>Algorithm:</h3>
          <ol>
            <li>Count frequency of each character</li>
            <li>Create min-heap with character frequencies</li>
            <li>Repeatedly extract two nodes with minimum frequency</li>
            <li>Create new node with sum of frequencies</li>
            <li>Insert new node back into heap</li>
            <li>Repeat until one node remains (root)</li>
            <li>Assign codes: left = 0, right = 1</li>
          </ol>
        </div>
        <div className="example-box">
          <p><strong>Example:</strong> "AABBC"</p>
          <p>A: 2, B: 2, C: 1</p>
          <p>Codes: A=0, B=10, C=11</p>
        </div>
      </section>

      <section className="topic-card">
        <FormulaLayout
          title="Coin Changing Problem (Greedy)"
          formula="Minimize: Σ c_i subject to Σ(c_i × v_i) = amount, c_i ≥ 0"
          explanation={
            <>
              <p>Find minimum number of coins to make a given amount. Greedy works when coin system is canonical.</p>
              <p><strong>Where:</strong></p>
              <ul>
                <li><strong>c_i:</strong> Count of coin type i</li>
                <li><strong>v_i:</strong> Value of coin type i</li>
                <li><strong>amount:</strong> Target amount to make</li>
              </ul>
              <p><strong>Greedy Algorithm:</strong></p>
              <ol>
                <li>Sort coins in descending order</li>
                <li>For each coin, use maximum possible count</li>
                <li>Subtract value from remaining amount</li>
                <li>Repeat until amount is 0</li>
              </ol>
              <p><strong>Time Complexity:</strong> O(n) where n is number of coin types</p>
              <p><strong>Optimal:</strong> Only for canonical coin systems (e.g., US coins)</p>
              <p><strong>Example:</strong> Amount = 67, Coins = [25, 10, 5, 1] → 2×25 + 1×10 + 1×5 + 2×1 = 6 coins</p>
              <p><strong>Note:</strong> Greedy fails for [1, 3, 4] with amount 6 (greedy: 4+1+1=3 coins, optimal: 3+3=2 coins)</p>
            </>
          }
        >
          <CoinChangeSolverEnhanced />
        </FormulaLayout>
      </section>

      <section className="topic-card">
        <h2>Dijkstra's Algorithm (Single Source Shortest Path)</h2>
        <p>Finds shortest paths from a source vertex to all other vertices in a weighted graph.</p>
        <div className="algorithm-box">
          <h3>Algorithm:</h3>
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
        </div>
        <div className="formula">
          <p><strong>Time Complexity:</strong> O((V + E) log V) with binary heap</p>
          <p><strong>Space Complexity:</strong> O(V)</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Traveling Salesman Problem (Greedy Heuristic)</h2>
        <p>Find shortest route visiting all cities exactly once and returning to start. Greedy provides approximate solution.</p>
        <div className="algorithm-box">
          <h3>Nearest Neighbor Heuristic:</h3>
          <ol>
            <li>Start at an arbitrary city</li>
            <li>At each step, visit nearest unvisited city</li>
            <li>Return to starting city</li>
          </ol>
        </div>
        <div className="example-box">
          <p><strong>Note:</strong> Greedy TSP doesn't guarantee optimal solution but is fast (O(n²)).</p>
        </div>
      </section>
    </div>
  )
}

export default GreedyAlgorithms

