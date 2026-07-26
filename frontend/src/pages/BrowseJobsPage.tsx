import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    company: searchParams.get('company') || '',
    location: searchParams.get('location') || '',
    experience: searchParams.get('experience') || '',
    category: searchParams.get('category') || '',
    employment_type: searchParams.get('employment_type') || '',
    remote: searchParams.get('remote') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page') || 1),
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pageSize] = useState(12)
  const [total, setTotal] = useState(0)

  const loadJobs = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/jobs', { params: { ...filters, page_size: pageSize } })
      setJobs(response.data.jobs)
      setTotal(response.data.pagination.total)
    } catch (err) {
      setError('Unable to fetch jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data.categories)).catch(() => {})
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, String(value))
    })
    setSearchParams(params)
    loadJobs()
  }, [filters])

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Browse jobs</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Search roles with real filters and pagination.</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
            <select value={filters.sort} onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <option value="newest">Newest</option>
              <option value="salary">Salary</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            <button onClick={loadJobs} className="rounded-3xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">Refresh</button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <input value={filters.keyword} onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value, page: 1 }))} placeholder="Keyword, skills, title, location, experience" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
              <input value={filters.company} onChange={(event) => setFilters((prev) => ({ ...prev, company: event.target.value, page: 1 }))} placeholder="Company" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
              <input value={filters.location} onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value, page: 1 }))} placeholder="Location" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <input value={filters.experience} onChange={(event) => setFilters((prev) => ({ ...prev, experience: event.target.value, page: 1 }))} placeholder="Experience" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
              <select value={filters.category} onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value, page: 1 }))} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <select value={filters.employment_type} onChange={(event) => setFilters((prev) => ({ ...prev, employment_type: event.target.value, page: 1 }))} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="">All types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <select value={filters.remote} onChange={(event) => setFilters((prev) => ({ ...prev, remote: event.target.value, page: 1 }))} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="">Remote/Onsite</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Your search</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p><strong>Keyword:</strong> {filters.keyword || 'Any'}</p>
              <p><strong>Company:</strong> {filters.company || 'Any'}</p>
              <p><strong>Location:</strong> {filters.location || 'Any'}</p>
              <p><strong>Category:</strong> {filters.category || 'Any'}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Job listings</p>
              <h2 className="text-2xl font-semibold text-slate-900">{total} roles available</h2>
            </div>
            <p className="text-sm text-slate-500">Page {filters.page} of {totalPages}</p>
          </div>
        </div>

        {error ? <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div> : null}

        <div className="grid gap-4">
          {jobs.map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-400/50">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-indigo-600">{job.company.name}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{job.location} · {job.employment_type} · {job.experience}</p>
                </div>
                <div className="space-y-2 text-right text-sm text-slate-600">
                  <p>{job.salary}</p>
                  <p>{job.category.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">Showing {jobs.length} of {total} jobs</div>
          <div className="flex flex-wrap gap-3">
            <button disabled={filters.page === 1} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
            <button disabled={filters.page === totalPages} onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
          </div>
        </div>
      </section>
    </div>
  )
}
