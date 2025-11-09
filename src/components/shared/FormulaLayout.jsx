import './FormulaLayout.css'

function FormulaLayout({ title, formula, explanation, children, additionalInfo }) {
  return (
    <div className="formula-layout">
      <h2>{title}</h2>
      <div className="formula-layout-content">
        <div className="formula-panel">
          <div className="formula-box">
            <h3>Formula</h3>
            <div className="formula-content">
              {formula}
            </div>
          </div>
          <div className="explanation-box">
            <h3>Explanation</h3>
            <div className="explanation-content">
              {explanation}
            </div>
          </div>
          {additionalInfo && (
            <div className="additional-info">
              {additionalInfo}
            </div>
          )}
        </div>
        <div className="interactive-panel">
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormulaLayout

