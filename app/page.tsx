'use client'

import { useMemo, useState } from 'react'

const jobs = [
  {
    title: 'Senior Machine Learning Engineer',
    company: 'Flipkart',
    location: 'Bengaluru, India',
    salary: '₹30L - ₹40L',
    experience: 'Senior',
    type: 'Full-Time',
    tags: ['ML', 'Recommendation', 'Python'],
    posted: '1 day ago',
    url: 'https://www.linkedin.com/jobs/view/3623883423/',
  },
  {
    title: 'Product Manager - Payments',
    company: 'PhonePe',
    location: 'Bengaluru, India',
    salary: '₹22L - ₹28L',
    experience: 'Mid-level',
    type: 'Hybrid',
    tags: ['Product', 'Payments', 'FinTech'],
    posted: '2 days ago',
    url: 'https://www.linkedin.com/jobs/view/3586291036/',
  },
  {
    title: 'Data Scientist - NLP',
    company: 'Swiggy',
    location: 'Bengaluru, India',
    salary: '₹24L - ₹32L',
    experience: 'Senior',
    type: 'Full-Time',
    tags: ['NLP', 'Data', 'TensorFlow'],
    posted: '3 days ago',
    url: 'https://www.linkedin.com/jobs/view/3600112252/',
  },
  {
    title: 'Growth Marketing Manager',
    company: 'Zomato',
    location: 'Delhi NCR, India',
    salary: '₹18L - ₹22L',
    experience: 'Mid-level',
    type: 'Full-Time',
    tags: ['Growth', 'Digital Marketing', 'Brand'],
    posted: '4 days ago',
    url: 'https://www.linkedin.com/jobs/view/3601296257/',
  },
  {
    title: 'UI/UX Designer',
    company: 'Freshworks',
    location: 'Chennai, India',
    salary: '₹14L - ₹17L',
    experience: 'Junior',
    type: 'Remote',
    tags: ['Design', 'Figma', 'Research'],
    posted: '2 days ago',
    url: 'https://www.linkedin.com/jobs/view/3595416249/',
  },
  {
    title: 'Staff Data Engineer',
    company: 'Amazon',
    location: 'Hyderabad, India',
    salary: '₹35L - ₹45L',
    experience: 'Senior',
    type: 'Full-Time',
    tags: ['Data', 'AWS', 'ETL'],
    posted: '1 day ago',
    url: 'https://www.amazon.jobs/en/jobs/2169875/staff-data-engineer',
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Google',
    location: 'Bengaluru, India',
    salary: '₹38L - ₹48L',
    experience: 'Senior',
    type: 'Full-Time',
    tags: ['React', 'Frontend', 'Web'],
    posted: '6 hours ago',
    url: 'https://careers.google.com/jobs/results/1234567890-senior-frontend-engineer/',
  },
  {
    title: 'Associate Product Manager',
    company: 'Reliance Jio',
    location: 'Mumbai, India',
    salary: '₹16L - ₹20L',
    experience: 'Junior',
    type: 'Onsite',
    tags: ['Product', 'Telecom', 'Strategy'],
    posted: '3 days ago',
    url: 'https://jio.com/careers/product-manager',
  },
  {
    title: 'Enterprise Sales Executive',
    company: 'Microsoft',
    location: 'Pune, India',
    salary: '₹20L - ₹26L',
    experience: 'Mid-level',
    type: 'Hybrid',
    tags: ['Sales', 'Enterprise', 'SaaS'],
    posted: '5 days ago',
    url: 'https://careers.microsoft.com/us/en/job/999999/enterprise-sales-executive',
  },
]

const posts = [
  {
    author: 'Riya Shah',
    role: 'HR Lead',
    text: 'We have opened new hybrid roles across Bengaluru and Mumbai with immediate joiners preferred.',
    icon: '🔎',
  },
  {
    author: 'Aman Singh',
    role: 'Product Head',
    text: 'Our FinTech product team is expanding rapidly with strong focus on user retention and AI insights.',
    icon: '📊',
  },
  {
    author: 'Priya Kapoor',
    role: 'Design Lead',
    text: 'We are hiring designers who can create delightful experiences for India-first products.',
    icon: '🎨',
  },
]

const locations = ['All cities', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Delhi NCR', 'Chennai', 'Remote']
const experiences = ['All experience levels', 'Junior', 'Mid-level', 'Senior']
const categories = ['All categories', 'AI/ML', 'Product', 'Marketing', 'Design', 'Sales']

export default function Home() {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('All cities')
  const [experienceFilter, setExperienceFilter] = useState('All experience levels')
  const [categoryFilter, setCategoryFilter] = useState('All categories')

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = `${job.title} ${job.company} ${job.location} ${job.tags.join(' ')}`.toLowerCase()
      const matchesText = searchText.includes(search.toLowerCase())
      const matchesLocation = locationFilter === 'All cities' || job.location.includes(locationFilter)
      const matchesExperience = experienceFilter === 'All experience levels' || job.experience === experienceFilter
      const matchesCategory =
        categoryFilter === 'All categories' || job.tags.some((tag) => tag.toLowerCase().includes(categoryFilter.toLowerCase()))
      return matchesText && matchesLocation && matchesExperience && matchesCategory
    })
  }, [search, locationFilter, experienceFilter, categoryFilter])

  return (
    <main className="page-shell">
      <header className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">India’s AI job marketplace</span>
          <h1>Explore premium Indian jobs in AI, product, marketing, and design.</h1>
          <p className="lead">
            Search verified roles from Bengaluru, Mumbai, Hyderabad, Delhi NCR and more—built for fast hiring and better candidate fit.
          </p>
          <div className="hero-actions">
            <button className="primary-button">Browse jobs</button>
            <button className="secondary-button">Post a role</button>
          </div>
        </div>

        <div className="hero-summary">
          <div className="summary-card summary-card-glow">
            <span>Verified jobs</span>
            <strong>1,842+</strong>
          </div>
          <div className="summary-card">
            <span>Hiring companies</span>
            <strong>96</strong>
          </div>
          <div className="summary-card">
            <span>Top cities</span>
            <strong>Bengaluru · Mumbai</strong>
          </div>
        </div>
      </header>

      <section className="filter-panel">
        <div className="filter-header">
          <div>
            <h2>Refine your job search</h2>
            <p>Filter jobs by city, level, category and keywords relevant to India’s market.</p>
          </div>
          <span className="filter-badge">{filteredJobs.length} live jobs</span>
        </div>

        <div className="filter-controls">
          <label className="control-field">
            <span>Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs, skills, companies..."
            />
          </label>

          <label className="control-field">
            <span>City</span>
            <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </label>

          <label className="control-field">
            <span>Experience</span>
            <select value={experienceFilter} onChange={(event) => setExperienceFilter(event.target.value)}>
              {experiences.map((experience) => (
                <option key={experience} value={experience}>{experience}</option>
              ))}
            </select>
          </label>

          <label className="control-field">
            <span>Category</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="jobs-layout">
        <div className="jobs-column">
          <div className="section-title-row">
            <div>
              <h2>Jobs trending today</h2>
              <p className="subtle-text">Fresh opportunities from top Indian employers.</p>
            </div>
            <span className="status-pill">Updated hourly</span>
          </div>

          <div className="job-list">
            {filteredJobs.map((job) => (
              <article className="job-card" key={`${job.title}-${job.company}`}>
                <div className="job-card-header">
                  <div>
                    <p className="job-tag">{job.type}</p>
                    <h3>{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                  </div>
                  <div className="job-share">{job.posted}</div>
                </div>

                <div className="job-meta">
                  <span>{job.location}</span>
                  <span>{job.experience}</span>
                  <span>{job.salary}</span>
                </div>

                <div className="job-tags">
                  {job.tags.map((tag) => (
                    <span key={tag} className="pill">{tag}</span>
                  ))}
                </div>

                <div className="job-actions">
                  <a href={job.url} target="_blank" rel="noreferrer" className="outlined-button">
                    View details
                  </a>
                  <a href={job.url} target="_blank" rel="noreferrer" className="primary-button">
                    Apply now
                  </a>
                </div>
              </article>
            ))}

            {filteredJobs.length === 0 && (
              <div className="empty-state">
                <h3>No matching roles found</h3>
                <p>Try broadening your filters or changing the city to discover more roles.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="insight-column">
          <div className="insight-card">
            <h3>Market insight</h3>
            <p>Top Indian skills and role types are surfaced for faster hiring and better candidate match.</p>
            <div className="metric-grid">
              <div>
                <strong>87%</strong>
                <span>Skill match</span>
              </div>
              <div>
                <strong>3.9x</strong>
                <span>Application boost</span>
              </div>
              <div>
                <strong>18</strong>
                <span>New companies</span>
              </div>
            </div>
          </div>

          <div className="insight-card accent-card">
            <div className="insight-card-header">
              <div>
                <p className="eyebrow">Hiring spotlight</p>
                <h3>Bengaluru & Hyderabad demand</h3>
              </div>
              <span className="accent-pill">+31%</span>
            </div>
            <p>South Indian tech hubs are driving hiring for AI, product, and marketing teams with strong growth momentum.</p>
          </div>

          <div className="activity-card">
            <div className="section-title-row">
              <h2>Employer pulse</h2>
            </div>
            <div className="activity-list">
              {posts.map((post) => (
                <div key={post.author} className="activity-item">
                  <span className="activity-icon">{post.icon}</span>
                  <div>
                    <strong>{post.author}</strong>
                    <p>{post.text}</p>
                    <small>{post.role}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
