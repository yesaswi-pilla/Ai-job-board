import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BrowseJobsPage from './pages/BrowseJobsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import EmployerDashboardPage from './pages/EmployerDashboardPage'
import CandidateDashboardPage from './pages/CandidateDashboardPage'
import CompanyPage from './pages/CompanyPage'
import PostJobPage from './pages/PostJobPage'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  const location = useLocation()
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <NavBar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<BrowseJobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/companies/:id" element={<CompanyPage />} />
            <Route path="/employer" element={<RequireAuth><EmployerDashboardPage /></RequireAuth>} />
            <Route path="/employer/post/:jobId?" element={<RequireAuth><PostJobPage /></RequireAuth>} />
            <Route path="/candidate" element={<RequireAuth><CandidateDashboardPage /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
