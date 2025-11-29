import requests
import sys
import json
from datetime import datetime
from xml.etree import ElementTree as ET

def clean_text(text):
    if not text:
        return ""
    return " ".join(text.strip().split())

def fetch_guardian_headlines():
    url = "https://www.theguardian.com/world/rss"
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        root = ET.fromstring(resp.content)
        articles = []
        for item in root.findall('.//item'):
            title = clean_text(item.findtext('title'))
            description = clean_text(item.findtext('description'))
            link = item.findtext('link')
            pub_date = item.findtext('pubDate')
            image_url = None
            # The Guardian sometimes has media:content
            media = item.find('{http://search.yahoo.com/mrss/}content')
            if media is not None and 'url' in media.attrib:
                image_url = media.attrib['url']
            if not image_url:
                image_url = "https://assets.guim.co.uk/images/favicons/4c7e3b6b6b1b1b1b1b1b1b1b1b1b1b1b/152x152.png"
            try:
                dt = datetime.strptime(pub_date, '%a, %d %b %Y %H:%M:%S %Z')
                published_at = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
                age_hours = int((datetime.utcnow() - dt).total_seconds() // 3600)
            except Exception:
                published_at = ""
                age_hours = 0
            articles.append({
                "title": title,
                "description": description,
                "url": link,
                "image_url": image_url,
                "source": "The Guardian",
                "publishedAt": published_at,
                "age_hours": age_hours,
                "category": "general"
            })
        return articles[:20]
    except Exception as e:
        print(f"Error fetching Guardian headlines: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    articles = fetch_guardian_headlines()
    print(json.dumps(articles)) 