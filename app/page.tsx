const jobs = [
  { title: 'AI Product Manager', company: 'NextGen Labs', location: 'Remote', salary: '$120k - $140k' },
  { title: 'Frontend Engineer', company: 'SparkTech', location: 'San Francisco, CA', salary: '$110k - $130k' },
  { title: 'Data Scientist', company: 'Aquila AI', location: 'New York, NY', salary: '$125k - $145k' },
]

const posts = [
  { author: 'Mia', text: 'Launched our AI hiring assistant today! Talent matches are 30% faster.' },
  { author: 'Noah', text: 'Growing the team for product-market fit: designers, engineers, growth.' },
  { author: 'Avery', text: 'We just shipped a smart resume parser to filter top candidates.' },
]

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <main className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">AI business app</p>
          <h1>AI Job Board + Social Feed</h1>
          <p className="lead">
            Browse curated job listings, connect with talent, and share product updates in one clean app.
          </p>
        </div>
      </header>

      <div className="grid">
        <Card title="Featured Jobs">
          <ul>
            {jobs.map((job) => (
              <li key={job.title}>
                <strong>{job.title}</strong>
                <div>{job.company} · {job.location}</div>
                <div className="muted">{job.salary}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Team Feed">
          <ul>
            {posts.map((post) => (
              <li key={post.author}>
                <strong>{post.author}</strong>
                <p>{post.text}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </main>
  )
}
