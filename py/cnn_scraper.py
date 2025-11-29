import requests
import sys
import json
from datetime import datetime
from xml.etree import ElementTree as ET

def clean_text(text):
    if not text:
        return ""
    return " ".join(text.strip().split())

def fetch_cnn_headlines():
    url = "http://rss.cnn.com/rss/edition.rss"
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
            media = item.find('{http://search.yahoo.com/mrss/}content')
            if media is not None and 'url' in media.attrib:
                image_url = media.attrib['url']
            if not image_url:
                image_url = "https://cdn.cnn.com/cnn/.e1mo/img/4.0/logos/cnn_logo_social.jpg"
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
                "source": "CNN",
                "publishedAt": published_at,
                "age_hours": age_hours,
                "category": "general"
            })
        return articles[:20]
    except Exception as e:
        print(f"Error fetching CNN headlines: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    articles = fetch_cnn_headlines()
    print(json.dumps(articles)) 