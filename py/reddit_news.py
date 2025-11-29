import praw
import sys
import json
from typing import List, Dict
from datetime import datetime, timedelta
import re

def generate_summary(title: str, content: str, max_lines: int = 8) -> str:
    """Generate a concise summary of the news content in 7-8 lines"""
    if not content or content == "Read more on Reddit":
        # If no content, create a summary from the title
        return f"Reddit post about: {title}. This post has generated significant discussion and engagement within the community."
    
    # Clean the content
    content = re.sub(r'\s+', ' ', content.strip())
    
    # Split into sentences
    sentences = re.split(r'[.!?]+', content)
    sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 10]
    
    if not sentences:
        return f"Reddit post about: {title}. This post has generated significant discussion and engagement within the community."
    
    # Create a structured summary
    summary_parts = []
    
    # Start with context about the post
    summary_parts.append(f"Reddit post discussing: {title}")
    
    # Add key points from content (limit to max_lines - 2 to leave room for context and conclusion)
    content_lines = 0
    for sentence in sentences:
        if content_lines >= max_lines - 2:
            break
        if len(sentence) > 20:  # Only meaningful sentences
            summary_parts.append(f"• {sentence}")
            content_lines += 1
    
    # Add engagement context
    summary_parts.append("This post has generated significant community discussion and engagement.")
    
    # Ensure we don't exceed max_lines
    if len(summary_parts) > max_lines:
        summary_parts = summary_parts[:max_lines]
    
    return "\n".join(summary_parts)

def get_reddit_news(category: str = "general", country: str = "global") -> List[Dict]:
    """Get news articles from Reddit based on category and country"""
    try:
        # Map categories to relevant subreddits
        category_subreddits = {
            "general": ["news", "worldnews", "politics"],
            "technology": ["technology", "science", "programming", "artificial"],
            "business": ["business", "investing", "economics", "startups"],
            "sports": ["sports", "nba", "soccer", "nfl"],
            "entertainment": ["entertainment", "movies", "television", "music"],
            "health": ["health", "medicine", "fitness", "nutrition"],
            "science": ["science", "space", "physics", "biology"]
        }
        
        # Map countries to relevant subreddits
        country_subreddits = {
            "us": ["news", "politics", "usnews"],
            "uk": ["unitedkingdom", "ukpolitics"],
            "india": ["india", "indianews"],
            "canada": ["canada", "canadapolitics"],
            "australia": ["australia", "australianpolitics"]
        }

        # Get subreddits for category and country
        category_subs = category_subreddits.get(category.lower(), category_subreddits["general"])
        country_subs = country_subreddits.get(country.lower(), [])
        
        # Combine and prioritize
        all_subreddits = country_subs + category_subs
        if not all_subreddits:
            all_subreddits = category_subreddits["general"]

        # Set up Reddit API client
        reddit = praw.Reddit(
            client_id='ZrROPP178ePREDk5NTcEDA',
            client_secret='AyP2_67pn5AMmDk6ZzOZwA7DFQhUQA',
            user_agent='news_app_v2'
        )
        
        news_articles = []
        
        # Fetch posts from relevant subreddits
        for subreddit_name in all_subreddits[:3]:  # Limit to top 3 subreddits
            try:
                subreddit = reddit.subreddit(subreddit_name)
                
                # Get hot and rising posts
                hot_posts = list(subreddit.hot(limit=15))
                rising_posts = list(subreddit.rising(limit=10))
                
                # Combine and prioritize rising posts
                all_posts = rising_posts + hot_posts
                
                for post in all_posts:
                    if post.title and post.score > 5:  # Only posts with decent engagement
                        # Skip posts that are too short or too long
                        if len(post.title) < 10 or len(post.title) > 200:
                            continue
                            
                        # Generate summary for the post
                        summary = generate_summary(post.title, post.selftext)
                        
                        # Create news article object
                        article = {
                            "id": f"reddit_{post.id}",
                            "title": post.title,
                            "description": post.selftext[:200] + "..." if post.selftext and len(post.selftext) > 200 else (post.selftext or "Read more on Reddit"),
                            "summary": summary,
                            "url": f"https://reddit.com{post.permalink}",
                            "source": f"Reddit r/{subreddit_name}",
                            "publishedAt": datetime.fromtimestamp(post.created_utc).isoformat(),
                            "urlToImage": get_placeholder_image(category),
                            "category": category,
                            "score": post.score,
                            "comments": post.num_comments,
                            "subreddit": subreddit_name,
                            "author": str(post.author) if post.author else "Anonymous"
                        }
                        
                        news_articles.append(article)
                        
                        # Limit total articles
                        if len(news_articles) >= 20:
                            break
                            
            except Exception as e:
                print(f"Error fetching from subreddit {subreddit_name}: {e}", file=sys.stderr)
                continue
        
        # Sort by score and remove duplicates
        seen_titles = set()
        unique_articles = []
        for article in news_articles:
            if article["title"] not in seen_titles:
                seen_titles.add(article["title"])
                unique_articles.append(article)
        
        # Sort by score (higher first) and limit to top 15
        unique_articles.sort(key=lambda x: x.get("score", 0), reverse=True)
        unique_articles = unique_articles[:15]
        
        if not unique_articles:
            print("No news articles found", file=sys.stderr)
            
        return unique_articles
        
    except Exception as e:
        print(f"Error fetching Reddit news: {e}", file=sys.stderr)
        return []

def get_placeholder_image(category: str) -> str:
    """Get placeholder images based on category"""
    category_images = {
        "technology": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        "business": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        "sports": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "entertainment": "https://images.unsplash.com/photo-1489599830792-d4f6d2c8b3b8?w=400&h=300&fit=crop",
        "health": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        "science": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop",
        "general": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop"
    }
    
    return category_images.get(category.lower(), category_images["general"])

if __name__ == "__main__":
    try:
        # Get category and country from command line arguments
        category = sys.argv[1] if len(sys.argv) > 1 else "general"
        country = sys.argv[2] if len(sys.argv) > 2 else "global"
        
        articles = get_reddit_news(category, country)
        print(json.dumps(articles))
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.", file=sys.stderr)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
