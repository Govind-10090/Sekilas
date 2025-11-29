"use client"

import NewsFeed from "./components/NewsFeed"
import TrendingNow from "./components/TrendingNow"
import Link from "next/link"
import Navbar from './components/Navbar'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { useState, useEffect } from 'react'
import { Switch } from '../components/ui/switch'
import { Slider } from '../components/ui/slider'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'
import { Gem, Globe, Star, TrendingUp, Mail, Newspaper, Clock, ArrowRight } from "lucide-react"
import { useForm } from 'react-hook-form'
import { Button } from '../components/ui/button'

export default function Home() {
  // For newsletter form
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm()
  const onSubmit = (data: any) => {
    alert('Thank you for subscribing!')
  }

  // State for featured article and news
  const [featured, setFeatured] = useState<any>(null)
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null)
  // State for trending/editor's picks
  const [trending, setTrending] = useState<any[]>([])
  const [editorsPicks, setEditorsPicks] = useState<any[]>([])
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [errorTrending, setErrorTrending] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState("global")

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoadingFeatured(true)
        setErrorFeatured(null)
        const res = await fetch('/api/news?category=general&country=' + selectedCountry)
        if (!res.ok) throw new Error('Failed to fetch featured article')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setFeatured(data[0])
        } else {
          setErrorFeatured('No featured article available')
        }
      } catch (e: any) {
        setErrorFeatured(e.message || 'Error fetching featured article')
      } finally {
        setLoadingFeatured(false)
      }
    }
    fetchFeatured()
  }, [selectedCountry])

  useEffect(() => {
    async function fetchTrending() {
      try {
        setLoadingTrending(true)
        setErrorTrending(null)
        const res = await fetch('/api/trending?country=' + selectedCountry)
        if (!res.ok) throw new Error('Failed to fetch trending topics')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          // Separate Trends24 keywords and Reddit posts
          const trends24Keywords = data.filter(item => item.source?.includes("Trends24")).slice(0, 5)
          const redditPosts = data.filter(item => item.source?.includes("Reddit")).slice(0, 3)
          
          setTrending(trends24Keywords) // Show Trends24 keywords in trending section
          setEditorsPicks(redditPosts) // Show Reddit posts in editor's picks
        } else {
          setErrorTrending('No trending topics available')
        }
      } catch (e: any) {
        setErrorTrending(e.message || 'Error fetching trending topics')
      } finally {
        setLoadingTrending(false)
      }
    }
    fetchTrending()
  }, [selectedCountry])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Country Selector */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-48">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">🌍 Global</SelectItem>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="india">🇮🇳 India</SelectItem>
                <SelectItem value="canada">🇨🇦 Canada</SelectItem>
                <SelectItem value="australia">🇦🇺 Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hero Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {loadingFeatured ? (
                <div className="rounded-2xl w-full h-80 bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse" />
              ) : errorFeatured || !featured ? (
                <div className="text-center p-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-2 border-dashed border-blue-300">
                  <Newspaper className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <p className="text-blue-600 text-lg">{errorFeatured || 'No featured article available.'}</p>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={featured.urlToImage || featured.image_url} 
                    alt={featured.title} 
                    className="rounded-2xl w-full h-80 object-cover shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div>
              {loadingFeatured ? (
                <div className="space-y-4">
                  <div className="h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded w-2/3 animate-pulse" />
                  <div className="h-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded w-full animate-pulse" />
                </div>
              ) : errorFeatured || !featured ? null : (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {featured.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center text-blue-600 font-semibold">
                      <Newspaper className="w-5 h-5 mr-2" />
                      {featured.source}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(featured.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {featured.description}
                  </p>
                  <div className="flex space-x-4">
                    <Link href={`/news/${encodeURIComponent(featured.title)}`}>
                      <button className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        Read Summary
                      </button>
                    </Link>
                    <a 
                      href={featured.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      Read Full Article
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Main Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* News Feed (3 columns) */}
          <div className="lg:col-span-3">
            <NewsFeed category="general" country={selectedCountry} />
          </div>
          
          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Trending Now Section */}
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-white" />
                  <CardTitle className="text-lg font-bold">Trending Now</CardTitle>
                </div>
                <Link href="/trending">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-6">
                {loadingTrending ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_,i) => <div key={i} className="h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded w-4/5 animate-pulse" />)}
                  </div>
                ) : errorTrending ? (
                  <div className="text-red-500">{errorTrending}</div>
                ) : (
                  <div className="space-y-3">
                    {trending.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <a 
                            href={item.url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-lg flex-1"
                          >
                            {item.title}
                          </a>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              🔥
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">Trending Keyword</span>
                          <span className="text-xs text-blue-600 font-medium">#{i + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/trending">
                    <Button variant="outline" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600">
                      View All Trending Topics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 rounded-xl">
              <CardHeader className="flex flex-row items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-xl">
                <Star className="text-white" />
                <CardTitle className="text-lg font-bold">Editor's Picks</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loadingTrending ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_,i) => <div key={i} className="h-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded w-4/6 animate-pulse" />)}
                  </div>
                ) : errorTrending ? (
                  <div className="text-red-500">{errorTrending}</div>
                ) : (
                  <div className="space-y-3">
                    {editorsPicks.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <a 
                            href={item.url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium flex-1 line-clamp-2"
                          >
                            {item.title}
                          </a>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                              📱
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">Reddit Post</span>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>⬆️ {item.score?.toLocaleString() || 0}</span>
                            <span>💬 {item.comments?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-xl border-0 rounded-xl">
              <CardHeader className="flex flex-row items-center gap-2">
                <Mail className="text-white" />
                <CardTitle className="text-lg font-bold">Newsletter</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitSuccessful ? (
                  <div className="text-white font-semibold py-4 text-center">Thank you for subscribing! 🎉</div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full border-0 border-b-2 border-white/30 focus:border-white bg-white/20 py-3 px-4 text-lg placeholder-white/70 transition-all rounded-lg text-white backdrop-blur-sm"
                      {...register('email', { required: true, pattern: /.+@.+\..+/ })}
                    />
                    {errors.email && <div className="text-yellow-200 text-sm">Please enter a valid email.</div>}
                    <button 
                      type="submit" 
                      className="w-full py-3 rounded-xl bg-white text-green-600 font-semibold text-lg shadow-lg hover:shadow-xl transition-all mt-2 hover:bg-gray-100"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}
