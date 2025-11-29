"use client";

import { useState, useEffect } from "react";
import { Clock, Globe, ExternalLink, Bookmark, Share2, TrendingUp, MessageCircle, Calendar, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: string;
  publishedAt: string;
  category?: string;
  score?: number;
  comments?: number;
  subreddit?: string;
  author?: string;
  summary?: string; // Added summary field
}

interface NewsFeedProps {
  category?: string;
  query?: string;
  country?: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  const days = Math.floor(diffInHours / 24);
  return `${days}d ago`;
}

export default function NewsFeed({ category, query, country = "global" }: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [expandedSummaries, setExpandedSummaries] = useState<string[]>([]); // State to track expanded summaries

  const toggleSummary = (id: string) => {
    setExpandedSummaries(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (query) params.append('q', query);
        if (country) params.append('country', country);
        
        const response = await fetch(`/api/news?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch news");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : "Error fetching news. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [category, query, country]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-200 rounded-xl h-96" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <p className="text-blue-600 dark:text-blue-400">No news available at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Latest News {category && `- ${category.charAt(0).toUpperCase() + category.slice(1)}`}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* News Grid/List */}
      <div className={view === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-6'
      }>
        {news.map((article, idx) => {
          const isRedditSource = article.source?.includes("Reddit");
          const isSummaryExpanded = expandedSummaries.includes(article.id || article.url);
          
          return (
            <motion.div
              key={article.id || article.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={view === 'list' ? 'w-full' : ''}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0 bg-white dark:bg-gray-50 h-full">
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={article.urlToImage || "/placeholder.svg"}
                    alt={article.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  {article.category && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0">
                        {article.category}
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
                
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-500 font-semibold">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      {article.source}
                    </div>
                    {article.subreddit && (
                      <Badge variant="outline" className="text-xs">
                        r/{article.subreddit}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Normal News Heading - Links to Article */}
                  <Link href={`/news/${encodeURIComponent(article.title)}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-800 mb-3 line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200 cursor-pointer">
                      {article.title}
                    </h3>
                  </Link>
                  
                  {/* Summary Section - Only shown when Read Summary is clicked */}
                  {isSummaryExpanded && article.summary && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Summary</span>
                        </div>
                        <button
                          onClick={() => toggleSummary(article.id || article.url)}
                          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-sm"
                        >
                          Hide
                        </button>
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed">
                        {article.summary}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 dark:text-gray-600 mb-4 flex-1 leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatTimeAgo(article.publishedAt)}
                        </span>
                        {article.author && (
                          <span className="text-gray-600 dark:text-gray-600">
                            by {article.author}
                          </span>
                        )}
                      </div>
                      
                      {isRedditSource && (
                        <div className="flex items-center space-x-3">
                          {article.score && (
                            <span className="flex items-center text-green-600 dark:text-green-500">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {article.score.toLocaleString()}
                            </span>
                          )}
                          {article.comments && article.comments > 0 && (
                            <span className="flex items-center text-blue-600 dark:text-blue-500">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {article.comments.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleSummary(article.id || article.url)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
                          isSummaryExpanded
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                        }`}
                      >
                        {isSummaryExpanded ? 'Hide Summary' : 'Read Summary'}
                      </button>
                      <a
                        href={article.url}
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
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
