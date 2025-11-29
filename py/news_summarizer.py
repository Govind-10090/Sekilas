import requests
import sys
import json
from typing import Dict, Optional
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse, quote_plus
import time

def search_google_news_section(query: str) -> Optional[str]:
    """Search Google and go to News section to get the first news article URL"""
    try:
        # Google search with news filter
        search_url = f"https://www.google.com/search?q={quote_plus(query)}&tbm=nws"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        response = requests.get(search_url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Look for news article links in Google News results
        # Google News results typically have specific patterns
        article_links = []
        
        # Method 1: Look for links with news-specific patterns
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            if href and href.startswith('/url?q='):
                # Extract the actual URL from Google's redirect
                actual_url = href.split('/url?q=')[1].split('&')[0]
                if actual_url and not actual_url.startswith('google'):
                    article_links.append(actual_url)
        
        # Method 2: Look for links in news result containers
        news_containers = soup.find_all(['div', 'article'], class_=re.compile(r'news|article|result'))
        for container in news_containers:
            links = container.find_all('a', href=True)
            for link in links:
                href = link.get('href')
                if href and not href.startswith('google') and 'news' in href.lower():
                    article_links.append(href)
        
        # Method 3: Look for any external links that might be news
        for link in soup.find_all('a', href=True):
            href = link.get('href')
            if href and href.startswith('http') and not href.startswith('google'):
                # Check if it looks like a news site
                if any(keyword in href.lower() for keyword in ['news', 'article', 'story', 'post', 'blog']):
                    article_links.append(href)
        
        # Remove duplicates and return the first valid news URL
        unique_links = list(dict.fromkeys(article_links))
        
        if unique_links:
            print(f"Found {len(unique_links)} potential news links", file=sys.stderr)
            return unique_links[0]
        
        return None
        
    except Exception as e:
        print(f"Error searching Google News section: {e}", file=sys.stderr)
        return None

def extract_article_content(url: str) -> Optional[str]:
    """Extract article content from a news website"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        response = requests.get(url, headers=headers, timeout=20)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script, style, and navigation elements
        for element in soup(["script", "style", "nav", "header", "footer", "aside", "menu", "sidebar"]):
            element.decompose()
        
        # Try to find article content using common selectors
        content_selectors = [
            'article',
            '[class*="article"]',
            '[class*="content"]',
            '[class*="story"]',
            '[class*="post"]',
            '[class*="news"]',
            '.entry-content',
            '.post-content',
            '.article-content',
            '.story-content',
            '.news-content',
            'main',
            '.main-content',
            '.content-area'
        ]
        
        content = None
        for selector in content_selectors:
            content = soup.select_one(selector)
            if content:
                break
        
        if not content:
            # Fallback: look for divs with content-like classes
            content_divs = soup.find_all('div', class_=re.compile(r'content|text|body|main'))
            if content_divs:
                content = content_divs[0]
        
        if not content:
            # Last resort: get all paragraphs from body
            content = soup.find('body')
        
        if content:
            # Extract text from paragraphs, headings, and other text elements
            text_elements = content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'])
            text_content = []
            
            for element in text_elements:
                text = element.get_text(strip=True)
                if text and len(text) > 30:  # Only include meaningful text blocks
                    # Clean the text
                    text = re.sub(r'\s+', ' ', text).strip()
                    if text not in text_content:  # Avoid duplicates
                        text_content.append(text)
            
            return ' '.join(text_content)
        
        return None
        
    except Exception as e:
        print(f"Error extracting content from {url}: {e}", file=sys.stderr)
        return None

def generate_summary(text: str, max_length: int = 600) -> str:
    """Generate a summary of the text content"""
    if not text:
        return "No content available to summarize."
    
    # Clean the text
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Simple summarization: take the first few sentences
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 10]
    
    summary = ""
    current_length = 0
    
    for sentence in sentences:
        if current_length + len(sentence) <= max_length:
            summary += sentence + ". "
            current_length += len(sentence)
        else:
            break
    
    if not summary:
        # If no sentences fit, take the first part of the text
        summary = text[:max_length] + "..."
    
    return summary.strip()

def get_reading_time(text: str) -> str:
    """Calculate estimated reading time"""
    words = len(text.split())
    minutes = max(1, words // 200)  # Average reading speed: 200 words per minute
    return f"{minutes} min read"

def get_news_summary(query: str) -> Dict:
    """Main function to get news summary from Google News section"""
    try:
        print(f"Searching Google News section for: {query}", file=sys.stderr)
        
        # Search Google News section
        news_url = search_google_news_section(query)
        
        if not news_url:
            return {
                "title": query,
                "summary": f"Unable to find recent news articles about '{query}' in Google News section. Please try a different search term or check back later.",
                "source": "Google News Section",
                "url": f"https://www.google.com/search?q={quote_plus(query)}&tbm=nws",
                "publishedAt": None,
                "category": "general",
                "readingTime": "1 min read"
            }
        
        print(f"Found news article: {news_url}", file=sys.stderr)
        
        # Extract content
        content = extract_article_content(news_url)
        
        if not content:
            return {
                "title": query,
                "summary": f"Found a news article about '{query}' but was unable to extract the content. You can read the full article at the source.",
                "source": "Google News Section",
                "url": news_url,
                "publishedAt": None,
                "category": "general",
                "readingTime": "1 min read"
            }
        
        # Generate summary
        summary = generate_summary(content)
        reading_time = get_reading_time(summary)
        
        # Determine category based on query keywords
        category = "general"
        query_lower = query.lower()
        if any(word in query_lower for word in ["tech", "technology", "ai", "software", "computer", "digital"]):
            category = "technology"
        elif any(word in query_lower for word in ["business", "economy", "finance", "market", "stock", "company"]):
            category = "business"
        elif any(word in query_lower for word in ["sport", "football", "basketball", "tennis", "olympics", "game"]):
            category = "sports"
        elif any(word in query_lower for word in ["movie", "film", "entertainment", "music", "celebrity", "show"]):
            category = "entertainment"
        elif any(word in query_lower for word in ["health", "medical", "disease", "hospital", "doctor", "medicine"]):
            category = "health"
        elif any(word in query_lower for word in ["science", "research", "study", "discovery", "space", "research"]):
            category = "science"
        elif any(word in query_lower for word in ["politics", "government", "election", "president", "congress"]):
            category = "politics"
        
        return {
            "title": query,
            "summary": summary,
            "source": "Google News Section",
            "url": news_url,
            "publishedAt": None,  # We don't have the exact publish date from Google search
            "category": category,
            "readingTime": reading_time,
            "fullContent": content[:1200] + "..." if len(content) > 1200 else content
        }
        
    except Exception as e:
        print(f"Error in get_news_summary: {e}", file=sys.stderr)
        return {
            "title": query,
            "summary": f"An error occurred while trying to summarize news about '{query}'. Please try again later.",
            "source": "News Summary Service",
            "url": f"https://www.google.com/search?q={quote_plus(query)}&tbm=nws",
            "publishedAt": None,
            "category": "general",
            "readingTime": "1 min read"
        }

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print("Usage: python news_summarizer.py <search_query>", file=sys.stderr)
            sys.exit(1)
        
        query = sys.argv[1]
        summary = get_news_summary(query)
        print(json.dumps(summary))
        
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)
