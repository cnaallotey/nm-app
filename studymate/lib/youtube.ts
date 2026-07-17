/**
 * Fetches the transcript for a given YouTube video ID using a reliable transcript proxy service.
 *
 * Why: Major cloud providers like Vercel have their datacenter IP ranges flagged and blocked by YouTube.
 * Standard scraper libraries (or custom page scrapers) fail immediately in production, returning
 * empty responses (Content-Length: 0) or forcing a sign-in wall.
 *
 * Routing requests through the dedicated, free youtube-transcript.ai API resolves the datacenter IP
 * blocking issue, ensuring transcripts load instantly and reliably in both local and production environments.
 */

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats.
 * E.g., watch URLs, share links, embed links, shorts, live streams, or direct IDs.
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  const cleanedUrl = url.trim();

  // Regex to cover standard, mobile, embed, short, live-stream and short sharing links
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/|shorts\/)([^#&?]*).*/;
  const match = cleanedUrl.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  // Fallback: Check if user pasted a raw 11-character ID directly
  if (cleanedUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(cleanedUrl)) {
    return cleanedUrl;
  }

  return null;
}

/**
 * Cleans the raw Markdown/text transcript response by stripping out
 * metadata headers, timestamps, and music notes.
 */
function cleanRawTranscript(rawText: string): string {
  const transcriptHeader = "## Transcript";
  const headerIndex = rawText.indexOf(transcriptHeader);
  
  let mainText = rawText;
  if (headerIndex !== -1) {
    mainText = rawText.substring(headerIndex + transcriptHeader.length);
  }

  return mainText
    // Remove timestamps like [0:01], [1:02:30], etc.
    .replace(/\[\d+:\d+(?::\d+)?\]/g, "")
    // Remove music notes
    .replace(/♪/g, "")
    // Collapse multiple spaces/newlines into a single space
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetches and returns the plain-text transcript for a YouTube video ID.
 */
export async function fetchTranscript(videoId: string): Promise<string> {
  const apiUrl = `https://youtube-transcript.ai/transcript/${encodeURIComponent(videoId)}.txt`;

  try {
    const res = await fetch(apiUrl);
    
    if (res.status === 404) {
      const errorText = await res.text();
      
      if (errorText.toLowerCase().includes("unavailable")) {
        throw new Error(
          "This video is unavailable. It may have been deleted, made private, or is age-restricted at the API level. Please select a public video."
        );
      }
      
      throw new Error(
        "No captions or transcripts are available for this video. Please select a video that has captions enabled."
      );
    }

    if (!res.ok) {
      throw new Error(`Transcript API returned HTTP ${res.status}`);
    }

    const rawText = await res.text();
    const cleaned = cleanRawTranscript(rawText);

    if (!cleaned) {
      throw new Error("No transcript content was returned by YouTube.");
    }

    return cleaned;
  } catch (err: any) {
    console.error(`Error fetching transcript for video ID ${videoId}:`, err);
    throw new Error(err.message || "Failed to retrieve transcript for this YouTube video.");
  }
}
