import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from "./components/Footer"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sekilas - News at a Glance',
  description: 'Get the latest news and trending topics from around the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          {/* Header without dark mode toggle for premium look */}
          <header className="w-full flex justify-end items-center py-4 px-4">
            {/* Intentionally left blank for minimalist premium look */}
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

