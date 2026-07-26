import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const employerLinks = [
    { label: 'Dashboard', to: '/employer' },
    { label: 'Post job', to: '/employer/post' },
  ]

  const candidateLinks = [
    { label: 'Browse jobs', to: '/jobs' },
    { label: 'My dashboard', to: '/candidate' },
  ]

  return (
    <header className="border-b border-slate-200 bg-slate-950 text-slate-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold tracking-tight text-white">
          AI Job Portal
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <Link to="/jobs" className="rounded-full px-4 py-2 transition hover:bg-slate-800">Browse jobs</Link>
          {user?.role === 'employer' ? (
            employerLinks.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-full px-4 py-2 transition hover:bg-slate-800">{link.label}</Link>
            ))
          ) : user?.role === 'job_seeker' ? (
            candidateLinks.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-full px-4 py-2 transition hover:bg-slate-800">{link.label}</Link>
            ))
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">{user.name}</span>
              <button onClick={() => { logout(); navigate('/') }} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-800">Login</Link>
              <Link to="/register" className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
