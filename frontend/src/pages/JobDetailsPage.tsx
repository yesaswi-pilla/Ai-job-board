import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUrl, setResumeUrl] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return
      setLoading(true)
      try {
        const response = await api.get(`/api/jobs/${id}`)
        setJob(response.data.job)
      } catch (err) {
        setError('Unable to load job details.')
      } finally {
        setLoading(false)
      }
    }
    loadJob()
  }, [id])

  const uploadResume = async (): Promise<string | null> => {
    if (!resumeFile) return null
    const formData = new FormData()
    formData.append('resume', resumeFile)
    const response = await api.post('/api/uploads/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const resumeUrl = response.data.resume_url
    setResumeUrl(resumeUrl)
    return resumeUrl
  }

  const handleApply = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!id) return
    setError('')
    setApplying(true)
    try {
      let effectiveResumeUrl = resumeUrl
      if (resumeFile && !effectiveResumeUrl) {
        const uploadedResumeUrl = await uploadResume()
        if (!uploadedResumeUrl) {
          throw new Error('Unable to upload resume. Please try again.')
        }
        effectiveResumeUrl = uploadedResumeUrl
      }
      if (!effectiveResumeUrl) {
        throw new Error('Please upload your resume before applying.')
      }
      await api.post('/api/applications', {
        job_id: Number(id),
        resume_url: effectiveResumeUrl,
        cover_letter: coverLetter || `I am interested in the ${job.title} role at ${job.company.name}.`,
      })
      navigate('/candidate')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to submit application.')
    } finally {
      setApplying(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!id) return
    setError('')
    try {
      await api.post(`/api/users/saved/${id}`)
      setSaved(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save job.')
    }
  }

  if (loading) return <LoadingSpinner />
  if (error || !job) return <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error || 'Job not found.'}</div>

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">{job.company.name}</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{job.title}</h1>
            <p className="mt-3 text-sm text-slate-500">{job.location} · {job.employment_type} · {job.experience}</p>
          </div>
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Posted:</strong> {job.posted_date}</p>
            <p><strong>Deadline:</strong> {job.deadline}</p>
            <p><strong>Applicants:</strong> {job.applicant_count}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">About this role</h2>
              <p className="mt-4 text-slate-600">{job.description}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-slate-900">Responsibilities</h2>
              <p className="mt-4 text-slate-600 whitespace-pre-line">{job.responsibilities}</p>
            </section>
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill: string) => (
                    <span key={skill} className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Benefits</h3>
                <div className="mt-4 space-y-2 text-slate-600">
                  {job.benefits.length ? job.benefits.map((benefit: string) => <p key={benefit}>• {benefit}</p>) : <p>No additional benefits listed.</p>}
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Company info</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><strong>{job.company.name}</strong></p>
                <p>{job.company.industry}</p>
                <p>{job.company.location}</p>
                <a href={job.company.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Visit website</a>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Resume (PDF)
                  <input type="file" accept="application/pdf" onChange={(event) => setResumeFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-slate-700" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Cover letter
                  <textarea value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} rows={4} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" placeholder="Write a short note for the recruiter" />
                </label>
                <button onClick={handleApply} disabled={applying} className="w-full rounded-3xl bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700 disabled:opacity-60">
                  {applying ? 'Applying...' : 'Apply for job'}
                </button>
                <button onClick={handleSave} disabled={saved} className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
                  {saved ? 'Saved' : 'Save job'}
                </button>
                <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-slate-900 hover:bg-slate-200">Share job</button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
