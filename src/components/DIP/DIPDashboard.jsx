import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './DIPDashboard.css'
import ImageFundamentals from './sections/ImageFundamentals'
import ImageEnhancement from './sections/ImageEnhancement'
import ImageFiltering from './sections/ImageFiltering'
import ImageCompression from './sections/ImageCompression'
import DeepLearningCNN from './sections/DeepLearningCNN'

const sections = [
  { id: 'fundamentals', path: 'fundamentals', title: '📍 Image Fundamentals', component: ImageFundamentals },
  { id: 'enhancement', path: 'enhancement', title: '🎨 Image Enhancement', component: ImageEnhancement },
  { id: 'filtering', path: 'filtering', title: '🔧 Image Filtering & Restoration', component: ImageFiltering },
  { id: 'compression', path: 'compression', title: '🧮 Image Compression & Encoding', component: ImageCompression },
  { id: 'cnn', path: 'cnn', title: '🤖 Deep Learning & CNN', component: DeepLearningCNN },
]

function DIPDashboard() {
  return (
    <div className="dip-dashboard">
      <div className="sidebar">
        <h2>🧠 Digital Image Processing</h2>
        <nav className="section-nav">
          {sections.map(section => (
            <NavLink
              key={section.id}
              to={section.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {section.title}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="content-area">
        <Routes>
          <Route path="/" element={<Navigate to="fundamentals" replace />} />
          {sections.map(section => (
            <Route key={section.id} path={section.path} element={<section.component />} />
          ))}
        </Routes>
      </div>
    </div>
  )
}

export default DIPDashboard

