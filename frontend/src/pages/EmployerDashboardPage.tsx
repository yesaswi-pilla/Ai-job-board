import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'

export default function EmployerDashboardPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadEmployerData = async () => {
      setLoading(true)
      try {
        const jobsRes = await api.get('/api/jobs', { params: { owner_id: user?.id } })
        setJobs(jobsRes.data.jobs)
      } catch (err) {
        setError('Unable to load employer dashboard.')
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      loadEmployerData()
    }
  }, [user])

  if (!user) return <LoadingSpinner />
  if (user.role !== 'employer') {
    return <div className="rounded-3xl bg-yellow-50 p-6 text-yellow-700">Only employer accounts can access this dashboard.</div>
  }
  if (loading) return <LoadingSpinner />
  if (error) return <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div>

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Employer dashboard</h1>
        <p className="mt-3 text-slate-600">Post jobs, review applications, and manage hiring workflows.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Open roles</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{jobs.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Applications</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{jobs.reduce((sum, job) => sum + (job.applicant_count || 0), 0)}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Actions</p>
            <Link to="/employer/post" className="mt-4 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Post new job</Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Active jobs</h2>
        <div className="mt-6 space-y-4">
          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 p-6 text-slate-600">You have no active jobs yet. Post a new role to begin receiving applications.</div>
          ) : jobs.map((job) => (
            <div key={job.id} className="rounded-3xl border border-slate-200 p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.company.name} · {job.location}</p>
                  <p className="mt-2 text-sm text-slate-600">Applicants: {job.applicant_count || 0}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to={`/jobs/${job.id}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">View job</Link>
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">View applicants</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
