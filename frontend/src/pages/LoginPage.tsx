import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Login to your account</h1>
      <p className="mt-2 text-sm text-slate-500">Access your employer or candidate dashboard.</p>
      {error ? <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" type="email" required />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" type="password" required />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">New to the portal? <Link to="/register" className="font-semibold text-slate-900">Create an account</Link>.</p>
    </div>
  )
}
