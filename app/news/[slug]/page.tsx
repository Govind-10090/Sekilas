"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { ArrowLeft, ExternalLink, Clock, Calendar, TrendingUp, MessageCircle } from "lucide-react"
import Link from "next/link"
import { motion } from 'framer-motion'

interface NewsSummary {
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string | null
  category: string
  readingTime: string
  fullContent?: string
}

export default function NewsDetailPage() {
  const params = useParams()
  const [summary, setSummary] = useState<NewsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true)
        setError(null)
        
        // Decode the slug and use it as the search query
        const query = decodeURIComponent(params.slug as string)
        
        const response = await fetch(`/api/news-summary?title=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch news summary")
        }

        const data = await response.json()
        setSummary(data)
      } catch (error) {
        console.error("Error fetching news summary:", error)
        setError(error instanceof Error ? error.message : "Error fetching news summary")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchSummary()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded w-3/4" />
              <div className="h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded w-1/2" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Unable to Load News Summary
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {error || "Something went wrong while trying to load the news summary."}
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href="/">
              <Button variant="outline" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-2xl border-0 overflow-hidden">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className="bg-white/20 text-white border-0">
                    {summary.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {summary.readingTime}
                  </Badge>
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
                  {summary.title}
                </CardTitle>
                <div className="flex items-center space-x-4 mt-4 text-white/80">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {summary.source}
                  </div>
                  {summary.publishedAt && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(summary.publishedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardHeader>

              {/* Summary Content */}
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 mb-8">
                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3">
                      📰 News Summary
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                      {summary.summary}
                    </p>
                  </div>

                  {summary.fullContent && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        📖 Full Article Content
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl max-h-96 overflow-y-auto">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {summary.fullContent}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <a
                      href={summary.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read Full Article
                      </Button>
                    </a>
                    <Link href="/" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to News
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
