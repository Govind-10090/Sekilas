import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const title = searchParams.get("title");

    if (!query && !title) {
      return NextResponse.json({ error: "Query or title parameter is required" }, { status: 400 });
    }

    const searchQuery = query || title;
    
    // Use Python script to search Google News and summarize
    const pythonProcess = spawn('python', ['py/news_summarizer.py', searchQuery]);
    
    let data = '';
    let error = '';

    pythonProcess.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });

    // Wait for the process to complete with a timeout
    const exitCode = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        resolve(-1);
      }, 15000); // 15 second timeout
      
      pythonProcess.on('close', (code) => {
        clearTimeout(timeout);
        resolve(code);
      });
    });

    if (exitCode === -1) {
      console.error('News summarizer script timed out');
      return NextResponse.json(getFallbackSummary(searchQuery), { status: 408 });
    }

    if (exitCode !== 0) {
      console.error('News summarizer script error:', error);
      return NextResponse.json(getFallbackSummary(searchQuery), { status: 500 });
    }

    try {
      let summary = JSON.parse(data);
      if (!summary || !summary.summary) {
        console.log('No summary from Python script, using fallback');
        return NextResponse.json(getFallbackSummary(searchQuery));
      }
      
      console.log(`Successfully generated summary for: ${searchQuery}`);
      return NextResponse.json(summary);
    } catch (parseError) {
      console.error('Failed to parse summary output:', parseError);
      return NextResponse.json(getFallbackSummary(searchQuery));
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(getFallbackSummary("news"), { status: 500 });
  }
}

function getFallbackSummary(query: string) {
  // Fallback summary when the Python script fails
  return {
    title: query,
    summary: `We're currently unable to generate a detailed summary for "${query}". This could be due to high demand or temporary service issues. Please try again later or visit the original source for the full article.`,
    source: "News Summary Service",
    url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
    publishedAt: new Date().toISOString(),
    category: "general",
    readingTime: "2 min read"
  };
}

function formatSummaryToLines(summary: string): string {
  // Split the summary into sentences
  const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= 8) {
    return summary;
  }
  
  // Take the first 7-8 meaningful sentences
  const meaningfulSentences = sentences
    .filter(s => s.trim().length > 10)
    .slice(0, 8);
  
  return meaningfulSentences.join('. ').trim() + '.';
}
