import '../../shared/SectionStyles.css'

function GeneticAlgorithm() {
  return (
    <div className="section-content">
      <h1>🧬 Genetic Algorithm</h1>

      <section className="topic-card">
        <h2>Genetic Algorithm Concept</h2>
        <p>Genetic Algorithms are evolutionary algorithms inspired by natural selection. They evolve a population of candidate solutions over generations to find optimal or near-optimal solutions.</p>
        <div className="algorithm-box">
          <h3>Basic Flow:</h3>
          <ol>
            <li>Initialize population</li>
            <li>Evaluate fitness</li>
            <li>While termination criteria not met:
              <ul>
                <li>Select parents</li>
                <li>Crossover (reproduction)</li>
                <li>Mutation</li>
                <li>Evaluate new generation</li>
                <li>Replace population</li>
              </ul>
            </li>
            <li>Return best solution</li>
          </ol>
        </div>
      </section>

      <section className="topic-card">
        <h2>Encoding of Solutions (Chromosomes)</h2>
        <p>Solutions are represented as chromosomes (strings of genes). Encoding depends on problem type.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Binary Encoding</h3>
            <p>Chromosome: "10110101"</p>
            <p>Used for: Discrete optimization problems</p>
          </div>
          <div className="sub-topic">
            <h3>Permutation Encoding</h3>
            <p>Chromosome: [3, 1, 4, 2, 5]</p>
            <p>Used for: TSP, ordering problems</p>
          </div>
          <div className="sub-topic">
            <h3>Real-Valued Encoding</h3>
            <p>Chromosome: [2.5, 3.1, 1.8]</p>
            <p>Used for: Continuous optimization</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Population Initialization</h2>
        <p>Create initial population of candidate solutions.</p>
        <div className="algorithm-box">
          <h3>Methods:</h3>
          <ul>
            <li><strong>Random:</strong> Generate random solutions</li>
            <li><strong>Heuristic:</strong> Use problem-specific heuristics</li>
            <li><strong>Hybrid:</strong> Mix of random and heuristic</li>
          </ul>
          <p><strong>Population Size:</strong> Typically 50-500 individuals. Larger = more diversity but slower.</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Fitness Function</h2>
        <p>Evaluates how good a solution is. Higher fitness = better solution.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>For Maximization</h3>
            <p>Fitness = objective value (e.g., profit, value)</p>
          </div>
          <div className="sub-topic">
            <h3>For Minimization</h3>
            <p>Fitness = 1 / (1 + objective value) or -objective value</p>
          </div>
        </div>
        <div className="example-box">
          <p><strong>Example (TSP):</strong> Fitness = 1 / total_distance</p>
          <p>Shorter distance = higher fitness</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Selection</h2>
        <p>Choose parents for reproduction based on fitness.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Roulette Wheel Selection</h3>
            <p>Probability proportional to fitness. Higher fitness = higher chance.</p>
          </div>
          <div className="sub-topic">
            <h3>Tournament Selection</h3>
            <p>Randomly select k individuals, choose best one. Repeat for each parent.</p>
          </div>
          <div className="sub-topic">
            <h3>Rank Selection</h3>
            <p>Select based on rank rather than absolute fitness. Reduces premature convergence.</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Crossover</h2>
        <p>Combine two parent chromosomes to create offspring.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Single-Point Crossover</h3>
            <p>Choose random point, swap segments after that point.</p>
            <p>Parent1: [1,2,3|4,5] → Child1: [1,2,3,6,7]</p>
            <p>Parent2: [6,7,8|9,0] → Child2: [6,7,8,4,5]</p>
          </div>
          <div className="sub-topic">
            <h3>Two-Point Crossover</h3>
            <p>Choose two points, swap middle segment.</p>
          </div>
          <div className="sub-topic">
            <h3>Order Crossover (for TSP)</h3>
            <p>Preserves relative order. Copy segment from parent1, fill rest from parent2 maintaining order.</p>
          </div>
        </div>
        <div className="formula">
          <p><strong>Crossover Rate:</strong> Typically 0.6 - 0.9 (60-90% of population)</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Mutation</h2>
        <p>Introduce random changes to maintain diversity and explore new areas.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Bit Flip (Binary)</h3>
            <p>Randomly flip bits: 1010 → 1011</p>
          </div>
          <div className="sub-topic">
            <h3>Swap (Permutation)</h3>
            <p>Swap two random positions: [1,2,3,4] → [1,4,3,2]</p>
          </div>
          <div className="sub-topic">
            <h3>Gaussian (Real-Valued)</h3>
            <p>Add random Gaussian noise to values</p>
          </div>
        </div>
        <div className="formula">
          <p><strong>Mutation Rate:</strong> Typically 0.001 - 0.1 (0.1% - 10% of genes)</p>
          <p>Too high: Random search. Too low: Premature convergence.</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Termination Criteria</h2>
        <ul>
          <li><strong>Maximum Generations:</strong> Stop after N generations</li>
          <li><strong>Fitness Threshold:</strong> Stop when fitness reaches target</li>
          <li><strong>Convergence:</strong> Stop when population converges (no improvement)</li>
          <li><strong>Time Limit:</strong> Stop after specified time</li>
        </ul>
      </section>

      <section className="topic-card">
        <h2>Applications</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Traveling Salesman Problem (TSP)</h3>
            <p>Chromosome: Permutation of cities [3,1,4,2,5]</p>
            <p>Fitness: 1 / total_distance</p>
            <p>Crossover: Order crossover</p>
            <p>Mutation: Swap two cities</p>
          </div>
          <div className="sub-topic">
            <h3>0/1 Knapsack Problem</h3>
            <p>Chromosome: Binary string [1,0,1,1,0] (1=take, 0=skip)</p>
            <p>Fitness: Total value (if valid) or penalty (if invalid)</p>
            <p>Crossover: Single-point</p>
            <p>Mutation: Bit flip</p>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Parameters Tuning</h2>
        <div className="formula">
          <p><strong>Typical Ranges:</strong></p>
          <ul>
            <li>Population Size: 50-500</li>
            <li>Crossover Rate: 0.6-0.9</li>
            <li>Mutation Rate: 0.001-0.1</li>
            <li>Generations: 100-1000+</li>
          </ul>
        </div>
        <div className="example-box">
          <p><strong>Note:</strong> Parameters depend on problem complexity and desired solution quality.</p>
        </div>
      </section>
    </div>
  )
}

export default GeneticAlgorithm

