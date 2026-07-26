import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CompanyPage() {
  const { id } = useParams()
  const [company, setCompany] = useState<any | null>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return
      setLoading(true)
      try {
        const response = await api.get(`/api/companies/${id}`)
        setCompany(response.data.company)
        setJobs(response.data.jobs)
      } catch (err) {
        setError('Unable to load company profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error || !company) return <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error || 'Company not found.'}</div>

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">{company.industry}</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{company.name}</h1>
            <p className="mt-4 text-slate-600">{company.description}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Company details</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><strong>Location:</strong> {company.location}</p>
              <p><strong>Employees:</strong> {company.employee_count}</p>
              <a href={company.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Visit website</a>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Active jobs</h2>
        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-3xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{job.location} · {job.employment_type}</p>
              <p className="mt-3 text-sm text-slate-700">{job.salary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
