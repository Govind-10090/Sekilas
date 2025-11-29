"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, MessageCircle, ExternalLink, Hash } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

interface TrendingTopic {
  id: string
  title: string
  category: string
  score?: number
  comments?: number
  subreddit?: string
  url?: string
  source?: string
}

interface TrendingNowProps {
  country: string
}

export default function TrendingNow({ country }: TrendingNowProps) {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrendingTopics() {
      try {
        setLoading(true)
        const response = await fetch(`/api/trending?country=${country}`)
        if (!response.ok) {
          throw new Error("Failed to fetch trending topics")
        }
        const data = await response.json()
        
        // Check if data is an array and has the correct shape
        if (Array.isArray(data)) {
          setTrendingTopics(data)
        } else {
          console.error("Invalid trending topics data:", data)
          setError("Invalid data format received")
        }
      } catch (error) {
        console.error("Error fetching trending topics:", error)
        setError("Failed to load trending topics")
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingTopics()
  }, [country])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-600 dark:text-gray-400 py-4">
            Loading trending topics...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!trendingTopics.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-600 dark:text-gray-400 py-4">
            No trending topics available
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSourceIcon = (source: string) => {
    if (source?.includes("Reddit")) {
      return <TrendingUp className="w-4 h-4 text-orange-500" />
    }
    if (source?.includes("Keyword")) {
      return <Hash className="w-4 h-4 text-blue-500" />
    }
    return <TrendingUp className="w-4 h-4 text-blue-600" />
  }

  const getSourceColor = (source: string) => {
    if (source?.includes("Reddit")) {
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    }
    if (source?.includes("Keyword")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {trendingTopics.map((topic) => (
            <li key={topic.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getSourceIcon(topic.source || "")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className={getSourceColor(topic.source || "")}>
                      {topic.source || "Trending"}
                    </Badge>
                    {topic.subreddit && (
                      <Badge variant="secondary" className="text-xs">
                        r/{topic.subreddit}
                      </Badge>
                    )}
                  </div>
                  
                  <Link
                    href={topic.url || `/topic/${topic.id}`}
                    className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    target={topic.url?.startsWith('http') ? '_blank' : '_self'}
                  >
                    {topic.title}
                  </Link>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {topic.score && (
                      <span className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {topic.score.toLocaleString()}
                      </span>
                    )}
                    {topic.comments && topic.comments > 0 && (
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {topic.comments.toLocaleString()}
                      </span>
                    )}
                    {topic.url?.startsWith('http') && (
                      <span className="flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        External
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

