import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'

export default function PostJobPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [companies, setCompanies] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    skills: '',
    benefits: '',
    salary: '',
    location: '',
    experience: '',
    employment_type: 'Full-Time',
    remote: false,
    deadline: '',
    company_id: '',
    category_id: '',
  })
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    location: '',
    employee_count: '',
    logo_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [creatingCompany, setCreatingCompany] = useState(false)
  const [error, setError] = useState('')
  const [companyError, setCompanyError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [companiesRes, categoriesRes] = await Promise.all([
          api.get('/api/companies/mine'),
          api.get('/api/categories'),
        ])
        setCompanies(companiesRes.data.companies)
        setCategories(categoriesRes.data.categories)
      } catch (err) {
        setError('Unable to load companies or categories.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateCompany = async () => {
    setCompanyError('')
    if (!companyForm.name || !companyForm.description || !companyForm.industry || !companyForm.website || !companyForm.location || !companyForm.employee_count) {
      setCompanyError('All company fields except logo are required.')
      return
    }

    setCreatingCompany(true)
    try {
      const response = await api.post('/api/companies', {
        name: companyForm.name,
        description: companyForm.description,
        industry: companyForm.industry,
        website: companyForm.website,
        location: companyForm.location,
        employee_count: Number(companyForm.employee_count),
        logo_url: companyForm.logo_url,
      })
      const newCompany = response.data.company
      setCompanies((prev) => [...prev, newCompany])
      setFormData((prev) => ({ ...prev, company_id: String(newCompany.id) }))
      setCompanyForm({ name: '', description: '', industry: '', website: '', location: '', employee_count: '', logo_url: '' })
    } catch (err: any) {
      setCompanyError(err.response?.data?.message || err.message || 'Unable to create company.')
    } finally {
      setCreatingCompany(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!formData.company_id) {
      setError('Please select one of your companies before posting.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        benefits: formData.benefits.split(',').map((benefit) => benefit.trim()).filter(Boolean),
      }
      await api.post('/api/jobs', payload)
      navigate('/employer')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to post job.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return <div className="rounded-3xl bg-red-50 p-6 text-red-700">Please login to post a job.</div>
  }

  if (user.role !== 'employer') {
    return <div className="rounded-3xl bg-yellow-50 p-6 text-yellow-700">Only employer accounts can post jobs. Switch to an employer account or register as an employer.</div>
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Employer tools</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Post a new job</h1>
          </div>
          <Link to="/employer" className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700 hover:bg-slate-100">Back to dashboard</Link>
        </div>
      </section>

      {error ? <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div> : null}

      {companies.length === 0 ? (
        <div className="space-y-6 rounded-3xl bg-yellow-50 p-6 text-yellow-700">
          <p>You do not have an employer company yet. Create one before posting jobs.</p>
          {companyError ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{companyError}</div> : null}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Create your company profile</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Company name</span>
                <input value={companyForm.name} onChange={(e) => handleCompanyChange('name', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="NexAI Labs" required />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Industry</span>
                <input value={companyForm.industry} onChange={(e) => handleCompanyChange('industry', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Artificial Intelligence" required />
              </label>
            </div>
            <label className="block mt-4">
              <span className="text-sm font-semibold text-slate-700">Description</span>
              <textarea value={companyForm.description} onChange={(e) => handleCompanyChange('description', e.target.value)} rows={3} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Describe your company." required />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Website</span>
                <input value={companyForm.website} onChange={(e) => handleCompanyChange('website', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="https://example.com" required />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Location</span>
                <input value={companyForm.location} onChange={(e) => handleCompanyChange('location', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Bengaluru" required />
              </label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Employee count</span>
                <input value={companyForm.employee_count} onChange={(e) => handleCompanyChange('employee_count', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="120" required />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Logo URL (optional)</span>
                <input value={companyForm.logo_url} onChange={(e) => handleCompanyChange('logo_url', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="https://..." />
              </label>
            </div>
            <button onClick={handleCreateCompany} disabled={creatingCompany} className="mt-6 rounded-3xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:opacity-60">
              {creatingCompany ? 'Creating company...' : 'Create company'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl bg-white p-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Job title</span>
              <input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="AI Product Manager" required />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Company</span>
              <select value={formData.company_id} onChange={(e) => handleChange('company_id', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required>
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <select value={formData.category_id} onChange={(e) => handleChange('category_id', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Location</span>
              <input value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Bengaluru" required />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Describe the role and responsibilities." required />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Responsibilities</span>
            <textarea value={formData.responsibilities} onChange={(e) => handleChange('responsibilities', e.target.value)} rows={4} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="List primary responsibilities." required />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Skills (comma separated)</span>
              <input value={formData.skills} onChange={(e) => handleChange('skills', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Python, AI, ML" required />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Benefits (comma separated)</span>
              <input value={formData.benefits} onChange={(e) => handleChange('benefits', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Health insurance, Stock options" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Salary</span>
              <input value={formData.salary} onChange={(e) => handleChange('salary', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="₹25,00,000 - ₹35,00,000" required />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Experience</span>
              <input value={formData.experience} onChange={(e) => handleChange('experience', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="4+ years" required />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Employment type</span>
              <select value={formData.employment_type} onChange={(e) => handleChange('employment_type', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Contract">Contract</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Application deadline</span>
              <input type="date" value={formData.deadline} onChange={(e) => handleChange('deadline', e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required />
            </label>
            <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input type="checkbox" checked={formData.remote} onChange={(e) => handleChange('remote', e.target.checked)} />
              <span className="text-sm text-slate-700">Remote-friendly role</span>
            </label>
          </div>

          <button type="submit" disabled={submitting} className="w-full rounded-3xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:opacity-60">
            {submitting ? 'Posting...' : 'Post job'}
          </button>
        </form>
      )}
    </div>
  )
}
