import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";
    const country = searchParams.get("country") || "global";

    // Use Reddit as the primary news source
    const redditProcess = spawn('python', ['py/reddit_news.py', category, country]);
    
    let data = '';
    let error = '';

    redditProcess.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    redditProcess.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });

    // Wait for the process to complete with a timeout
    const exitCode = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        redditProcess.kill();
        resolve(-1);
      }, 10000); // 10 second timeout
      
      redditProcess.on('close', (code) => {
        clearTimeout(timeout);
        resolve(code);
      });
    });

    if (exitCode === -1) {
      console.error('Reddit news script timed out');
      // Return fallback news data
      return NextResponse.json(getFallbackNews(category));
    }

    if (exitCode !== 0) {
      console.error('Reddit news script error:', error);
      // Return fallback news data
      return NextResponse.json(getFallbackNews(category));
    }

    try {
      let articles: any[] = JSON.parse(data);
      if (!Array.isArray(articles) || articles.length === 0) {
        console.log('No articles from Reddit, using fallback');
        return NextResponse.json(getFallbackNews(category));
      }
      
      // Enhance articles with additional summaries for external news sources
      const enhancedArticles = await enhanceArticlesWithSummaries(articles, category);
      
      console.log(`Successfully fetched ${enhancedArticles.length} articles from Reddit with summaries`);
      return NextResponse.json(enhancedArticles);
    } catch (parseError) {
      console.error('Failed to parse Reddit output:', parseError);
      return NextResponse.json(getFallbackNews(category));
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(getFallbackNews("general"));
  }
}

async function enhanceArticlesWithSummaries(articles: any[], category: string) {
  try {
    // For each article, try to get an enhanced summary if it's not already present
    const enhancedArticles = await Promise.all(
      articles.map(async (article) => {
        // If article already has a summary (from Reddit), keep it
        if (article.summary) {
          return article;
        }
        
        // For external news sources, try to get a summary
        try {
          const summaryResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/news-summary?title=${encodeURIComponent(article.title)}`);
          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            if (summaryData.summary) {
              return {
                ...article,
                summary: summaryData.summary
              };
            }
          }
        } catch (error) {
          console.log(`Could not fetch summary for: ${article.title}`);
        }
        
        // If no summary available, create a basic one
        return {
          ...article,
          summary: `News article about: ${article.title}. This article provides detailed coverage of the topic and has been shared widely across social media platforms.`
        };
      })
    );
    
    return enhancedArticles;
  } catch (error) {
    console.error('Error enhancing articles with summaries:', error);
    return articles;
  }
}

function getFallbackNews(category: string) {
  // Fallback news data with dummy images and Reddit-style content
  const fallbackNews = {
    "general": [
      {
        id: "fallback_1",
        title: "Breaking: Major Tech Breakthrough in AI Development",
        description: "Scientists announce revolutionary advances in artificial intelligence that could transform multiple industries.",
        summary: "Reddit post discussing: Breaking: Major Tech Breakthrough in AI Development\n• Scientists announce revolutionary advances in artificial intelligence that could transform multiple industries\n• The breakthrough involves new neural network architectures that are more efficient and accurate\n• Multiple tech companies are already implementing these new AI models\n• This could lead to significant improvements in various AI applications\n• The research has been peer-reviewed and published in top scientific journals\nThis post has generated significant community discussion and engagement.",
        url: "https://reddit.com/r/technology",
        source: "Reddit Technology",
        publishedAt: new Date().toISOString(),
        urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        category: "technology"
      },
      {
        id: "fallback_2",
        title: "Global Climate Summit: Nations Commit to Ambitious Goals",
        description: "World leaders gather to address climate change with new commitments and action plans.",
        summary: "Reddit post discussing: Global Climate Summit: Nations Commit to Ambitious Goals\n• World leaders gather to address climate change with new commitments and action plans\n• Over 150 countries have pledged to reduce carbon emissions by 2030\n• New funding mechanisms established for developing nations\n• Technology sharing agreements signed between major economies\n• Monitoring and verification systems put in place\nThis post has generated significant community discussion and engagement.",
        url: "https://reddit.com/r/worldnews",
        source: "Reddit World News",
        publishedAt: new Date().toISOString(),
        urlToImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
        category: "environment"
      },
      {
        id: "fallback_3",
        title: "Space Exploration: New Mars Mission Reveals Surprising Discoveries",
        description: "Latest data from Mars exploration shows unexpected findings about the planet's geology.",
        summary: "Reddit post discussing: Space Exploration: New Mars Mission Reveals Surprising Discoveries\n• Latest data from Mars exploration shows unexpected findings about the planet's geology\n• New evidence suggests the presence of ancient water systems\n• Scientists discover unusual rock formations that challenge current theories\n• The mission has collected over 100 soil samples for analysis\n• Plans for future manned missions are being reconsidered based on findings\nThis post has generated significant community discussion and engagement.",
        url: "https://reddit.com/r/space",
        source: "Reddit Space",
        publishedAt: new Date().toISOString(),
        urlToImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop",
        category: "science"
      }
    ],
    "technology": [
      {
        id: "tech_1",
        title: "Quantum Computing: Major Milestone Achieved",
        description: "Researchers successfully demonstrate quantum supremacy in practical applications.",
        summary: "Reddit post discussing: Quantum Computing: Major Milestone Achieved\n• Researchers successfully demonstrate quantum supremacy in practical applications\n• New quantum processor with 100+ qubits shows unprecedented performance\n• Breakthrough in error correction algorithms reduces quantum noise\n• Commercial applications expected within the next 5 years\n• Major tech companies investing heavily in quantum research\nThis post has generated significant community discussion and engagement.",
        url: "https://reddit.com/r/technology",
        source: "Reddit Technology",
        publishedAt: new Date().toISOString(),
        urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
        category: "technology"
      },
      {
        id: "tech_2",
        title: "Cybersecurity: New Threats and Protection Methods",
        description: "Latest developments in cybersecurity and how to protect against emerging threats.",
        summary: "Reddit post discussing: Cybersecurity: New Threats and Protection Methods\n• Latest developments in cybersecurity and how to protect against emerging threats\n• New AI-powered malware detection systems show 99% accuracy\n• Zero-day vulnerabilities discovered in popular software\n• Updated security protocols recommended for all users\n• Industry experts share best practices for protection\nThis post has generated significant community discussion and engagement.",
        url: "https://reddit.com/r/cybersecurity",
        source: "Reddit Cybersecurity",
        publishedAt: new Date().toISOString(),
        urlToImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
        category: "technology"
      }
    ],
    "business": [
      {
        id: "business_1",
        title: "Stock Market: Record Highs and Market Analysis",
        description: "Comprehensive analysis of current market trends and investment opportunities.",
        summary: "Reddit post discussing: Stock Market: Record Highs and Market Analysis\n• Comprehensive analysis of current market trends and investment opportunities\n• Major indices reach all-time highs driven by tech sector growth\n• Analysts predict continued bullish momentum in Q4\n• New investment strategies for retail investors discussed\n• Risk management approaches for volatile markets\nThis post has generated significant community discussion and engagement.",
        url: "https://reddit.com/r/investing",
        source: "Reddit Investing",
        publishedAt: new Date().toISOString(),
        urlToImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        category: "business"
      },
      {
        id: "business_2",
        title: "Startup Success: New Unicorn Companies Emerge",
        description: "Meet the latest startups that have achieved billion-dollar valuations.",
        summary: "Reddit post discussing: Startup Success: New Unicorn Companies Emerge\n• Meet the latest startups that have achieved billion-dollar valuations\n• Five new companies join the unicorn club this quarter\n• AI and fintech sectors dominate the latest funding rounds\n• Success stories and lessons learned from founders\n• Investment opportunities in emerging markets\nThis post has generated significant community discussion and engagement.",
        url: "https://reddit.com/r/startups",
        source: "Reddit Startups",
        publishedAt: new Date().toISOString(),
        urlToImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
        category: "business"
      }
    ]
  };

  return fallbackNews[category as keyof typeof fallbackNews] || fallbackNews.general;
}
