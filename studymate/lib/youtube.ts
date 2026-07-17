import { YoutubeTranscript } from "youtube-transcript";

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats.
 * E.g., watch URLs, share links, embed links, shorts, live streams, or direct IDs.
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  const cleanedUrl = url.trim();

  // Regex to cover standard, mobile, embed, short, live-stream and short sharing links
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/|shorts\/)([^#\&\?]*).*/;
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
 * Cleans the transcript text by decoding common HTML entities and collapsing spaces.
 */
function cleanTranscript(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetches the transcript for a given YouTube video ID, joins the parts, and cleans the text.
 */
export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const transcriptObj = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptObj || transcriptObj.length === 0) {
      throw new Error("No transcript content was returned by YouTube.");
    }
    const fullText = transcriptObj.map((t) => t.text).join(" ");
    return cleanTranscript(fullText);
  } catch (error: any) {
    console.error(`Error fetching transcript for video ID ${videoId}:`, error);

    const msg = error?.message || String(error);
    if (msg.includes("TranscriptDisabled") || msg.includes("disabled")) {
      throw new Error("Captions are disabled for this video. Please select a video that has captions enabled.");
    }
    if (msg.includes("Could not find transcript") || msg.includes("unavailable")) {
      throw new Error("Transcripts are not available for this video (e.g. it may be private, age-restricted, or have no captions).");
    }
    throw new Error(msg || "Failed to retrieve transcript for this YouTube video.");
  }
}
