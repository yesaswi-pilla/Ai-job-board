import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Job Board',
  description: 'A jobs board and social feed powered by AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
