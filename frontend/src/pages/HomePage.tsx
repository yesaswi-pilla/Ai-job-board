import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HomePage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsRes, compsRes, categoriesRes] = await Promise.all([
          api.get('/api/jobs'),
          api.get('/api/companies'),
          api.get('/api/categories'),
        ])
        setJobs(jobsRes.data.jobs.slice(0, 6))
        setCompanies(compsRes.data.companies.slice(0, 6))
        setCategories(categoriesRes.data.categories)
      } catch (err) {
        setError('Unable to load portal content. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-10 text-white shadow-xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Find jobs for real growth</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">Explore the best AI, product, and tech careers in India.</h1>
            <p className="mt-4 max-w-xl text-slate-200">Search verified openings, apply instantly, and manage hiring from one production-style portal built end-to-end.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/jobs" className="rounded-full bg-amber-500 px-6 py-4 text-center font-semibold text-slate-900 shadow-lg transition hover:bg-amber-400">Browse jobs</Link>
            <Link to="/login" className="rounded-full border border-white/20 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10">Employer login</Link>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Featured jobs</p>
          <div className="mt-6 space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="block rounded-3xl border border-slate-200 p-5 hover:border-indigo-500/30 hover:bg-slate-50">
                <p className="text-sm font-semibold text-indigo-600">{job.company.name}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{job.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{job.location} · {job.employment_type}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Job categories</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <Link key={category.id} to={`/jobs?category=${encodeURIComponent(category.name)}`} className="rounded-3xl border border-slate-200 p-4 text-sm font-semibold text-slate-800 hover:border-indigo-500/30 hover:bg-slate-50">{category.name}</Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Leading companies</p>
          <div className="mt-6 grid gap-4">
            {companies.map((company) => (
              <Link key={company.id} to={`/companies/${company.id}`} className="flex items-center gap-4 rounded-3xl border border-slate-200 p-4 hover:border-indigo-500/30 hover:bg-slate-50">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 p-2">
                  <img src={company.logo_url || 'https://via.placeholder.com/48'} alt={company.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{company.name}</p>
                  <p className="text-sm text-slate-500">{company.industry}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
