"use client"

import { useParams } from "next/navigation"
import Navbar from "../../components/Navbar"
import { Clock, Share2, User } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const articleId = decodeURIComponent(params.id as string)

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true)
        setError(null)
        // Fetch all news (could be optimized by category or search if needed)
        const res = await fetch('/api/news?category=business')
        if (!res.ok) throw new Error('Failed to fetch articles')
        const data = await res.json()
        if (Array.isArray(data)) {
          const found = data.find((item: any) => item.title === articleId)
          if (found) setArticle(found)
          else setError('Article not found')
        } else {
          setError('Invalid data format')
        }
      } catch (e: any) {
        setError(e.message || 'Error fetching article')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [articleId])

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="h-96 bg-cream rounded-2xl animate-pulse mb-8" />
          ) : error || !article ? (
            <div className="text-burgundy bg-burgundy/10 p-8 rounded-2xl">{error || 'Article not found.'}</div>
          ) : (
            <>
              <img src={article.image_url} alt={article.title} className="rounded-2xl w-full h-96 object-cover shadow-card mb-8 bg-[hsl(var(--card))]" />
              <h1 className="text-display font-serif font-bold mb-4 leading-tight">{article.title}</h1>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full object-cover border-2 border-gold bg-gold/20 flex items-center justify-center font-bold text-gold text-xl">
                  {article.source?.[0] || 'A'}
                </div>
                <div>
                  <div className="font-serif text-lg text-gold font-semibold">{article.source}</div>
                  <div className="flex items-center text-gray-500 text-sm gap-2">
                    <Clock className="w-4 h-4 text-gold" />
                    <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                  </div>
                </div>
                <button className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-gold text-gold hover:bg-gold hover:text-white transition-all">
                  <Share2 className="w-5 h-5" /> Share
                </button>
              </div>
              <div className="prose prose-lg max-w-none font-sans">
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-gold">Read original source</a>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </main>
  )
} 