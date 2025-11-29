import requests
from bs4 import BeautifulSoup
import sys
import json
from typing import List, Dict

def get_twitter_trends(country: str = "global") -> List[Dict]:
    """Get Twitter trends for a specific country"""
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
        response = requests.get(url)
        response.raise_for_status()

        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the trending keywords
        trending_topics = []
        items = soup.select('.trend-card__list li')[:5]  # Get top 5 trends
        
        if not items:
            print("No trending topics found", file=sys.stderr)
            return []

        # Format trends
        for i, item in enumerate(items, 1):
            keyword = item.text.strip()
            if keyword:
                trending_topics.append({
                    "id": f"trend24_{i}",
                    "title": keyword,
                    "category": f"Twitter Trends ({country.upper()})"
                })

        return trending_topics

    except requests.RequestException as e:
        print(f"Error fetching Twitter trends: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    try:
        # Get country from command line argument
        country = sys.argv[1] if len(sys.argv) > 1 else "global"
        trends = get_twitter_trends(country)
        print(json.dumps(trends))
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.", file=sys.stderr)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)