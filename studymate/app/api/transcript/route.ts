import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, fetchTranscript } from "@/lib/youtube";

export const dynamic = "force-dynamic";

/**
 * Fetches the video title via oembed endpoint (noembed) without requiring an API key.
 * Falls back to "YouTube Video" if the fetch fails.
 */
async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) {
        return data.title;
      }
    }
  } catch (error) {
    console.error("Error fetching video title:", error);
  }
  return "YouTube Video";
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }

    const { videoUrl } = body;

    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'videoUrl' field." },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL format. Please paste a valid YouTube video link." },
        { status: 400 }
      );
    }

    // Retrieve transcript and title in parallel
    const [transcript, title] = await Promise.all([
      fetchTranscript(videoId),
      fetchVideoTitle(videoId),
    ]);

    return NextResponse.json({
      videoId,
      title,
      transcript,
    });
  } catch (error: any) {
    console.error("Transcript retrieval error:", error);
    
    // Determine status code based on error message
    let status = 500;
    const msg = error?.message || "Internal server error";
    if (msg.includes("disabled") || msg.includes("not available")) {
      status = 400;
    }

    return NextResponse.json(
      { error: msg },
      { status }
    );
  }
}
