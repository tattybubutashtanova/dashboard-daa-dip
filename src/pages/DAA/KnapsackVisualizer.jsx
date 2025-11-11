import { useState } from 'react'
import InteractivePage from '../../components/shared/InteractivePage'
import InputCard from '../../components/shared/InputCard'
import OutputCard from '../../components/shared/OutputCard'
import StepByStepDisplay from '../../components/shared/StepByStepDisplay'

function KnapsackVisualizer() {
  const [items, setItems] = useState([
    { id: 1, value: 60, weight: 10 },
    { id: 2, value: 100, weight: 20 },
    { id: 3, value: 120, weight: 30 },
    { id: 4, value: 80, weight: 24 },
  ])
  const [capacity, setCapacity] = useState(50)
  const [approach, setApproach] = useState('dp') // 'dp' | 'greedy' | 'tree'
  const [steps, setSteps] = useState([])
  const [result, setResult] = useState(null)
  const [dpTable, setDpTable] = useState(null)
  const [treeData, setTreeData] = useState(null)
  const [treeView, setTreeView] = useState('diagram') // 'diagram' | 'nested' | 'ascii'

  const updateItem = (idx, key, val) => {
    const v = Math.max(0, parseInt(val) || 0)
    const next = items.map((it, i) => (i === idx ? { ...it, [key]: v } : it))
    setItems(next)
  }

  const addItem = () => {
    setItems([...items, { id: items.length + 1, value: 50, weight: 10 }])
  }

  const removeItem = (idx) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== idx))
  }

  const run = () => {
    if (approach === 'dp') solveDP()
    else if (approach === 'greedy') solveGreedy()
    else solveTree()
  }

  // Dynamic Programming approach (0/1 knapsack)
  const solveDP = () => {
    const n = items.length
    const W = Math.max(0, parseInt(capacity) || 0)
    const table = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0))
    const s = []

    s.push({ description: 'Initialize DP table', data: `Rows: items (0..${n}), Columns: capacity (0..${W})` })

    for (let i = 1; i <= n; i++) {
      const { value: vi, weight: wi } = items[i - 1]
      for (let w = 0; w <= W; w++) {
        if (wi > w) {
          table[i][w] = table[i - 1][w]
        } else {
          table[i][w] = Math.max(table[i - 1][w], table[i - 1][w - wi] + vi)
        }
      }
      s.push({
        description: `Processed item ${i} (value=${vi}, weight=${wi})`,
        data: `Best values up to capacity W after item ${i} computed`,
      })
    }

    // Reconstruct solution
    let w = W
    const chosen = []
    for (let i = n; i >= 1; i--) {
      if (table[i][w] !== table[i - 1][w]) {
        chosen.push(i - 1)
        w -= items[i - 1].weight
      }
    }
    chosen.reverse()

    const totalValue = chosen.reduce((acc, idx) => acc + items[idx].value, 0)
    const totalWeight = chosen.reduce((acc, idx) => acc + items[idx].weight, 0)
    s.push({
      description: 'Reconstruction',
      data: `Chosen item indices (0-based): [${chosen.join(', ')}]`,
      result: `Total value = ${totalValue}, Total weight = ${totalWeight}`,
    })

    setSteps(s)
    setResult({
      approach: 'Dynamic Programming',
      chosenIndices: chosen,
      totalValue,
      totalWeight,
    })
    setDpTable({ table, n, W })
    setTreeData(null)
  }

  // Greedy by value-to-weight ratio (not optimal for 0/1 but illustrative)
  const solveGreedy = () => {
    const W = Math.max(0, parseInt(capacity) || 0)
    const s = []
    const withRatio = items.map((it, idx) => ({ ...it, idx, ratio: it.weight ? it.value / it.weight : 0 }))
    withRatio.sort((a, b) => b.ratio - a.ratio)

    s.push({
      description: 'Sort items by value/weight ratio (descending)',
      data: withRatio.map(it => `#${it.idx}: v=${it.value}, w=${it.weight}, r=${(it.ratio || 0).toFixed(3)}`).join('\n'),
    })

    let remaining = W
    const chosen = []
    for (const it of withRatio) {
      if (it.weight <= remaining) {
        chosen.push(it.idx)
        remaining -= it.weight
        s.push({ description: `Pick item #${it.idx}`, data: `Remaining capacity: ${remaining}` })
      } else {
        s.push({ description: `Skip item #${it.idx}`, data: `Too heavy for remaining capacity ${remaining}` })
      }
    }
    chosen.sort((a, b) => a - b)
    const totalValue = chosen.reduce((acc, idx) => acc + items[idx].value, 0)
    const totalWeight = chosen.reduce((acc, idx) => acc + items[idx].weight, 0)
    s.push({
      description: 'Greedy result',
      result: `Total value = ${totalValue}, Total weight = ${totalWeight}`,
    })

    setSteps(s)
    setResult({
      approach: 'Greedy (ratio)',
      chosenIndices: chosen,
      totalValue,
      totalWeight,
    })
    setDpTable(null)
    setTreeData(null)
  }

  // Simple tree exploration (include/exclude) – DFS with best tracking
  const solveTree = () => {
    const W = Math.max(0, parseInt(capacity) || 0)
    const n = items.length
    const s = []

    let bestValue = 0
    let bestSet = []
    let nodeId = 0

    const buildNodeLabel = (i, currWeight, currValue, chosen, remainingCap, itemIdx) => {
      return `i=${i}, w=${currWeight}, v=${currValue}, cap=${remainingCap}, chosen=[${chosen.join(', ')}]`
    }

    const dfs = (i, currWeight, currValue, chosen, decision = 'Start') => {
      const remainingCap = W - currWeight
      const node = {
        id: nodeId++,
        decision,
        info: buildNodeLabel(i, currWeight, currValue, chosen, remainingCap, i < n ? i : null),
        i,
        currWeight,
        currValue,
        remainingCap,
        itemIndex: i,
        itemWeight: i < n ? items[i]?.weight : undefined,
        itemValue: i < n ? items[i]?.value : undefined,
        status: 'active',
        children: [],
      }

      s.push({
        description: `Node: ${decision}`,
        data: node.info,
      })

      if (currWeight > W) {
        node.status = 'pruned'
        s.push({ description: 'Prune', result: 'Over capacity' })
        return node
      }

      if (i === n) {
        if (currValue > bestValue) {
          bestValue = currValue
          bestSet = [...chosen]
          node.status = 'best'
          s.push({ description: 'Update best', result: `bestValue=${bestValue}` })
        } else {
          node.status = 'leaf'
        }
        return node
      }

      const includeNode = dfs(
        i + 1,
        currWeight + items[i].weight,
        currValue + items[i].value,
        [...chosen, i],
        `Include item ${i}`
      )
      if (includeNode) {
        node.children.push(includeNode)
      }

      const excludeNode = dfs(
        i + 1,
        currWeight,
        currValue,
        chosen,
        `Exclude item ${i}`
      )
      if (excludeNode) {
        node.children.push(excludeNode)
      }

      return node
    }

    const root = dfs(0, 0, 0, [], 'Start')

    const totalWeight = bestSet.reduce((acc, idx) => acc + items[idx].weight, 0)
    s.push({
      description: 'Final best found',
      result: `Total value = ${bestValue}, Total weight = ${totalWeight}, Items = [${bestSet.join(', ')}]`,
    })

    setSteps(s)
    setResult({
      approach: 'Tree Search (DFS include/exclude)',
      chosenIndices: bestSet,
      totalValue: bestValue,
      totalWeight,
    })
    setDpTable(null)
    setTreeData(root)
  }

  const explanation = (
    <>
      <p>0/1 Knapsack: choose items to maximize total value without exceeding capacity. Each item can be taken at most once.</p>
      <ul>
        <li><strong>DP:</strong> Optimal via table of best values for (i, w).</li>
        <li><strong>Greedy:</strong> Fast ratio heuristic (not always optimal).</li>
        <li><strong>Tree:</strong> Explore include/exclude decisions; shows the search tree.</li>
      </ul>
    </>
  )

  return (
    <InteractivePage
      title="0/1 Knapsack Visualizer"
      formula="DP: best[i][w] = max(best[i-1][w], best[i-1][w-w_i] + v_i)"
      explanation={explanation}
      inputSection={
        <div>
          <InputCard title="Items (value, weight)">
            {items.map((it, idx) => (
              <div key={it.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ width: 28, textAlign: 'right' }}>#{it.id}</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  value
                  <input type="number" min="0" step="1" value={it.value} onChange={(e) => updateItem(idx, 'value', e.target.value)} style={{ width: 90 }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  weight
                  <input type="number" min="0" step="1" value={it.weight} onChange={(e) => updateItem(idx, 'weight', e.target.value)} style={{ width: 90 }} />
                </label>
                <button className="btn-secondary" onClick={() => removeItem(idx)}>Remove</button>
              </div>
            ))}
            <div className="button-group">
              <button className="btn-secondary" onClick={addItem}>Add Item</button>
            </div>
          </InputCard>

          <InputCard title="Capacity and Approach">
            <div className="input-group">
              <label>Capacity</label>
              <input type="number" min="0" step="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Approach</label>
              <select value={approach} onChange={(e) => setApproach(e.target.value)}>
                <option value="dp">Dynamic Programming</option>
                <option value="greedy">Greedy (value/weight)</option>
                <option value="tree">Tree Visualization (DFS)</option>
              </select>
            </div>
            {approach === 'tree' && (
              <div className="input-group">
                <label>Tree View</label>
                <select value={treeView} onChange={(e) => setTreeView(e.target.value)}>
                  <option value="diagram">Diagram (boxes)</option>
                  <option value="nested">Nested blocks</option>
                  <option value="ascii">ASCII connectors</option>
                </select>
              </div>
            )}
            <div className="button-group">
              <button className="btn-primary" onClick={run}>Solve</button>
              <button className="btn-secondary" onClick={() => { setSteps([]); setResult(null); setDpTable(null); setTreeData(null); }}>Reset</button>
            </div>
          </InputCard>
        </div>
      }
      outputSection={
        <div>
          <OutputCard title="Items Summary">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 6 }}>#</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Value</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Weight</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Value/Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #eee' }}>
                      <td style={{ padding: 6 }}>{idx}</td>
                      <td style={{ padding: 6 }}>{it.value}</td>
                      <td style={{ padding: 6 }}>{it.weight}</td>
                      <td style={{ padding: 6 }}>{it.weight ? (it.value / it.weight).toFixed(3) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </OutputCard>

          {result && (
            <OutputCard title={`Result — ${result.approach}`}>
              <div style={{ padding: '0.5rem' }}>
                <p><strong>Chosen items (0-based):</strong> [{result.chosenIndices.join(', ')}]</p>
                <p><strong>Total value:</strong> {result.totalValue}</p>
                <p><strong>Total weight:</strong> {result.totalWeight}</p>
              </div>
            </OutputCard>
          )}

          {dpTable && (
            <OutputCard title="DP Table (best value)">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: 4 }}>i\\w</th>
                      {Array.from({ length: dpTable.W + 1 }, (_, w) => (
                        <th key={w} style={{ padding: 4 }}>{w}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dpTable.table.map((row, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #eee' }}>
                        <td style={{ padding: 4 }}>{i}</td>
                        {row.map((val, w) => (
                          <td key={w} style={{ padding: 4, textAlign: 'center' }}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </OutputCard>
          )}

          {steps.length > 0 && (
            <StepByStepDisplay steps={steps} title="Step-by-Step" />
          )}

          {treeData && (
            <OutputCard title="Tree Visualization">
              <div style={{ padding: '0.5rem' }}>
                {treeView === 'diagram'
                  ? renderTreeDiagram(treeData)
                  : treeView === 'nested'
                    ? renderTreeNested(treeData)
                    : renderTreeAscii(treeData)}
              </div>
            </OutputCard>
          )}

          {!result && steps.length === 0 && <OutputCard isEmpty={true} />}
        </div>
      }
      algorithmExplanation={explanation}
    />
  )
}

const statusColors = {
  best: '#2e7d32',
  pruned: '#c62828',
  leaf: '#1565c0',
  active: '#424242',
}

function renderTreeNested(node, depth = 0) {
  if (!node) return null
  const color = statusColors[node.status] || statusColors.active

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 16, borderLeft: depth === 0 ? 'none' : '2px solid #d0d7ff', paddingLeft: depth === 0 ? 0 : 12, marginBottom: 12 }}>
      <div style={{ fontWeight: 600, color }}>
        {node.decision}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#555', marginBottom: 6 }}>
        {node.info}
      </div>
      {node.children && node.children.length > 0 && (
        <div>
          {node.children.map(child => (
            <div key={child.id}>
              {renderTreeNested(child, depth + 1)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function renderTreeAscii(node) {
  const lines = []

  const lineFor = (prefix, isLast, node) => {
    const branch = prefix + (isLast ? '└─ ' : '├─ ')
    const color = statusColors[node.status] || statusColors.active
    // Using inline color spans
    lines.push(
      <div key={`l-${node.id}-title`} style={{ fontFamily: 'monospace' }}>
        <span style={{ color }}>{branch}{node.decision}</span>
      </div>
    )
    lines.push(
      <div key={`l-${node.id}-info`} style={{ fontFamily: 'monospace', color: '#555', marginLeft: branch.length * 8 }}>
        {node.info}
      </div>
    )
  }

  const walk = (node, prefix) => {
    if (!node) return
    const children = node.children || []
    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1
      lineFor(prefix, isLast, child)
      const nextPrefix = prefix + (isLast ? '   ' : '│  ')
      walk(child, nextPrefix)
    })
  }

  // Root line
  const rootColor = statusColors[node.status] || statusColors.active
  lines.push(
    <div key={`root-title`} style={{ fontFamily: 'monospace' }}>
      <span style={{ color: rootColor }}>{node.decision}</span>
    </div>
  )
  lines.push(
    <div key={`root-info`} style={{ fontFamily: 'monospace', color: '#555', marginLeft: 16 }}>
      {node.info}
    </div>
  )
  walk(node, '')

  return <div>{lines}</div>
}

function renderTreeDiagram(root) {
  if (!root) return null
  // Build levels and keep parent-child id mapping
  const levels = []
  const edges = [] // {from:{level,index}, to:{level,index}, label}
  const queue = [{ node: root, depth: 0 }]
  const idToPos = new Map()
  while (queue.length) {
    const { node, depth } = queue.shift()
    if (!levels[depth]) levels[depth] = []
    const idx = levels[depth].length
    levels[depth].push(node)
    idToPos.set(node.id, { level: depth, index: idx })
    const children = node.children || []
    children.forEach((child) => {
      queue.push({ node: child, depth: depth + 1 })
      edges.push({
        from: { level: depth, index: idx },
        to: { level: depth + 1, index: (levels[depth + 1]?.length ?? 0) + queue.filter(q => q.depth === depth + 1).length },
        label: (child.decision || '').toLowerCase().startsWith('include') ? 'Include' : 'Exclude'
      })
    })
  }

  // Dimensions
  const NODE_W = 200
  const NODE_H = 90
  const H_GAP = 60
  const V_GAP = 110
  const width = Math.max(...levels.map(level => level.length)) * (NODE_W + H_GAP) + H_GAP
  const height = levels.length * (NODE_H + V_GAP) + V_GAP

  // Compute x positions centered across width per level
  const xPos = (levelLen, idx) => {
    const totalW = levelLen * NODE_W + (levelLen - 1) * H_GAP
    const start = (width - totalW) / 2
    return start + idx * (NODE_W + H_GAP)
  }
  const yPos = (level) => V_GAP + level * (NODE_H + V_GAP)

  // Recompute accurate 'to' positions for edges using idToPos
  const realEdges = []
  levels.forEach((levelNodes, l) => {
    levelNodes.forEach((node, i) => {
      const children = node.children || []
      children.forEach((child) => {
        const toPos = idToPos.get(child.id)
        if (toPos) {
          realEdges.push({
            from: { level: l, index: i },
            to: { level: toPos.level, index: toPos.index },
            label: (child.decision || '').toLowerCase().startsWith('include') ? 'Include' : 'Exclude'
          })
        }
      })
    })
  })

  const nodeFill = '#ffffff'
  const nodeStroke = '#6c7afc'
  const labelInclude = '#6c7afc'
  const labelExclude = '#9aa6ff'

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg width={Math.max(width, 800)} height={Math.max(height, 300)}>
        {/* Edges */}
        {realEdges.map((e, idx) => {
          const x1 = xPos(levels[e.from.level].length, e.from.index) + NODE_W / 2
          const y1 = yPos(e.from.level) + NODE_H
          const x2 = xPos(levels[e.to.level].length, e.to.index) + NODE_W / 2
          const y2 = yPos(e.to.level)
          const midY = (y1 + y2) / 2
          const isInclude = e.label === 'Include'
          return (
            <g key={`edge-${idx}`}>
              {/* smooth curve */}
              <path
                d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                stroke="#b7c0ff"
                strokeWidth="2"
                fill="none"
              />
              {/* label pill */}
              <rect
                x={(x1 + x2) / 2 - 34}
                y={midY - 12}
                rx="8"
                ry="8"
                width="68"
                height="24"
                fill={isInclude ? labelInclude : labelExclude}
                opacity="0.9"
              />
              <text
                x={(x1 + x2) / 2}
                y={midY + 6}
                textAnchor="middle"
                fontFamily="Inter, system-ui, sans-serif"
                fontSize="12"
                fill="#fff"
                fontWeight="600"
              >
                {e.label}
              </text>
            </g>
          )
        })}
        {/* Nodes */}
        {levels.map((levelNodes, l) =>
          levelNodes.map((node, i) => {
            const x = xPos(levelNodes.length, i)
            const y = yPos(l)
            const title = node.itemIndex != null && node.itemWeight != null && node.itemValue != null
              ? `Item ${node.itemIndex + 1}`
              : 'Leaf'
            return (
              <g key={`node-${l}-${i}`}>
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="10"
                  ry="10"
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth="2"
                  filter="url(#shadow)"
                />
                <text
                  x={x + NODE_W / 2}
                  y={y + 26}
                  textAnchor="middle"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontSize="18"
                  fontWeight="700"
                  fill="#1f2a44"
                >
                  {title}
                </text>
                {node.itemWeight != null && node.itemValue != null && (
                  <text
                    x={x + NODE_W / 2}
                    y={y + 48}
                    textAnchor="middle"
                    fontFamily="Inter, system-ui, sans-serif"
                    fontSize="14"
                    fill="#334155"
                  >
                    {`W:${node.itemWeight} V:${node.itemValue}`}
                  </text>
                )}
                <text
                  x={x + NODE_W / 2}
                  y={y + 68}
                  textAnchor="middle"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontSize="14"
                  fill="#334155"
                >
                  {`Cap: ${node.remainingCap}`}
                </text>
              </g>
            )
          })
        )}
        {/* Drop shadow filter */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(16,24,40,0.18)" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

export default KnapsackVisualizer


