import './OutputCard.css'

function OutputCard({ title, children, isEmpty = false }) {
  return (
    <div className="output-card">
      {title && <h3 className="output-card-title">{title}</h3>}
      <div className="output-card-content">
        {isEmpty ? (
          <div className="empty-state">
            <p>No results yet. Provide input and click "Run" to see results.</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default OutputCard

