"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { TrendingUp, MessageCircle, Hash, Globe, Zap, Newspaper, Monitor, DollarSign, Film, Trophy, Atom, Heart, Music } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'

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

interface GenreCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
}

const genreCategories: GenreCategory[] = [
  {
    id: "hot",
    name: "🔥 Hot Topics",
    icon: <Zap className="w-5 h-5" />,
    color: "from-red-500 to-orange-500",
    description: "Most viral and trending topics overall"
  },
  {
    id: "breaking",
    name: "📰 Breaking News",
    icon: <Newspaper className="w-5 h-5" />,
    color: "from-blue-500 to-purple-500",
    description: "Latest breaking stories and urgent news"
  },
  {
    id: "technology",
    name: "💻 Technology",
    icon: <Monitor className="w-5 h-5" />,
    color: "from-cyan-500 to-blue-500",
    description: "Tech trends, AI, gadgets, and innovation"
  },
  {
    id: "business",
    name: "💰 Business & Finance",
    icon: <DollarSign className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
    description: "Market trends, economy, and business news"
  },
  {
    id: "entertainment",
    name: "🎬 Entertainment",
    icon: <Film className="w-5 h-5" />,
    color: "from-pink-500 to-rose-500",
    description: "Movies, TV, celebrities, and pop culture"
  },
  {
    id: "sports",
    name: "⚽ Sports",
    icon: <Trophy className="w-5 h-5" />,
    color: "from-yellow-500 to-orange-500",
    description: "Sports news, highlights, and updates"
  },
  {
    id: "world",
    name: "🌍 World News",
    icon: <Globe className="w-5 h-5" />,
    color: "from-indigo-500 to-purple-500",
    description: "International events and global news"
  },
  {
    id: "science",
    name: "🔬 Science",
    icon: <Atom className="w-5 h-5" />,
    color: "from-teal-500 to-cyan-500",
    description: "Scientific discoveries and research"
  },
  {
    id: "health",
    name: "🏥 Health",
    icon: <Heart className="w-5 h-5" />,
    color: "from-red-400 to-pink-500",
    description: "Health news and medical breakthroughs"
  },
  {
    id: "culture",
    name: "🎵 Culture",
    icon: <Music className="w-5 h-5" />,
    color: "from-violet-500 to-purple-500",
    description: "Arts, music, lifestyle, and culture"
  }
]

export default function TrendingPage() {
  const [selectedGenre, setSelectedGenre] = useState("hot")
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [country, setCountry] = useState("global")

  useEffect(() => {
    async function fetchTrendingTopics() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/trending?country=${country}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch trending topics")
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received")
        }

        setTrendingTopics(data)
      } catch (error) {
        console.error("Error fetching trending topics:", error)
        setError(error instanceof Error ? error.message : "Error fetching trending topics")
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingTopics()
  }, [country])

  const getGenreIcon = (source: string) => {
    if (source?.includes("Trends24")) {
      return <Hash className="w-4 h-4 text-blue-500" />
    }
    if (source?.includes("Reddit")) {
      return <TrendingUp className="w-4 h-4 text-orange-500" />
    }
    return <TrendingUp className="w-4 h-4 text-blue-600" />
  }

  const getGenreColor = (source: string) => {
    if (source?.includes("Trends24")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
    if (source?.includes("Reddit")) {
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  }

  const getSourceDisplay = (source: string) => {
    if (source?.includes("Trends24")) {
      return "🔥 Trending Keyword"
    }
    if (source?.includes("Reddit")) {
      return "📱 Reddit Post"
    }
    return source || "Trending"
  }

  const filterTopicsByGenre = (topics: TrendingTopic[], genre: string) => {
    if (genre === "hot") {
      // For hot topics, return top scoring items
      return topics
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10)
    }
    
    if (genre === "breaking") {
      // For breaking news, prioritize recent and high-engagement items
      return topics
        .filter(topic => topic.score && topic.score > 100)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 8)
    }
    
    // For other genres, filter by category keywords
    const genreKeywords = {
      technology: ["tech", "technology", "ai", "software", "computer", "digital", "innovation"],
      business: ["business", "economy", "finance", "market", "stock", "company", "investment"],
      entertainment: ["movie", "film", "entertainment", "music", "celebrity", "show", "tv"],
      sports: ["sport", "football", "basketball", "tennis", "olympics", "game", "team"],
      world: ["world", "international", "global", "country", "nation", "foreign"],
      science: ["science", "research", "study", "discovery", "space", "scientific"],
      health: ["health", "medical", "disease", "hospital", "doctor", "medicine"],
      culture: ["art", "culture", "music", "lifestyle", "fashion", "design"]
    }
    
    const keywords = genreKeywords[genre as keyof typeof genreKeywords] || []
    return topics
      .filter(topic => 
        keywords.some(keyword => 
          topic.title.toLowerCase().includes(keyword) || 
          topic.category.toLowerCase().includes(keyword)
        )
      )
      .slice(0, 8)
  }

  const filteredTopics = filterTopicsByGenre(trendingTopics, selectedGenre)
  const selectedGenreData = genreCategories.find(g => g.id === selectedGenre)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading trending topics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 max-w-md mx-auto">
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Error Loading Trending Topics
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Try Again
                </Button>
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Trending Topics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover what's trending across different categories and stay updated with the latest viral topics
          </p>
        </div>

        {/* Genre Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {genreCategories.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedGenre === genre.id
                    ? `bg-gradient-to-r ${genre.color} text-white shadow-lg transform scale-105`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {genre.icon}
                  <span>{genre.name.split(' ')[1]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Genre Info */}
        {selectedGenreData && (
          <motion.div
            key={selectedGenre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 max-w-2xl mx-auto">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${selectedGenreData.color} text-white`}>
                    {selectedGenreData.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{selectedGenreData.name}</CardTitle>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{selectedGenreData.description}</p>
              </CardHeader>
            </Card>
          </motion.div>
        )}

        {/* Trending Topics Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGenre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic, idx) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getGenreIcon(topic.source || "")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className={getGenreColor(topic.source || "")}>
                              {getSourceDisplay(topic.source || "")}
                            </Badge>
                            {topic.subreddit && (
                              <Badge variant="secondary" className="text-xs">
                                r/{topic.subreddit}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-3 leading-tight">
                            {topic.title}
                          </h3>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-3">
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
        </div>
        
                            {topic.url && (
                              <a
                                href={topic.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              >
                                View →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 max-w-md mx-auto">
                  <CardContent className="p-8">
                    <div className="text-gray-400 mb-4">
                      <TrendingUp className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      No trending topics found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try selecting a different genre or check back later for updates.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
  )
} 