import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mood Journal',
  description: 'Express how you feel today',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
