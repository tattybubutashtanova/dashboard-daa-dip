import { useMemo, useState } from 'react'
import InteractivePage from '../../components/shared/InteractivePage'
import InputCard from '../../components/shared/InputCard'
import OutputCard from '../../components/shared/OutputCard'
import StepByStepDisplay from '../../components/shared/StepByStepDisplay'

const sigmoid = (x) => 1 / (1 + Math.exp(-x))
const softmax = (arr) => {
  const max = Math.max(...arr)
  const exps = arr.map(v => Math.exp(v - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map(v => v / sum)
}

function ANNVisualizer() {
  // Layer sizes
  const [numInputs, setNumInputs] = useState(2)
  const [numHidden, setNumHidden] = useState(3)
  const [numOutputs, setNumOutputs] = useState(2)

  // Inputs
  const [inputs, setInputs] = useState([0.5, 0.2])

  // Weights and biases (initialized to match default sizes)
  const [W1, setW1] = useState([[0.8, -0.4],[0.3, 0.6],[-0.5, 0.9]]) // numHidden x numInputs
  const [b1, setB1] = useState([0, 0, 0]) // numHidden
  const [W2, setW2] = useState([[0.7, -0.2, 0.4],[-0.3, 0.5, 0.1]]) // numOutputs x numHidden
  const [b2, setB2] = useState([0, 0]) // numOutputs
  const [steps, setSteps] = useState([])
  const [output, setOutput] = useState(null)

  // Resize helpers preserve existing values and fill new entries with 0
  const resizeMatrix = (matrix, newRows, newCols) => {
    const rows = []
    for (let i = 0; i < newRows; i++) {
      const oldRow = matrix[i] || []
      const row = []
      for (let j = 0; j < newCols; j++) {
        row.push(Number.isFinite(oldRow[j]) ? oldRow[j] : 0)
      }
      rows.push(row)
    }
    return rows
  }
  const resizeVector = (vector, newLen) => {
    const arr = []
    for (let i = 0; i < newLen; i++) arr.push(Number.isFinite(vector[i]) ? vector[i] : 0)
    return arr
  }

  // When layer sizes change, resize related state accordingly
  const applyNewSizes = (nIn, nHidden, nOut) => {
    setInputs(prev => resizeVector(prev, nIn))
    setW1(prev => resizeMatrix(prev, nHidden, nIn))
    setB1(prev => resizeVector(prev, nHidden))
    setW2(prev => resizeMatrix(prev, nOut, nHidden))
    setB2(prev => resizeVector(prev, nOut))
  }

  const onChangeSizes = (nIn, nHidden, nOut) => {
    setNumInputs(nIn)
    setNumHidden(nHidden)
    setNumOutputs(nOut)
    applyNewSizes(nIn, nHidden, nOut)
    setSteps([])
    setOutput(null)
  }

  const run = () => {
    const X = inputs.map(v => parseFloat(v))
    // z1 = W1 * X + b1
    const z1 = W1.map((row, i) => row.reduce((acc, w, j) => acc + w * X[j], 0) + b1[i])
    const a1 = z1.map(sigmoid)
    // z2 = W2 * a1 + b2
    const z2 = W2.map((row, i) => row.reduce((acc, w, j) => acc + w * a1[j], 0) + b2[i])
    const y = softmax(z2)
    const s = []
    s.push({ description: 'Inputs', data: `x = [${X.map(v=>v.toFixed(3)).join(', ')}]` })
    s.push({ description: 'Hidden z1 = W1·x + b1', data: `[${z1.map(v=>v.toFixed(3)).join(', ')}]` })
    s.push({ description: 'a1 = sigmoid(z1)', data: `[${a1.map(v=>v.toFixed(3)).join(', ')}]` })
    s.push({ description: 'z2 = W2·a1 + b2', data: `[${z2.map(v=>v.toFixed(3)).join(', ')}]` })
    s.push({ description: 'y = softmax(z2)', data: `[${y.map(v=>v.toFixed(3)).join(', ')}]` })
    const predIdx = y.reduce((best, v, i) => v > y[best] ? i : best, 0)
    s.push({ description: 'Prediction', result: `class ${predIdx}` })
    setSteps(s)
    setOutput({ probs: y, pred: predIdx })
  }

  const updateInput = (i,val) => setInputs(inputs.map((c,ci)=>(ci===i?(parseFloat(val)||0):c)))
  const updateW1 = (i,j,val) => setW1(W1.map((r,ri)=>r.map((c,cj)=>(ri===i&&cj===j?(parseFloat(val)||0):c))))
  const updateB1 = (i,val) => setB1(b1.map((c,ci)=>(ci===i?(parseFloat(val)||0):c)))
  const updateW2 = (i,j,val) => setW2(W2.map((r,ri)=>r.map((c,cj)=>(ri===i&&cj===j?(parseFloat(val)||0):c))))
  const updateB2 = (i,val) => setB2(b2.map((c,ci)=>(ci===i?(parseFloat(val)||0):c)))

  const explanation = (<><p>Fully connected network: Input → Hidden (σ) → Output (softmax). Edit layer sizes, weights, and biases.</p></>)

  const Node = ({ label }) => (
    <div style={{width:36,height:36,borderRadius:'50%',background:'#eef3ff',border:'2px solid #7b93ff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#4953a6'}}>{label}</div>
  )

  // Precompute node positions for SVG rendering
  const diagram = useMemo(() => {
    const colX = [40, 190, 340] // left x for columns (input, hidden, output)
    const colCenterX = colX.map(x => x + 18) // center of node (36 width)
    const colSizes = [numInputs, numHidden, numOutputs]
    const colY = (count, idx) => {
      const gap = 18
      const totalH = count * 36 + (count - 1) * gap
      const start = Math.max(0, (240 - totalH) / 2)
      return start + idx * (36 + gap)
    }
    const layers = [
      Array.from({ length: numInputs }, (_, i) => ({ x: colCenterX[0], y: colY(numInputs, i) + 18 })),
      Array.from({ length: numHidden }, (_, i) => ({ x: colCenterX[1], y: colY(numHidden, i) + 18 })),
      Array.from({ length: numOutputs }, (_, i) => ({ x: colCenterX[2], y: colY(numOutputs, i) + 18 })),
    ]
    return { layers }
  }, [numInputs, numHidden, numOutputs])

  const weightStroke = (w) => {
    const magnitude = Math.min(1, Math.abs(w))
    const width = 1 + 3 * magnitude
    const color = w >= 0 ? '#2e7d32' : '#c62828'
    return { stroke: color, strokeWidth: width }
  }

  return (
    <InteractivePage
      title="ANN Visualizer"
      formula="a1 = σ(W1·x + b1), y = softmax(W2·a1 + b2)"
      explanation={explanation}
      inputSection={
        
          <>
            <InputCard title="Architecture">
              <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                <div className="input-group"><label>Inputs</label><input type="number" min={1} value={numInputs} onChange={e=>onChangeSizes(Math.max(1,parseInt(e.target.value||'1',10)), numHidden, numOutputs)} /></div>
                <div className="input-group"><label>Hidden</label><input type="number" min={1} value={numHidden} onChange={e=>onChangeSizes(numInputs, Math.max(1,parseInt(e.target.value||'1',10)), numOutputs)} /></div>
                <div className="input-group"><label>Outputs</label><input type="number" min={1} value={numOutputs} onChange={e=>onChangeSizes(numInputs, numHidden, Math.max(1,parseInt(e.target.value||'1',10)))} /></div>
              </div>
            </InputCard>

            <InputCard title={`Inputs x (${numInputs})`}>
              <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                {inputs.map((v,i)=>(
                  <div key={i} className="input-group" style={{minWidth:120}}>
                    <label>{`x${i+1}`}</label>
                    <input type="number" step="0.1" value={v} onChange={e=>updateInput(i,e.target.value)} />
                  </div>
                ))}
              </div>
            </InputCard>

            <InputCard title={`Hidden Weights W1 (${numHidden}×${numInputs}) and b1 (${numHidden})`}>
              {W1.map((row,i)=>(
                <div key={i} style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem',flexWrap:'wrap'}}>
                  {row.map((v,j)=>(<input key={j} type="number" step="0.1" value={v} onChange={e=>updateW1(i,j,e.target.value)} style={{width:80}} />))}
                  <span style={{alignSelf:'center'}}>b1[{i}]</span>
                  <input type="number" step="0.1" value={b1[i]} onChange={e=>updateB1(i,e.target.value)} style={{width:80}} />
                </div>
              ))}
            </InputCard>
            <InputCard title={`Output Weights W2 (${numOutputs}×${numHidden}) and b2 (${numOutputs})`}>
              {W2.map((row,i)=>(
                <div key={i} style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem',flexWrap:'wrap'}}>
                  {row.map((v,j)=>(<input key={j} type="number" step="0.1" value={v} onChange={e=>updateW2(i,j,e.target.value)} style={{width:80}} />))}
                  <span style={{alignSelf:'center'}}>b2[{i}]</span>
                  <input type="number" step="0.1" value={b2[i]} onChange={e=>updateB2(i,e.target.value)} style={{width:80}} />
                </div>
              ))}
            </InputCard>
            <div className="button-group">
              <button className="btn-primary" onClick={run}>Run Forward Pass</button>
              <button className="btn-secondary" onClick={()=>{setSteps([]);setOutput(null)}}>Reset</button>
            </div>
          </>
        }
      outputSection={
        <div>
          <OutputCard title="Network Diagram">
            <div style={{display:'flex',justifyContent:'center',padding:12}}>
              <div style={{display:'flex',gap:48,alignItems:'center'}}>
                <div style={{display:'grid',gap:12}}>
                  {Array.from({length:numInputs},(_,i)=>(<Node key={`in-${i}`} label={`x${i+1}`}/>))}
                </div>
                <div style={{display:'grid',gap:12}}>
                  {Array.from({length:numHidden},(_,i)=>(<Node key={`h-${i}`} label={`h${i+1}`}/>))}
                </div>
                <div style={{display:'grid',gap:12}}>
                  {Array.from({length:numOutputs},(_,i)=>(<Node key={`o-${i}`} label={`o${i+1}`}/>))}
                </div>
              </div>
            </div>
            {/* SVG overlay for wires */}
            <div style={{position:'relative', height: 260}}>
              <svg width="420" height="260" style={{display:'block',margin:'0 auto'}}>
                {/* Input -> Hidden */}
                {diagram.layers[0].map((pIn, j) => (
                  diagram.layers[1].map((pH, i) => (
                    <g key={`e1-${i}-${j}`}>
                      <line x1={pIn.x} y1={pIn.y} x2={pH.x} y2={pH.y} {...weightStroke(W1[i]?.[j] ?? 0)} opacity={0.9} />
                      <text x={(pIn.x+pH.x)/2} y={(pIn.y+pH.y)/2 - 4} textAnchor="middle" fontSize="10" fill="#374151">{(W1[i]?.[j] ?? 0).toFixed(2)}</text>
                    </g>
                  ))
                ))}
                {/* Hidden -> Output */}
                {diagram.layers[1].map((pH, j) => (
                  diagram.layers[2].map((pO, i) => (
                    <g key={`e2-${i}-${j}`}>
                      <line x1={pH.x} y1={pH.y} x2={pO.x} y2={pO.y} {...weightStroke(W2[i]?.[j] ?? 0)} opacity={0.9} />
                      <text x={(pH.x+pO.x)/2} y={(pH.y+pO.y)/2 - 4} textAnchor="middle" fontSize="10" fill="#374151">{(W2[i]?.[j] ?? 0).toFixed(2)}</text>
                    </g>
                  ))
                ))}
              </svg>
            </div>
          </OutputCard>
          {steps.length>0 && <StepByStepDisplay steps={steps} title="Forward Pass (Sigmoid + Softmax)" />}
          {output && (
            <OutputCard title="Output (Softmax)">
              <div style={{padding:'0.5rem'}}>
                <p><strong>y0:</strong> {output.probs[0].toFixed(4)}</p>
                <p><strong>y1:</strong> {output.probs[1].toFixed(4)}</p>
                <p><strong>Prediction:</strong> class {output.pred}</p>
              </div>
            </OutputCard>
          )}
          {!output && <OutputCard isEmpty={true} />}
        </div>
      }
      algorithmExplanation={explanation}
    />
  )
}

export default ANNVisualizer


