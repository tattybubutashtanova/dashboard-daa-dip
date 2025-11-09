import '../../shared/SectionStyles.css'

function BruteForce() {
  return (
    <div className="section-content">
      <h1>🧠 Brute Force</h1>

      <section className="topic-card">
        <h2>Brute Force Algorithm</h2>
        <p>Brute Force is a straightforward approach that tries all possible solutions to find the optimal one. It's simple but often inefficient.</p>
        <div className="algorithm-box">
          <h3>Characteristics:</h3>
          <ul>
            <li>Examines all possible solutions</li>
            <li>Guarantees finding optimal solution</li>
            <li>Simple to implement</li>
            <li>Usually very slow (exponential time complexity)</li>
            <li>No special data structures or optimizations needed</li>
          </ul>
        </div>
      </section>

      <section className="topic-card">
        <h2>Traveling Salesman Problem (Brute Force enumeration)</h2>
        <p>Try all possible permutations of cities to find the shortest tour.</p>
        <div className="algorithm-box">
          <h3>Algorithm:</h3>
          <ol>
            <li>Generate all permutations of n cities</li>
            <li>For each permutation:
              <ul>
                <li>Calculate total distance of tour</li>
                <li>Keep track of minimum distance</li>
              </ul>
            </li>
            <li>Return tour with minimum distance</li>
          </ol>
        </div>
        <div className="formula">
          <p><strong>Number of Permutations:</strong> (n-1)! / 2</p>
          <p>(Divide by 2 because reverse tours are equivalent)</p>
          <p><strong>Time Complexity:</strong> O(n!)</p>
        </div>
        <div className="example-box">
          <p><strong>Example:</strong> For 5 cities</p>
          <p>Number of tours: 4! / 2 = 12</p>
          <p>For 10 cities: 9! / 2 = 181,440</p>
          <p>For 20 cities: 19! / 2 ≈ 6 × 10¹⁶ (impractical!)</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>When to Use Brute Force</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Small Problem Size</h3>
            <p>When input size is small enough that exponential time is acceptable.</p>
          </div>
          <div className="sub-topic">
            <h3>Exact Solution Required</h3>
            <p>When approximate solutions are not acceptable.</p>
          </div>
          <div className="sub-topic">
            <h3>Baseline for Comparison</h3>
            <p>Use as reference to verify correctness of optimized algorithms.</p>
          </div>
          <div className="sub-topic">
            <h3>Simple Implementation</h3>
            <p>When development time is more important than runtime.</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Brute Force Examples</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>0/1 Knapsack</h3>
            <p>Try all 2^n subsets of items. Time: O(2^n)</p>
          </div>
          <div className="sub-topic">
            <h3>Subset Sum</h3>
            <p>Check all subsets to find one with target sum. Time: O(2^n)</p>
          </div>
          <div className="sub-topic">
            <h3>String Matching</h3>
            <p>Check pattern at every position. Time: O(n×m)</p>
          </div>
          <div className="sub-topic">
            <h3>Closest Pair</h3>
            <p>Compare all pairs of points. Time: O(n²)</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Optimization Strategies</h2>
        <p>Even brute force can be optimized:</p>
        <ul>
          <li><strong>Early Termination:</strong> Stop when solution is found</li>
          <li><strong>Pruning:</strong> Skip impossible branches</li>
          <li><strong>Memoization:</strong> Cache results of subproblems</li>
          <li><strong>Symmetry Breaking:</strong> Avoid checking equivalent solutions</li>
        </ul>
      </section>

      <section className="topic-card">
        <h2>Brute Force vs. Other Methods</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>vs. Greedy</h3>
            <p>Brute Force: Optimal but slow. Greedy: Fast but may not be optimal.</p>
          </div>
          <div className="sub-topic">
            <h3>vs. Dynamic Programming</h3>
            <p>Brute Force: Recomputes subproblems. DP: Stores and reuses results.</p>
          </div>
          <div className="sub-topic">
            <h3>vs. Branch and Bound</h3>
            <p>Brute Force: Explores all solutions. B&B: Prunes unpromising branches.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BruteForce

