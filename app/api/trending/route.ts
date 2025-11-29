import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "global";

    // Execute the combined trending script with the country parameter
    const trendingProcess = spawn('python', ['py/reddittrends.py', country]);
    
    let trendingData = '';
    let errorData = '';

    // Collect data from the trending script
    trendingProcess.stdout.on('data', (data) => {
      trendingData += data.toString();
    });

    trendingProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    // Wait for the script to complete
    const exitCode = await new Promise((resolve) => {
      trendingProcess.on('close', resolve);
    });

    // Log any errors for debugging
    if (errorData) {
      console.error("Python script errors:", errorData);
    }

    if (exitCode !== 0) {
      console.error("Python script exited with code:", exitCode);
      throw new Error("Trending script failed to execute");
    }

    try {
      // Parse JSON output from the script
      const trendingTopics = JSON.parse(trendingData);

      if (!Array.isArray(trendingTopics)) {
        throw new Error("Invalid data format received from Python script");
      }

      // Filter out any invalid entries
      const validTrendingTopics = trendingTopics
        .filter(topic => topic.title && topic.title.length > 0);

      if (validTrendingTopics.length === 0) {
        console.error("No valid trending topics found");
        return NextResponse.json({ error: "No trending topics available" }, { status: 404 });
      }

      return NextResponse.json(validTrendingTopics);
    } catch (parseError) {
      console.error("Error parsing trending data:", parseError);
      throw new Error("Failed to parse trending data");
    }
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return NextResponse.json({ error: "Failed to fetch trending topics" }, { status: 500 });
  }
}
