import { useMemo, useState } from 'react'
import InteractivePage from '../../components/shared/InteractivePage'
import InputCard from '../../components/shared/InputCard'
import OutputCard from '../../components/shared/OutputCard'

function parseDistribution(text) {
  // format: a:0.5,b:0.3,c:0.2 or multiline with "a 0.5"
  const entries = []
  const parts = text
    .split(/[,\n]/)
    .map(s => s.trim())
    .filter(Boolean)
  for (const p of parts) {
    const m = p.match(/^([^:\s]+)\s*[:\s]\s*([0-9]*\.?[0-9]+)$/i)
    if (m) {
      entries.push([m[1], parseFloat(m[2])])
    }
  }
  const sum = entries.reduce((a, [, v]) => a + v, 0)
  if (sum > 0) {
    return entries.map(([k, v]) => [k, v / sum])
  }
  return []
}

function cumulativeFromDist(dist) {
  // dist: array [ [sym, p], ... ] in ascending by input order
  const cum = []
  let acc = 0
  for (const [sym, p] of dist) {
    cum.push([sym, acc, acc + p])
    acc += p
  }
  return cum
}

function ArithmeticEncoding() {
  const [distText, setDistText] = useState('a:0.5, b:0.3, c:0.2')
  const [message, setMessage] = useState('abc')
  const dist = useMemo(() => parseDistribution(distText), [distText])
  const cumTable = useMemo(() => cumulativeFromDist(dist), [dist])

  const { steps, finalLow, finalHigh } = useMemo(() => {
    const steps = []
    if (cumTable.length === 0 || !message) return { steps, finalLow: 0, finalHigh: 1 }
    let low = 0.0
    let high = 1.0
    for (let idx = 0; idx < message.length; idx++) {
      const ch = message[idx]
      const row = cumTable.find(([s]) => s === ch)
      if (!row) {
        steps.push({ idx, ch, error: `Symbol "${ch}" not in distribution` })
        break
      }
      const range = high - low
      const [_, l, u] = row
      const newLow = low + range * l
      const newHigh = low + range * u
      steps.push({
        idx,
        ch,
        prevLow: low,
        prevHigh: high,
        range,
        l,
        u,
        low: newLow,
        high: newHigh,
      })
      low = newLow
      high = newHigh
    }
    return { steps, finalLow: low, finalHigh: high }
  }, [cumTable, message])

  const Diagram = ({ steps, cumTable, width = 480, barWidth = 80, height = 220 }) => {
    const cols = steps.length + 1
    const totalWidth = Math.max(width, cols * (barWidth + 20) + 20)
    const top = 20
    const bottom = height - 20
    const yOf = (v) => bottom - v * (bottom - top)
    const xOf = (col) => 20 + col * (barWidth + 20)
    const ticks = cumTable
    return (
      <svg width={totalWidth} height={height} style={{ background: '#fff' }}>
        {[...Array(cols)].map((_, col) => (
          <g key={`col-${col}`}>
            <line x1={xOf(col)} y1={top} x2={xOf(col)} y2={bottom} stroke="#111" strokeWidth="2" />
            <line x1={xOf(col) + barWidth} y1={top} x2={xOf(col) + barWidth} y2={bottom} stroke="#111" strokeWidth="2" />
            {/* ticks */}
            {ticks.map(([sym, l, u], i) => (
              <g key={`tick-${col}-${i}`}>
                <line x1={xOf(col)} y1={yOf(l)} x2={xOf(col) + barWidth} y2={yOf(l)} stroke="#777" strokeWidth="1" />
                <text x={xOf(col) - 6} y={yOf((l + u) / 2)} fontSize="12" textAnchor="end">{sym}</text>
              </g>
            ))}
            {/* labels 0/1 */}
            <text x={xOf(col) - 6} y={bottom + 12} fontSize="12" textAnchor="end">0</text>
            <text x={xOf(col) + barWidth + 6} y={top - 6} fontSize="12">1</text>
          </g>
        ))}
        {/* dashed path */}
        {steps.length > 0 && (
          <g>
            {steps.map((s, idx) => {
              const fromCol = idx
              const toCol = idx + 1
              const startYLow = yOf(s.prevLow)
              const startYHigh = yOf(s.prevHigh)
              const endYLow = yOf(s.low)
              const endYHigh = yOf(s.high)
              return (
                <g key={`seg-${idx}`}>
                  <line x1={xOf(fromCol)} y1={startYLow} x2={xOf(toCol)} y2={endYLow} stroke="#0ea5e9" strokeDasharray="6,4" strokeWidth="2" />
                  <line x1={xOf(fromCol) + barWidth} y1={startYHigh} x2={xOf(toCol) + barWidth} y2={endYHigh} stroke="#ef4444" strokeDasharray="6,4" strokeWidth="2" />
                  <text x={xOf(toCol) + barWidth / 2} y={endYHigh - 6} textAnchor="middle" fontSize="11">after {s.ch}</text>
                </g>
              )
            })}
          </g>
        )}
      </svg>
    )
  }

  return (
    <InteractivePage
      title="Arithmetic Encoding"
      formula="Iteratively narrow [low, high) by mapping symbol to its sub-interval via cumulative probabilities"
      explanation={
        <p>Provide a small symbol set (2–3 symbols works best) with probabilities and a message. The encoder updates the interval [low, high) at each step and shows a single tag t that represents the whole sequence.</p>
      }
      inputSection={
        <div>
          <InputCard title="Inputs">
            <div className="input-group">
              <label>Symbols with probabilities (normalized automatically)</label>
              <textarea
                value={distText}
                onChange={(e) => setDistText(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '8px' }}
                placeholder="a:0.4, b:0.35, c:0.25"
              />
            </div>
            <div className="input-group">
              <label>Message to encode</label>
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g., abc" />
            </div>
            <div className="input-group">
              <label>Quick example</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className="btn-secondary"
                  onClick={() => { setDistText('a:0.5, b:0.3, c:0.2'); setMessage('abc') }}
                >
                  Load (a:0.5, b:0.3, c:0.2; msg="abc")
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => { setDistText('x:0.6, y:0.4'); setMessage('xyx') }}
                >
                  Load (x:0.6, y:0.4; msg="xyx")
                </button>
              </div>
            </div>
          </InputCard>
        </div>
      }
      outputSection={
        <div>
          <OutputCard title="Interval Diagram">
            <Diagram steps={steps} cumTable={cumTable} />
          </OutputCard>
          <OutputCard title="Step Table">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: 6 }}>k</th>
                    <th style={{ padding: 6 }}>symbol</th>
                    <th style={{ padding: 6 }}>prev low</th>
                    <th style={{ padding: 6 }}>prev high</th>
                    <th style={{ padding: 6 }}>range</th>
                    <th style={{ padding: 6 }}>l</th>
                    <th style={{ padding: 6 }}>u</th>
                    <th style={{ padding: 6 }}>new low</th>
                    <th style={{ padding: 6 }}>new high</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((s) => (
                    <tr key={s.idx} style={{ borderTop: '1px solid #eee' }}>
                      <td style={{ padding: 6 }}>{s.idx + 1}</td>
                      <td style={{ padding: 6 }}>{s.ch}</td>
                      <td style={{ padding: 6 }}>{s.prevLow?.toFixed(3)}</td>
                      <td style={{ padding: 6 }}>{s.prevHigh?.toFixed(3)}</td>
                      <td style={{ padding: 6 }}>{s.range?.toFixed(3)}</td>
                      <td style={{ padding: 6 }}>{s.l?.toFixed(3)}</td>
                      <td style={{ padding: 6 }}>{s.u?.toFixed(3)}</td>
                      <td style={{ padding: 6 }}>{s.low?.toFixed(3)}</td>
                      <td style={{ padding: 6 }}>{s.high?.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '0.75rem', color: '#374151' }}>
              Final interval: [{finalLow.toFixed(6)}, {finalHigh.toFixed(6)})
            </div>
          </OutputCard>
          <OutputCard title="Final tag t">
            <p>The sequence can be represented by any t ∈ [low, high). A common choice is the midpoint:</p>
            <p style={{ fontWeight: 700, color: '#111' }}>
              t = {(((finalLow + finalHigh) / 2) || 0).toFixed(10)}
            </p>
          </OutputCard>
        </div>
      }
    />
  )
}

export default ArithmeticEncoding


