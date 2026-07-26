import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('job_seeker')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password, role)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500">Register as a job seeker or employer to start applying or posting.</p>
      {error ? <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block text-sm font-semibold text-slate-700">
          Full name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" type="text" required />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" type="email" required />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" type="password" required />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Account type
          <select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500">
            <option value="job_seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-slate-900">Sign in</Link>.</p>
    </div>
  )
}
