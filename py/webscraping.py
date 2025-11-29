import requests
import sys
import json
from typing import List, Dict
from datetime import datetime, timedelta
import hashlib
from urllib.parse import urlparse

def clean_text(text: str) -> str:
    """Clean and normalize text content"""
    if not text:
        return ""
    return " ".join(text.strip().split())

def is_quality_image_url(url: str) -> bool:
    """Check if the image URL is likely to be a quality news image"""
    if not url:
        return False
    parsed = urlparse(url)
    # Skip small images, icons, and logos
    skip_patterns = ['icon', 'logo', 'avatar', 'thumb', '50x50', '100x100']
    return not any(pattern in parsed.path.lower() for pattern in skip_patterns)

def get_article_hash(article: Dict) -> str:
    """Generate a unique hash for an article based on its content"""
    content = f"{article.get('title', '')}{article.get('description', '')}"
    return hashlib.md5(content.encode()).hexdigest()

def search_news(country: str = "us", category: str = "general", query: str = "") -> List[Dict]:
    """Fetch news articles from NewsAPI"""
    try:
        api_key = "30ab448986cc4748be31108b9964f0c9"
        base_url = "https://newsapi.org/v2/everything" if query else "https://newsapi.org/v2/top-headlines"
        
        # Prepare request parameters
        params = {
            "apiKey": api_key,
            "pageSize": 50,  # Increased from 20 to 50
            "language": "en",
        }

        if query:
            params.update({
                "q": query,
                "searchIn": "title,description",
                "sortBy": "relevancy"
            })
        else:
            params.update({
                "country": country.lower(),
                "category": category.lower() if category != "general" else None
            })

        # Make the API request
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()

        if data["status"] != "ok":
            print(f"API Error: {data.get('message', 'Unknown error')}", file=sys.stderr)
            return []

        # Process articles
        articles = []
        seen_titles = set()
        seen_sources = {}

        for article in data.get("articles", []):
            # Skip articles missing required fields
            if not all(article.get(field) for field in ["title", "description", "url", "urlToImage"]):
                continue

            # Skip duplicate titles
            title = clean_text(article["title"])
            if title in seen_titles:
                continue
            seen_titles.add(title)

            # Calculate article age
            try:
                pub_date = datetime.strptime(article["publishedAt"], "%Y-%m-%dT%H:%M:%SZ")
                age_hours = (datetime.utcnow() - pub_date).total_seconds() / 3600
                if age_hours > 168:  # Skip articles older than 1 week
                    continue
            except (ValueError, TypeError):
                continue

            # Track sources to ensure diversity
            source = article["source"].get("name", "Unknown Source")
            if source in seen_sources:
                seen_sources[source] += 1
                if seen_sources[source] > 4:  # Limit to 4 articles per source
                    continue
            else:
                seen_sources[source] = 1

            # Format the article
            articles.append({
                "title": title,
                "description": clean_text(article["description"]),
                "url": article["url"],
                "image_url": article["urlToImage"],
                "source": source,
                "publishedAt": article["publishedAt"],
                "age_hours": int(age_hours),
                "category": category
            })

        # Sort articles by age and return top 20
        articles.sort(key=lambda x: x["age_hours"])
        return articles[:20]  # Return top 20 articles

    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return []

def get_top_news(country: str = "global", category: str = "general") -> List[Dict]:
    """Get top headlines for a specific country and category"""
    return search_news("", country, category)

if __name__ == "__main__":
    try:
        # Get command line arguments
        country = sys.argv[1] if len(sys.argv) > 1 else "us"
        category = sys.argv[2] if len(sys.argv) > 2 else "general"
        query = sys.argv[3] if len(sys.argv) > 3 else ""
        
        # Fetch and output articles
        articles = search_news(country, category, query)
        print(json.dumps(articles))
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.", file=sys.stderr)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
