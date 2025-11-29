import praw
import sys
import json
from typing import List, Dict
import requests
from bs4 import BeautifulSoup

def get_trends24_keywords(country: str = "global") -> List[Dict]:
    """Get trending keywords from Trends24 website"""
    try:
        # Map country codes to Trends24 URLs
        country_urls = {
            "global": "https://trends24.in/",
            "us": "https://trends24.in/united-states/",
            "uk": "https://trends24.in/united-kingdom/",
            "india": "https://trends24.in/india/",
            "canada": "https://trends24.in/canada/",
            "australia": "https://trends24.in/australia/"
        }

        # Get URL for specified country, default to global
        url = country_urls.get(country.lower(), country_urls["global"])

        # Send a GET request to the website
        response = requests.get(url, timeout=15)
        response.raise_for_status()

        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the trending keywords
        trending_keywords = []
        
        # Look for trending topics in different possible selectors
        selectors = [
            '.trend-card__list li',
            '.trend-card__list a',
            '.trending-keywords li',
            '.trends-list li',
            '[class*="trend"] li',
            '[class*="keyword"] li'
        ]
        
        items = []
        for selector in selectors:
            items = soup.select(selector)
            if items:
                break
        
        if not items:
            # Fallback: look for any text that might be trending
            items = soup.find_all(['a', 'span', 'div'], class_=lambda x: x and any(word in x.lower() for word in ['trend', 'keyword', 'topic']))
        
        # Extract and format trends
        for i, item in enumerate(items[:10], 1):  # Get top 10 trends
            keyword = item.get_text().strip()
            if keyword and len(keyword) > 2 and len(keyword) < 100:
                # Clean the keyword - remove extra spaces and newlines
                keyword = keyword.replace('\n', ' ').replace('\t', ' ').strip()
                keyword = ' '.join(keyword.split())  # Remove multiple spaces
                
                # Filter for English keywords only (basic check)
                def is_english_keyword(text):
                    # Check if text contains mostly English characters
                    english_chars = sum(1 for c in text if c.isascii() and c.isalnum())
                    total_chars = sum(1 for c in text if c.isalnum())
                    if total_chars == 0:
                        return False
                    return (english_chars / total_chars) > 0.7  # 70% should be English
                
                # Filter out non-English or very long keywords that might be garbled
                if (keyword and 
                    len(keyword) < 50 and 
                    not keyword.startswith('#') and
                    is_english_keyword(keyword)):
                    
                    # Add hashtag if not present
                    if not keyword.startswith('#'):
                        keyword = f"#{keyword}"
                    
                    trending_keywords.append({
                        "id": f"trend24_{i}",
                        "title": keyword,
                        "category": f"Trends24 ({country.upper()})",
                        "score": 100 - i,  # Higher score for top trends
                        "comments": 0,
                        "subreddit": "trends24",
                        "url": f"https://trends24.in/search?q={keyword.replace('#', '')}",
                        "source": "Trends24 Keywords"
                    })

        if not trending_keywords:
            print("No trending keywords found on Trends24", file=sys.stderr)
            return []

        return trending_keywords

    except requests.RequestException as e:
        print(f"Error fetching Trends24 data: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Unexpected error fetching Trends24: {e}", file=sys.stderr)
        return []

def get_reddit_trends(country: str = "global") -> List[Dict]:
    """Get Reddit trends for a specific country (posts only, no keyword extraction)"""
    try:
        # Map country codes to relevant subreddits for trending topics
        country_subreddits = {
            "global": ["all", "popular", "trending", "news", "worldnews"],
            "us": ["news", "politics", "technology", "science", "entertainment"],
            "uk": ["unitedkingdom", "ukpolitics", "casualuk", "britishproblems"],
            "india": ["india", "indiaspeaks", "indianews", "indiatechnology"],
            "canada": ["canada", "canadapolitics", "canadiannews"],
            "australia": ["australia", "australianpolitics", "straya"]
        }

        # Get subreddits for specified country, default to global
        subreddits = country_subreddits.get(country.lower(), country_subreddits["global"])

        # Set up Reddit API client
        reddit = praw.Reddit(
            client_id='ZrROPP178ePREDk5NTcEDA',
            client_secret='AyP2_67pn5AMmDk6ZzOZwA7DFQhUQA',
            user_agent='trending_app_v2'
        )
        
        trending_topics = []
        
        # Fetch posts from multiple subreddits
        for subreddit_name in subreddits[:3]:  # Limit to top 3 subreddits to avoid rate limiting
            try:
                subreddit = reddit.subreddit(subreddit_name)
                
                # Get hot posts and rising posts for better trending detection
                hot_posts = list(subreddit.hot(limit=8))
                rising_posts = list(subreddit.rising(limit=4))
                
                # Combine and prioritize rising posts
                all_posts = rising_posts + hot_posts
                
                for post in all_posts:
                    if post.title and post.score > 15:  # Only posts with good engagement
                        trending_topics.append({
                            "id": f"reddit_{post.id}",
                            "title": post.title,
                            "category": f"Reddit ({subreddit_name})",
                            "score": post.score,
                            "comments": post.num_comments,
                            "subreddit": subreddit_name,
                            "url": f"https://reddit.com{post.permalink}",
                            "source": "Reddit"
                        })
                        
                        # Limit total topics to avoid overwhelming the UI
                        if len(trending_topics) >= 12:
                            break
                            
            except Exception as e:
                print(f"Error fetching from subreddit {subreddit_name}: {e}", file=sys.stderr)
                continue
        
        # Sort by score and remove duplicates
        seen_titles = set()
        unique_topics = []
        for topic in trending_topics:
            if topic["title"] not in seen_titles:
                seen_titles.add(topic["title"])
                unique_topics.append(topic)
        
        # Sort by score (higher first) and limit to top 8
        unique_topics.sort(key=lambda x: x.get("score", 0), reverse=True)
        unique_topics = unique_topics[:8]
        
        if not unique_topics:
            print("No Reddit trending topics found", file=sys.stderr)
            
        return unique_topics
        
    except Exception as e:
        print(f"Error fetching Reddit trends: {e}", file=sys.stderr)
        print("Please ensure you have valid Reddit API credentials.", file=sys.stderr)
        return []

def get_combined_trends(country: str = "global") -> List[Dict]:
    """Get combined trending data from both Trends24 and Reddit"""
    try:
        # Get trends from both sources
        trends24_data = get_trends24_keywords(country)
        reddit_data = get_reddit_trends(country)
        
        # Combine the data
        combined_trends = []
        
        # Add Trends24 keywords first (they're more relevant for trending)
        combined_trends.extend(trends24_data)
        
        # Add Reddit posts
        combined_trends.extend(reddit_data)
        
        # Sort by score and limit total
        combined_trends.sort(key=lambda x: x.get("score", 0), reverse=True)
        combined_trends = combined_trends[:15]  # Total limit
        
        if not combined_trends:
            print("No trending topics found from any source", file=sys.stderr)
            
        return combined_trends
        
    except Exception as e:
        print(f"Error combining trends: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    try:
        # Get country from command line argument
        country = sys.argv[1] if len(sys.argv) > 1 else "global"
        trends = get_combined_trends(country)
        print(json.dumps(trends))
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.", file=sys.stderr)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
