import { useState } from 'react'
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

function CNNVisualizer() {
  const [grid, setGrid] = useState([
    [0,0,0,0,0],
    [0,1,1,1,0],
    [0,1,0,1,0],
    [0,1,1,1,0],
    [0,0,0,0,0]
  ])
  const [kernel, setKernel] = useState([[0,1,0],[1,-4,1],[0,1,0]])
  const [useSigmoid, setUseSigmoid] = useState(true)
  const [W, setW] = useState([
    [0.2,-0.1,0.1,0.0,0.3,-0.2,0.1,0.0,0.2],
    [-0.1,0.1,0.2,0.1,-0.2,0.3,-0.1,0.2,-0.1]
  ])
  const [b, setB] = useState([0,0])
  const [steps, setSteps] = useState([])
  const [feature, setFeature] = useState(null)
  const [output, setOutput] = useState(null)

  const updateGrid = (i,j,val)=>setGrid(grid.map((r,ri)=>r.map((c,cj)=>(ri===i&&cj===j?(parseFloat(val)||0):c))))
  const updateKernel = (i,j,val)=>setKernel(kernel.map((r,ri)=>r.map((c,cj)=>(ri===i&&cj===j?(parseFloat(val)||0):c))))
  const updateW = (i,j,val)=>setW(W.map((r,ri)=>r.map((c,cj)=>(ri===i&&cj===j?(parseFloat(val)||0):c))))
  const updateB = (i,val)=>setB(b.map((c,ci)=>(ci===i?(parseFloat(val)||0):c)))

  const convolveValid = (inp, ker) => {
    const H = inp.length, W = inp[0].length
    const k = ker.length, outH = H - k + 1, outW = W - k + 1
    const out = Array(outH).fill(0).map(()=>Array(outW).fill(0))
    for (let y=0;y<outH;y++){
      for (let x=0;x<outW;x++){
        let sum=0
        for (let ky=0;ky<k;ky++){
          for (let kx=0;kx<k;kx++){
            sum += inp[y+ky][x+kx] * ker[ky][kx]
          }
        }
        out[y][x]=sum
      }
    }
    return out
  }

  const run = () => {
    const s=[]
    s.push({ description:'Input (5×5)', data:grid.map(r=>r.join(' ')).join('\n') })
    s.push({ description:'Kernel (3×3)', data:kernel.map(r=>r.join(' ')).join('\n') })
    let feat = convolveValid(grid, kernel)
    s.push({ description:'Convolution output (3×3)', data:feat.map(r=>r.map(v=>v.toFixed(3)).join(' ')).join('\n') })
    if (useSigmoid) {
      feat = feat.map(row => row.map(sigmoid))
      s.push({ description:'Sigmoid on feature map', data:feat.map(r=>r.map(v=>v.toFixed(3)).join(' ')).join('\n') })
    }
    setFeature(feat)
    const flat = feat.flat()
    const z = [
      W[0].reduce((acc,w,j)=>acc+w*flat[j], b[0]),
      W[1].reduce((acc,w,j)=>acc+w*flat[j], b[1])
    ]
    s.push({ description:'Dense pre-activations', data:`[${z.map(v=>v.toFixed(3)).join(', ')}]` })
    const y = softmax(z)
    s.push({ description:'Output softmax', data:`[${y.map(v=>v.toFixed(3)).join(', ')}]` })
    s.push({ description:'Prediction', result:`class ${y[0]>y[1]?0:1}` })
    setSteps(s)
    setOutput({ probs:y, pred:y[0]>y[1]?0:1 })
  }

  const Cell = ({ value, onChange, width=48 }) => (
    <input type="number" step="0.1" value={value} onChange={e=>onChange(e.target.value)}
      style={{ width, padding:'0.4rem', textAlign:'center', border:'1px solid #ccc', borderRadius:6 }} />
  )

  const explanation = (<><p>5×5 → conv 3×3 (valid) → sigmoid (optional) → flatten → dense(2) → softmax.</p></>)

  return (
    <InteractivePage
      title="CNN Visualizer"
      formula="y = softmax(W·flatten(σ(conv(x,K))) + b)"
      explanation={explanation}
      inputSection={
        <div>
          <InputCard title="Input Image (5×5)">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,56px)', gap:6 }}>
              {grid.map((row,i)=>row.map((v,j)=>(<Cell key={`${i}-${j}`} value={v} onChange={(val)=>updateGrid(i,j,val)} />)))}
            </div>
          </InputCard>
          <InputCard title="Convolution Kernel (3×3)">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,56px)', gap:6 }}>
              {kernel.map((row,i)=>row.map((v,j)=>(<Cell key={`k-${i}-${j}`} value={v} onChange={(val)=>updateKernel(i,j,val)} />)))}
            </div>
            <div className="input-group" style={{ marginTop:'0.75rem' }}>
              <label>Apply Sigmoid <input type="checkbox" checked={useSigmoid} onChange={e=>setUseSigmoid(e.target.checked)} style={{ marginLeft:8 }} /></label>
            </div>
          </InputCard>
          <InputCard title="Dense Weights (2×9) and Bias (2)">
            {[0,1].map(i=>(
              <div key={i} style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:'0.5rem' }}>
                {W[i].map((v,j)=>(<Cell key={`w-${i}-${j}`} value={v} onChange={(val)=>updateW(i,j,val)} width={64} />))}
                <span style={{ alignSelf:'center' }}>b[{i}]</span>
                <Cell value={b[i]} onChange={(val)=>updateB(i,val)} width={64} />
              </div>
            ))}
          </InputCard>
          <div className="button-group">
            <button className="btn-primary" onClick={run}>Run Forward Pass</button>
            <button className="btn-secondary" onClick={()=>{setSteps([]);setFeature(null);setOutput(null)}}>Reset</button>
          </div>
        </div>
      }
      outputSection={
        <div>
          {feature && (
            <OutputCard title="Feature Map (3×3)">
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,64px)', gap:6, padding:'0.5rem' }}>
                {feature.map((row,i)=>row.map((v,j)=>(
                  <div key={`f-${i}-${j}`} style={{ padding:'0.6rem', textAlign:'center', background:'#f6f8ff', border:'1px solid #dfe6ff', borderRadius:6, fontWeight:600 }}>
                    {v.toFixed(2)}
                  </div>
                )))}
              </div>
            </OutputCard>
          )}
          {steps.length>0 && <StepByStepDisplay steps={steps} title="Forward Pass (Conv → Sigmoid → Dense → Softmax)" />}
          {output && (
            <OutputCard title="Output (Softmax)">
              <div style={{ padding:'0.5rem' }}>
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

export default CNNVisualizer


