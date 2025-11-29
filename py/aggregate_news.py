import subprocess
import json
import sys
from datetime import datetime
from typing import List, Dict

def run_scraper(script: str) -> List[Dict]:
    try:
        # Reduce timeout from 20 to 10 seconds for faster execution
        result = subprocess.run([sys.executable, script], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            try:
                articles = json.loads(result.stdout)
                # Limit articles per source to 10 for faster processing
                return articles[:10] if isinstance(articles, list) else []
            except json.JSONDecodeError:
                print(f"Failed to parse JSON from {script}", file=sys.stderr)
                return []
        else:
            print(f"Error running {script}: {result.stderr}", file=sys.stderr)
            return []
    except subprocess.TimeoutExpired:
        print(f"Timeout running {script}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Exception running {script}: {e}", file=sys.stderr)
        return []

def deduplicate(articles: List[Dict]) -> List[Dict]:
    seen = set()
    deduped = []
    for art in articles:
        if not art or not isinstance(art, dict):
            continue
        key = (art.get('title','').strip().lower(), art.get('source','').strip().lower())
        if key and key not in seen:
            seen.add(key)
            deduped.append(art)
    return deduped

def aggregate_all():
    # Prioritize faster, more reliable sources first
    scripts = [
        'bbc_scraper.py',      # RSS feed - usually fast
        'reuters_scraper.py',  # RSS feed - usually fast
        'guardian_scraper.py', # RSS feed - usually fast
        'cnn_scraper.py',      # RSS feed - usually fast
        'aljazeera_scraper.py', # RSS feed - usually fast
        'googlenews_scraper.py', # Google News - can be slow
        'webscraping.py',      # Custom scraper - can be slow
    ]
    
    all_articles = []
    for script in scripts:
        try:
            articles = run_scraper(script)
            if articles:
                all_articles.extend(articles)
                print(f"✓ {script}: {len(articles)} articles", file=sys.stderr)
            else:
                print(f"✗ {script}: no articles", file=sys.stderr)
        except Exception as e:
            print(f"✗ {script}: error - {e}", file=sys.stderr)
            continue
    
    print(f"Total articles collected: {len(all_articles)}", file=sys.stderr)
    
    deduped = deduplicate(all_articles)
    print(f"After deduplication: {len(deduped)}", file=sys.stderr)
    
    # Sort by recency (age_hours ascending) and limit to top 30 for faster response
    deduped.sort(key=lambda x: x.get('age_hours', 9999))
    return deduped[:30]

if __name__ == "__main__":
    articles = aggregate_all()
    print(json.dumps(articles)) 