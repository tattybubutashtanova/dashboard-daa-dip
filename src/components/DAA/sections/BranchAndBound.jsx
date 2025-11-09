import '../../shared/SectionStyles.css'

function BranchAndBound() {
  return (
    <div className="section-content">
      <h1>🔍 Branch and Bound</h1>

      <section className="topic-card">
        <h2>Concept of Branch and Bound</h2>
        <p>Branch and Bound is an algorithm design paradigm for solving optimization problems. It systematically explores the solution space by branching into subproblems and bounding to prune unpromising branches.</p>
        <div className="algorithm-box">
          <h3>Key Components:</h3>
          <ul>
            <li><strong>Branching:</strong> Divide problem into smaller subproblems</li>
            <li><strong>Bounding:</strong> Calculate bounds (upper/lower) for subproblems</li>
            <li><strong>Pruning:</strong> Eliminate subproblems that cannot lead to optimal solution</li>
            <li><strong>Search Strategy:</strong> Best-first, depth-first, or breadth-first</li>
          </ul>
        </div>
      </section>

      <section className="topic-card">
        <h2>Traveling Salesman Problem (Branch and Bound)</h2>
        <p>Use Branch and Bound to find optimal TSP solution by exploring partial tours and pruning based on lower bounds.</p>
        <div className="algorithm-box">
          <h3>Algorithm:</h3>
          <ol>
            <li>Calculate initial lower bound (e.g., using minimum spanning tree)</li>
            <li>Create root node with partial tour (empty or starting city)</li>
            <li>While there are active nodes:
              <ul>
                <li>Select node with best bound</li>
                <li>If bound ≥ current best: prune this node</li>
                <li>If tour is complete: update best solution</li>
                <li>Else: Branch into child nodes (add next city)</li>
                <li>Calculate bounds for child nodes</li>
                <li>Add promising nodes to active set</li>
              </ul>
            </li>
            <li>Return best solution</li>
          </ol>
        </div>
        <div className="example-box">
          <p><strong>Lower Bound Calculation (for TSP):</strong></p>
          <ul>
            <li>Sum of minimum outgoing edge from each city</li>
            <li>Or: Cost of minimum spanning tree + minimum edges to connect</li>
          </ul>
        </div>
      </section>

      <section className="topic-card">
        <h2>Bounding Functions and Node Pruning</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Lower Bound</h3>
            <p>Estimate of minimum possible cost for a subproblem. Used to prune nodes that cannot improve current best solution.</p>
            <p><strong>Pruning Rule:</strong> If lower_bound(node) ≥ current_best, prune the node</p>
          </div>
          <div className="sub-topic">
            <h3>Upper Bound</h3>
            <p>Estimate of maximum possible cost. Can be used to initialize best solution or for additional pruning.</p>
          </div>
          <div className="sub-topic">
            <h3>Node Pruning Strategies</h3>
            <ul>
              <li><strong>Bound-based:</strong> Prune if bound ≥ current best</li>
              <li><strong>Feasibility:</strong> Prune if subproblem is infeasible</li>
              <li><strong>Dominance:</strong> Prune if another node dominates</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Branch and Bound vs. Other Methods</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>vs. Brute Force</h3>
            <p>Much faster due to pruning, but still exponential in worst case.</p>
          </div>
          <div className="sub-topic">
            <h3>vs. Dynamic Programming</h3>
            <p>More memory efficient, explores solution space differently. Good for problems with large state space.</p>
          </div>
          <div className="sub-topic">
            <h3>vs. Greedy</h3>
            <p>Guarantees optimal solution (unlike greedy), but slower.</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Applications</h2>
        <ul>
          <li>Traveling Salesman Problem</li>
          <li>0/1 Knapsack Problem</li>
          <li>Job Scheduling</li>
          <li>Assignment Problem</li>
          <li>Integer Linear Programming</li>
        </ul>
      </section>
    </div>
  )
}

export default BranchAndBound

