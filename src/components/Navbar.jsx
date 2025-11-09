function Navbar({ title, subtitle }) {
  return (
    <nav className="navbar">
      <h2>{title || 'DAA & DIP Dashboard'}</h2>
      {subtitle && <p>{subtitle}</p>}
    </nav>
  )
}

export default Navbar

