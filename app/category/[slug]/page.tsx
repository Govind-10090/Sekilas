"use client"

import { useParams } from "next/navigation"
import NewsFeed from "../../components/NewsFeed"
import Navbar from "../../components/Navbar"

export default function CategoryPage() {
  const params = useParams()
  const category = params.slug as string

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-200 capitalize">
            {category} News
          </h1>
        </div>
        
        <NewsFeed category={category} />
      </div>
    </main>
  )
} 