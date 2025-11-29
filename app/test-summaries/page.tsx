"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { FileText, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "AI Breakthrough: New Language Model Achieves Human-Level Understanding",
    description: "Researchers have developed a revolutionary AI model that demonstrates unprecedented language comprehension capabilities.",
    summary: "AI Breakthrough: New Language Model Achieves Human-Level Understanding\n• Researchers have developed a revolutionary AI model that demonstrates unprecedented language comprehension capabilities\n• The model shows 95% accuracy in complex reasoning tasks previously thought impossible for AI\n• Key improvements include better context understanding and reduced bias in responses\n• Industry experts predict this will transform how we interact with technology\n• Ethical considerations and safety measures are being implemented\n• Commercial applications expected within the next 2 years\nThis breakthrough represents a significant milestone in artificial intelligence development.",
    url: "https://example.com/ai-breakthrough",
    source: "Tech News Daily",
    publishedAt: new Date().toISOString(),
    category: "technology"
  },
  {
    id: "2",
    title: "Global Climate Summit: Nations Commit to Ambitious 2030 Goals",
    description: "World leaders gather to address climate change with new commitments and action plans.",
    summary: "Global Climate Summit: Nations Commit to Ambitious 2030 Goals\n• World leaders gather to address climate change with new commitments and action plans\n• Over 150 countries have pledged to reduce carbon emissions by 50% by 2030\n• New funding mechanisms established for developing nations to transition to clean energy\n• Technology sharing agreements signed between major economies\n• Monitoring and verification systems put in place to ensure compliance\n• Public-private partnerships announced for renewable energy projects\nThis comprehensive agreement represents a turning point in global climate action.",
    url: "https://example.com/climate-summit",
    source: "World News",
    publishedAt: new Date().toISOString(),
    category: "environment"
  },
  {
    id: "3",
    title: "Space Exploration: Mars Mission Reveals Evidence of Ancient Water",
    description: "Latest data from Mars exploration shows unexpected findings about the planet's geology.",
    summary: "Space Exploration: Mars Mission Reveals Evidence of Ancient Water\n• Latest data from Mars exploration shows unexpected findings about the planet's geology\n• New evidence suggests the presence of ancient water systems dating back 3 billion years\n• Scientists discover unusual rock formations that challenge current theories about Mars\n• The mission has collected over 100 soil samples for detailed analysis\n• Plans for future manned missions are being reconsidered based on these findings\n• International collaboration announced for next phase of exploration\nThis discovery opens new possibilities for understanding Mars' potential for past or present life.",
    url: "https://example.com/mars-discovery",
    source: "Space Science Journal",
    publishedAt: new Date().toISOString(),
    category: "science"
  }
];

export default function TestSummariesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set());

  const filteredNews = selectedCategory === "all" 
    ? sampleNews 
    : sampleNews.filter(news => news.category === selectedCategory);

  const toggleSummary = (newsId: string) => {
    const newExpanded = new Set(expandedSummaries);
    if (newExpanded.has(newsId)) {
      newExpanded.delete(newsId);
    } else {
      newExpanded.add(newsId);
    }
    setExpandedSummaries(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            News Summarization Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Click "Read Summary" buttons to see AI-generated 7-8 line summaries. News titles link to full articles.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setSelectedCategory("technology")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "technology"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Technology
          </button>
          <button
            onClick={() => setSelectedCategory("environment")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "environment"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Environment
          </button>
          <button
            onClick={() => setSelectedCategory("science")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "science"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Science
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => {
            const isSummaryExpanded = expandedSummaries.has(news.id);
            
            return (
              <Card key={news.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0">
                      {news.category}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {news.source}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    <Link href={`/news/${encodeURIComponent(news.title)}`}>
                      <span className="text-left hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200 cursor-pointer">
                        {news.title}
                      </span>
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Summary Section - Only shown when Read Summary is clicked */}
                  {isSummaryExpanded && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" />
                          <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                            AI-Generated Summary (7-8 lines)
                          </span>
                        </div>
                        <button
                          onClick={() => toggleSummary(news.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                        >
                          Hide
                        </button>
                      </div>
                      <div className="text-sm text-blue-900 dark:text-blue-200 whitespace-pre-line leading-relaxed">
                        {news.summary}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {news.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Just now
                    </span>
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Read More
                    </a>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => toggleSummary(news.id)}
                      className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
                        isSummaryExpanded
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      }`}
                    >
                      {isSummaryExpanded ? 'Hide Summary' : 'Read Summary'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Key Features of Our Summarization System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Click to Reveal
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Summaries are hidden by default and appear when users click "Read Summary" buttons.
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Multiple Sources
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Summarizes news from Reddit, external news sources, and various content types.
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Summaries are generated in real-time as new content becomes available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
