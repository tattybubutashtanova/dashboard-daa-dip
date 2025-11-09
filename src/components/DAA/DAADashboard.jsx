import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './DAADashboard.css'
import GreedyAlgorithms from './sections/GreedyAlgorithms'
import DynamicProgramming from './sections/DynamicProgramming'
import BranchAndBound from './sections/BranchAndBound'
import GeneticAlgorithm from './sections/GeneticAlgorithm'
import BruteForce from './sections/BruteForce'
import SupportingConcepts from './sections/SupportingConcepts'

const sections = [
  { id: 'greedy', path: 'greedy', title: '📍 Greedy Algorithms', component: GreedyAlgorithms },
  { id: 'dp', path: 'dp', title: '🧮 Dynamic Programming', component: DynamicProgramming },
  { id: 'bnb', path: 'bnb', title: '🔍 Branch and Bound', component: BranchAndBound },
  { id: 'genetic', path: 'genetic', title: '🧬 Genetic Algorithm', component: GeneticAlgorithm },
  { id: 'brute', path: 'brute', title: '🧠 Brute Force', component: BruteForce },
  { id: 'supporting', path: 'supporting', title: '📊 Supporting Concepts', component: SupportingConcepts },
]

function DAADashboard() {
  return (
    <div className="daa-dashboard">
      <div className="sidebar">
        <h2>⚙️ Design & Analysis of Algorithms</h2>
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
          <Route path="/" element={<Navigate to="greedy" replace />} />
          {sections.map(section => (
            <Route key={section.id} path={section.path} element={<section.component />} />
          ))}
        </Routes>
      </div>
    </div>
  )
}

export default DAADashboard

