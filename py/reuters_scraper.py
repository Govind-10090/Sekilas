import requests
import sys
import json
from datetime import datetime
from xml.etree import ElementTree as ET

def clean_text(text):
    if not text:
        return ""
    return " ".join(text.strip().split())

def fetch_reuters_headlines():
    url = "http://feeds.reuters.com/reuters/topNews"
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
            # Reuters sometimes has media:content
            media = item.find('{http://search.yahoo.com/mrss/}content')
            if media is not None and 'url' in media.attrib:
                image_url = media.attrib['url']
            if not image_url:
                image_url = "https://www.reuters.com/pf/resources/images/reuters/reuters-default.png?d=116"
            try:
                dt = datetime.strptime(pub_date, '%a, %d %b %Y %H:%M:%S %z')
                published_at = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
                age_hours = int((datetime.utcnow() - dt.replace(tzinfo=None)).total_seconds() // 3600)
            except Exception:
                published_at = ""
                age_hours = 0
            articles.append({
                "title": title,
                "description": description,
                "url": link,
                "image_url": image_url,
                "source": "Reuters",
                "publishedAt": published_at,
                "age_hours": age_hours,
                "category": "general"
            })
        return articles[:20]
    except Exception as e:
        print(f"Error fetching Reuters headlines: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    articles = fetch_reuters_headlines()
    print(json.dumps(articles)) 