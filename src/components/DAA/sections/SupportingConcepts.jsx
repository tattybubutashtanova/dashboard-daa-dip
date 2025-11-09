import '../../shared/SectionStyles.css'
import './AlgorithmStyles.css'

function SupportingConcepts() {
  return (
    <div className="section-content">
      <h1>📊 Supporting Concepts</h1>

      <section className="topic-card">
        <h2>Time & Space Complexity Analysis</h2>
        <p>Complexity analysis helps understand algorithm efficiency and scalability.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Time Complexity</h3>
            <p>Measures how execution time grows with input size.</p>
            <div className="complexity-table">
              <table>
                <thead>
                  <tr>
                    <th>Notation</th>
                    <th>Name</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>O(1)</td>
                    <td>Constant</td>
                    <td>Array access</td>
                  </tr>
                  <tr>
                    <td>O(log n)</td>
                    <td>Logarithmic</td>
                    <td>Binary search</td>
                  </tr>
                  <tr>
                    <td>O(n)</td>
                    <td>Linear</td>
                    <td>Linear search</td>
                  </tr>
                  <tr>
                    <td>O(n log n)</td>
                    <td>Linearithmic</td>
                    <td>Merge sort, Quick sort</td>
                  </tr>
                  <tr>
                    <td>O(n²)</td>
                    <td>Quadratic</td>
                    <td>Bubble sort, nested loops</td>
                  </tr>
                  <tr>
                    <td>O(2ⁿ)</td>
                    <td>Exponential</td>
                    <td>Brute force TSP</td>
                  </tr>
                  <tr>
                    <td>O(n!)</td>
                    <td>Factorial</td>
                    <td>Permutation generation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="sub-topic">
            <h3>Space Complexity</h3>
            <p>Measures how memory usage grows with input size.</p>
            <ul>
              <li><strong>O(1):</strong> Constant space (in-place algorithms)</li>
              <li><strong>O(n):</strong> Linear space (arrays, lists)</li>
              <li><strong>O(n²):</strong> Quadratic space (2D matrices)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Algorithm Efficiency Comparisons</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Knapsack Problem</h3>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Time</th>
                    <th>Space</th>
                    <th>Optimal?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Greedy</td>
                    <td>O(n log n)</td>
                    <td>O(1)</td>
                    <td>No (for 0/1)</td>
                  </tr>
                  <tr>
                    <td>Dynamic Programming</td>
                    <td>O(n × W)</td>
                    <td>O(n × W)</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Brute Force</td>
                    <td>O(2ⁿ)</td>
                    <td>O(n)</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Branch & Bound</td>
                    <td>O(2ⁿ) worst</td>
                    <td>O(n)</td>
                    <td>Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="sub-topic">
            <h3>Shortest Path</h3>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Algorithm</th>
                    <th>Time</th>
                    <th>Graph Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dijkstra</td>
                    <td>O((V+E) log V)</td>
                    <td>Weighted, non-negative</td>
                  </tr>
                  <tr>
                    <td>Bellman-Ford</td>
                    <td>O(V × E)</td>
                    <td>Weighted, any</td>
                  </tr>
                  <tr>
                    <td>Floyd-Warshall</td>
                    <td>O(V³)</td>
                    <td>All pairs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Example Problems for Visualization</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Sorting Algorithms</h3>
            <ul>
              <li>Bubble Sort: O(n²)</li>
              <li>Merge Sort: O(n log n)</li>
              <li>Quick Sort: O(n log n) average</li>
              <li>Heap Sort: O(n log n)</li>
            </ul>
          </div>
          <div className="sub-topic">
            <h3>Search Algorithms</h3>
            <ul>
              <li>Linear Search: O(n)</li>
              <li>Binary Search: O(log n)</li>
              <li>Hash Table: O(1) average</li>
            </ul>
          </div>
          <div className="sub-topic">
            <h3>Graph Algorithms</h3>
            <ul>
              <li>BFS: O(V + E)</li>
              <li>DFS: O(V + E)</li>
              <li>Topological Sort: O(V + E)</li>
              <li>MST (Kruskal): O(E log E)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Big O Notation Rules</h2>
        <div className="algorithm-box">
          <h3>Rules for Analysis:</h3>
          <ol>
            <li><strong>Drop Constants:</strong> O(2n) = O(n)</li>
            <li><strong>Drop Lower Terms:</strong> O(n² + n) = O(n²)</li>
            <li><strong>Different Terms for Inputs:</strong> O(a + b) for different inputs a and b</li>
            <li><strong>Nested Loops:</strong> Multiply complexities</li>
            <li><strong>Sequential Operations:</strong> Add complexities</li>
          </ol>
        </div>
      </section>

      <section className="topic-card">
        <h2>Best, Average, and Worst Case</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Best Case</h3>
            <p>Minimum time for any input of size n. Example: Already sorted array for bubble sort.</p>
          </div>
          <div className="sub-topic">
            <h3>Average Case</h3>
            <p>Expected time over all possible inputs. Most practical measure.</p>
          </div>
          <div className="sub-topic">
            <h3>Worst Case</h3>
            <p>Maximum time for any input of size n. Guarantees upper bound.</p>
          </div>
        </div>
        <div className="example-box">
          <p><strong>Example - Quick Sort:</strong></p>
          <p>Best: O(n log n), Average: O(n log n), Worst: O(n²)</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Space-Time Tradeoff</h2>
        <p>Often, we can use more space to reduce time, or vice versa.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Hash Tables</h3>
            <p>Use O(n) space for O(1) average lookup time</p>
          </div>
          <div className="sub-topic">
            <h3>Memoization</h3>
            <p>Store computed results to avoid recomputation (DP)</p>
          </div>
          <div className="sub-topic">
            <h3>In-Place Algorithms</h3>
            <p>Use O(1) extra space but may be slower</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SupportingConcepts

