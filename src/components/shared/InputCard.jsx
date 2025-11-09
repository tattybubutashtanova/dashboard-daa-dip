import './InputCard.css'

function InputCard({ title, children }) {
  return (
    <div className="input-card">
      {title && <h3 className="input-card-title">{title}</h3>}
      <div className="input-card-content">
        {children}
      </div>
    </div>
  )
}

export default InputCard

