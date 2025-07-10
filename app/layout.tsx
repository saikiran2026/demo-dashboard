import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SOC Dashboard - Security Operations Center',
  description: 'Advanced Security Operations Center Dashboard for threat monitoring and incident response',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-dark-bg">
          {children}
        </div>
      </body>
    </html>
  )
} 