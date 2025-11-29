"use client";

import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, MessageCircle, TrendingUp, Calendar, FileText } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { useState } from "react"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  description: string
  summary?: string
  url: string
  urlToImage: string
  publishedAt: string
  source: string
  category?: string
  score?: number
  comments?: number
  subreddit?: string
  author?: string
}

export default function NewsCard({ news }: { news: NewsItem }) {
  const isRedditSource = news.source?.includes("Reddit")
  const sourceName = isRedditSource ? news.source : news.source
  const [showSummary, setShowSummary] = useState(false)
  
  const toggleSummary = () => {
    setShowSummary(!showSummary)
  }
  
  return (
    <div className="bg-white dark:bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-200">
      <div className="md:flex h-full">
        <div className="md:flex-shrink-0 relative">
          <Image
            src={news.urlToImage || "/placeholder.svg"}
            alt={news.title}
            width={300}
            height={200}
            className="h-48 w-full object-cover md:w-64 md:h-full"
          />
          {news.category && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0">
                {news.category}
              </Badge>
            </div>
          )}
          {isRedditSource && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Reddit
              </Badge>
            </div>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center text-sm text-blue-600 dark:text-blue-500 font-semibold">
              <ExternalLink className="w-4 h-4 mr-1" />
              {sourceName}
            </div>
            {news.subreddit && (
              <Badge variant="outline" className="text-xs">
                r/{news.subreddit}
              </Badge>
            )}
          </div>
          
          {/* Normal News Heading - Links to Article */}
          <Link href={`/news/${encodeURIComponent(news.title)}`}>
            <h3 className="block text-xl leading-tight font-bold text-gray-900 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200 mb-3 cursor-pointer">
              {news.title}
            </h3>
          </Link>
          
          {/* Summary Section - Only shown when Read Summary is clicked */}
          {showSummary && news.summary && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Summary</span>
                </div>
                <button
                  onClick={toggleSummary}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-sm"
                >
                  Hide
                </button>
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed">
                {news.summary}
              </div>
            </div>
          )}
          
          <p className="text-gray-600 dark:text-gray-600 mb-4 flex-1 leading-relaxed">
            {news.description}
          </p>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
                </span>
                {news.author && (
                  <span className="text-gray-600 dark:text-gray-600">
                    by {news.author}
                  </span>
                )}
              </div>
              
              {isRedditSource && (
                <div className="flex items-center space-x-3">
                  {news.score && (
                    <span className="flex items-center text-green-600 dark:text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {news.score.toLocaleString()}
                    </span>
                  )}
                  {news.comments && news.comments > 0 && (
                    <span className="flex items-center text-blue-600 dark:text-blue-500">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {news.comments.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={toggleSummary}
                className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
                  showSummary
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {showSummary ? 'Hide Summary' : 'Read Summary'}
              </button>
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm font-medium">
                  <ExternalLink className="w-4 h-4 inline mr-1" />
                  Source
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

