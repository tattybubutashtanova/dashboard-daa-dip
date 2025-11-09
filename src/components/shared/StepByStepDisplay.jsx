import './StepByStepDisplay.css'

function StepByStepDisplay({ steps, title = "Step-by-Step Solution" }) {
  if (!steps || steps.length === 0) {
    return null
  }

  return (
    <div className="step-by-step">
      <h3 className="step-title">{title}</h3>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <div className="step-description">{step.description}</div>
              {step.data && (
                <div className="step-data">
                  {typeof step.data === 'string' ? (
                    <pre>{step.data}</pre>
                  ) : (
                    <div className="step-table">
                      {step.data}
                    </div>
                  )}
                </div>
              )}
              {step.result && (
                <div className="step-result">
                  <strong>Result:</strong> {step.result}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepByStepDisplay

