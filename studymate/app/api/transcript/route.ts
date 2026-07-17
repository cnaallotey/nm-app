import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, fetchTranscript } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout for serverless execution on Vercel

/**
 * Fetches video metadata (title, thumbnail, channelTitle) using the
 * YouTube Data API v3. Falls back to a minimal default if the key is
 * missing or the API call fails, so the app degrades gracefully.
 */
async function fetchVideoMetadata(videoId: string): Promise<{
  title: string;
  thumbnail: string | null;
  channelTitle: string | null;
}> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (apiKey && !apiKey.includes("PASTE_YOUR")) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });

      if (res.ok) {
        const data = await res.json();
        const item = data?.items?.[0]?.snippet;

        if (item) {
          return {
            title: item.title || "YouTube Video",
            // Prefer maxres → high → medium → default thumbnail
            thumbnail:
              item.thumbnails?.maxres?.url ||
              item.thumbnails?.high?.url ||
              item.thumbnails?.medium?.url ||
              item.thumbnails?.default?.url ||
              null,
            channelTitle: item.channelTitle || null,
          };
        }
      }
    } catch (err) {
      console.error("YouTube Data API metadata fetch failed:", err);
    }
  }

  // Graceful fallback — noembed for title, no thumbnail
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.title) {
        return {
          title: data.title,
          thumbnail: data.thumbnail_url || null,
          channelTitle: data.author_name || null,
        };
      }
    }
  } catch {
    // ignore noembed errors
  }

  return { title: "YouTube Video", thumbnail: null, channelTitle: null };
}

export async function POST(req: NextRequest) {
  try {
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

    // Extract video ID from the URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        {
          error:
            "Invalid YouTube URL format. Please paste a valid YouTube video link.",
        },
        { status: 400 }
      );
    }

    // Fetch transcript and metadata in parallel
    const [transcript, metadata] = await Promise.all([
      fetchTranscript(videoId),
      fetchVideoMetadata(videoId),
    ]);

    return NextResponse.json({
      videoId,
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      channelTitle: metadata.channelTitle,
      transcript,
    });
  } catch (error: any) {
    console.error("Transcript retrieval error:", error);

    const msg = error?.message || "Internal server error";

    // Map specific error types to appropriate HTTP status codes
    let status = 500;
    if (
      msg.includes("No captions") ||
      msg.includes("disabled") ||
      msg.includes("unavailable") ||
      msg.includes("unplayable") ||
      msg.includes("age-restricted") ||
      msg.includes("Invalid YouTube")
    ) {
      status = 400;
    }

    return NextResponse.json({ error: msg }, { status });
  }
}
