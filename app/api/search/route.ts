import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { NewsItem } from "../../../lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const country = searchParams.get("country") || "global";

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    // Execute the Python script with the search query and country
    const pythonProcess = spawn('python', ['py/webscraping.py', country], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Send the query to the Python script
    pythonProcess.stdin.write(query + '\n');
    pythonProcess.stdin.end();

    let newsData = '';
    let errorData = '';

    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
      newsData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    // Wait for the Python script to complete
    const exitCode = await new Promise((resolve) => {
      pythonProcess.on('close', resolve);
    });

    if (exitCode !== 0) {
      console.error("Python script error:", errorData);
      throw new Error("Failed to search news");
    }

    try {
      // Parse the JSON output from the Python script
      const articles = JSON.parse(newsData);
      
      if (!Array.isArray(articles)) {
        throw new Error("Invalid data format received from Python script");
      }

      return NextResponse.json(articles);
    } catch (parseError) {
      console.error("Error parsing news data:", parseError);
      throw new Error("Failed to parse news data");
    }
  } catch (error) {
    console.error("Error searching news:", error);
    return NextResponse.json({ error: "Failed to search news" }, { status: 500 });
  }
}
