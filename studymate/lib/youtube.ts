/**
 * YouTube transcript fetcher using the InnerTube /player API endpoint.
 *
 * Why not the YouTube Data API captions.download?
 *   That endpoint requires OAuth and only works on videos you own.
 *
 * Why not HTML page scraping?
 *   Vercel/cloud IPs receive a sign-in gate HTML page from YouTube even
 *   for public videos, making HTML parsing unreliable in production.
 *
 * This implementation POSTs directly to YouTube's internal /player endpoint
 * using an Android client context. The response is a clean JSON object that
 * includes caption track URLs without any IP-based gating.
 */

// InnerTube Android client context — tells YouTube's backend we're the
// official Android app, which bypasses the browser-facing sign-in gate.
const INNERTUBE_ENDPOINT = "https://www.youtube.com/youtubei/v1/player";

const INNERTUBE_CONTEXT = {
  client: {
    clientName: "ANDROID",
    clientVersion: "19.09.37",
    androidSdkVersion: 30,
    hl: "en",
    gl: "US",
    utcOffsetMinutes: 0,
  },
};

/**
 * Extracts the 11-character YouTube video ID from various URL formats.
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  const cleanedUrl = url.trim();

  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/|shorts\/)([^#&?]*).*/;
  const match = cleanedUrl.match(regExp);

  if (match && match[2].length === 11) return match[2];

  // Fallback: bare 11-character ID
  if (cleanedUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(cleanedUrl)) {
    return cleanedUrl;
  }

  return null;
}

/**
 * Decodes common HTML entities in transcript text.
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses YouTube's timed-text XML into a plain string.
 * <text start="0.5" dur="2.3">Hello world</text>
 */
function parseTimedTextXml(xml: string): string {
  const parts: string[] = [];
  const textTagRegex = /<text[^>]*>([\s\S]*?)<\/text>/g;
  let match;
  while ((match = textTagRegex.exec(xml)) !== null) {
    const raw = match[1].trim();
    if (raw) parts.push(decodeHtmlEntities(raw));
  }
  if (parts.length === 0) {
    throw new Error("No transcript segments found in caption XML.");
  }
  return parts.join(" ");
}

/**
 * Selects the best caption track: prefers English, falls back to first available.
 */
function selectBestTrack(
  tracks: Array<{ baseUrl: string; languageCode: string; name: string }>
): { baseUrl: string; languageCode: string; name: string } | null {
  if (tracks.length === 0) return null;

  // Prefer exact English
  const en = tracks.find((t) => t.languageCode === "en");
  if (en) return en;

  // Prefer any English variant (en-US, en-GB, etc.)
  const enVariant = tracks.find((t) => t.languageCode.startsWith("en"));
  if (enVariant) return enVariant;

  // Auto-generated English (asr = automatic speech recognition)
  const asr = tracks.find(
    (t) => t.baseUrl.includes("kind=asr") || t.baseUrl.includes("tlang=en")
  );
  if (asr) return asr;

  // Fall back to first available
  return tracks[0];
}

/**
 * Calls the InnerTube /player endpoint to get the player JSON for a video.
 * This returns caption track URLs directly without going through the HTML page.
 */
async function fetchPlayerData(videoId: string): Promise<any> {
  const res = await fetch(INNERTUBE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Required by YouTube's backend to accept the request
      "X-YouTube-Client-Name": "3",
      "X-YouTube-Client-Version": "19.09.37",
    },
    body: JSON.stringify({
      context: INNERTUBE_CONTEXT,
      videoId,
      params: "8AEB", // param to request subtitles/captions
    }),
  });

  if (!res.ok) {
    throw new Error(
      `InnerTube player endpoint returned HTTP ${res.status} for video ${videoId}.`
    );
  }

  return res.json();
}

/**
 * Fetches and returns the plain-text transcript for a YouTube video ID.
 *
 * Uses the InnerTube /player POST endpoint (Android client context) to avoid
 * the IP-based sign-in gate that YouTube presents to cloud/datacenter IPs
 * when scraping the HTML page.
 */
export async function fetchTranscript(videoId: string): Promise<string> {
  // 1. Get player JSON via InnerTube
  let playerData: any;
  try {
    playerData = await fetchPlayerData(videoId);
  } catch (err: any) {
    throw new Error(
      `Unable to reach YouTube's player API. Check your network connection. (${err.message})`
    );
  }

  // 2. Check playability
  const playability = playerData?.playabilityStatus;
  if (playability) {
    const status = playability.status as string;

    if (status === "ERROR") {
      throw new Error(
        "This video is unavailable. It may have been deleted or made private."
      );
    }

    if (status === "UNPLAYABLE") {
      const reason = playability.reason as string | undefined;
      throw new Error(
        reason ||
          "This video is unplayable (it may be restricted to certain regions or platforms)."
      );
    }

    // LOGIN_REQUIRED means genuinely age-gated even at the API level
    if (status === "LOGIN_REQUIRED") {
      throw new Error(
        "This video is age-restricted at the API level and cannot be transcribed without authentication. Please choose a different video."
      );
    }
  }

  // 3. Extract caption tracks from the player JSON
  const captionTracks: Array<{
    baseUrl: string;
    languageCode: string;
    name: string;
  }> =
    playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];

  if (captionTracks.length === 0) {
    throw new Error(
      "No captions are available for this video. The creator may have disabled captions, or the video may be too new for auto-captions to be generated. Please try a different video."
    );
  }

  // 4. Pick the best available track
  const track = selectBestTrack(captionTracks);
  if (!track?.baseUrl) {
    throw new Error("Could not find a usable caption track for this video.");
  }

  // 5. Fetch the timed-text XML from the caption URL
  let captionXml: string;
  try {
    const captionRes = await fetch(track.baseUrl, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!captionRes.ok) {
      throw new Error(`Caption endpoint returned HTTP ${captionRes.status}.`);
    }
    captionXml = await captionRes.text();
  } catch (err: any) {
    throw new Error(`Failed to download caption track. (${err.message})`);
  }

  // 6. Parse XML and return plain text
  return parseTimedTextXml(captionXml);
}
