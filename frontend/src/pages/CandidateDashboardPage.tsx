import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CandidateDashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any | null>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [savedJobs, setSavedJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      try {
        const [profileRes, appsRes, savedRes] = await Promise.all([
          api.get('/api/users/profile'),
          api.get('/api/applications/user'),
          api.get('/api/users/saved'),
        ])
        setProfile(profileRes.data.user)
        setApplications(appsRes.data.applications)
        setSavedJobs(savedRes.data.saved_jobs)
      } catch (err) {
        setError('Unable to load candidate dashboard.')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (!user) return <LoadingSpinner />
  if (user.role !== 'job_seeker') {
    return <div className="rounded-3xl bg-yellow-50 p-6 text-yellow-700">Only job seeker accounts can access this dashboard.</div>
  }
  if (loading) return <LoadingSpinner />
  if (error) return <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div>

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Candidate dashboard</h1>
        <p className="mt-3 text-slate-600">Manage your profile, applications, and saved roles.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">Profile</h3>
            <p className="mt-4 text-slate-900">{profile.name}</p>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <p className="text-sm text-slate-500">{profile.role}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">Applications</h3>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{applications.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-sm uppercase tracking-[0.3em] text-slate-500">Saved jobs</h3>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{savedJobs.length}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Your applications</h2>
          <div className="mt-6 space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="rounded-3xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500">{application.job.company.name}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{application.job.title}</h3>
                <p className="mt-3 text-sm text-slate-600">Status: {application.status}</p>
                <Link to={`/jobs/${application.job.id}`} className="mt-4 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">View job</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Saved jobs</h2>
          <div className="mt-6 space-y-4">
            {savedJobs.map((saved) => (
              <div key={saved.id} className="rounded-3xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500">{saved.job.company.name}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{saved.job.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{saved.job.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
