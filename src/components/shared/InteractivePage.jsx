import { useState } from 'react'
import './InteractivePage.css'

function InteractivePage({ 
  title, 
  formula, 
  explanation, 
  inputSection, 
  outputSection, 
  algorithmExplanation 
}) {
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="interactive-page">
      <div className="page-header">
        <h1>{title}</h1>
        {formula && (
          <div className="formula-display">
            <code>{formula}</code>
          </div>
        )}
      </div>

      <div className="page-grid">
        {/* Input Section */}
        <div className="section-card input-section">
          <div className="section-header">
            <h2>📥 Input</h2>
          </div>
          <div className="section-content">
            {inputSection}
          </div>
        </div>

        {/* Output Section */}
        <div className="section-card output-section">
          <div className="section-header">
            <h2>📤 Output</h2>
          </div>
          <div className="section-content">
            {outputSection}
          </div>
        </div>

        {/* Algorithm Explanation Section */}
        <div className="section-card explanation-section">
          <div className="section-header">
            <h2>
              📚 Algorithm Explanation
              <button 
                className="toggle-btn"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? '▼' : '▶'}
              </button>
            </h2>
          </div>
          {showExplanation && (
            <div className="section-content">
              {algorithmExplanation || explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InteractivePage

