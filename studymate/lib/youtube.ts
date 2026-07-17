/**
 * YouTube transcript fetcher that directly hits YouTube's InnerTube API.
 *
 * Why: The `youtube-transcript` npm package scrapes the page in a way that
 * YouTube blocks from cloud/datacenter IPs (Vercel, Railway, etc.), producing
 * the misleading "Captions are disabled" error even when captions exist.
 *
 * This implementation fetches the video page with browser-like headers to
 * extract caption track URLs, then fetches and parses the timed-text XML
 * directly. No external package dependencies beyond native Node fetch.
 */

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Upgrade-Insecure-Requests": "1",
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
 * Extracts the captionTracks array from the YouTube page's ytInitialPlayerResponse JSON.
 * Returns an array of { baseUrl, languageCode, name } objects.
 */
function extractCaptionTracks(
  pageHtml: string
): Array<{ baseUrl: string; languageCode: string; name: string }> {
  // The player response is embedded as a JS variable in the page
  const playerResponseMatch = pageHtml.match(
    /ytInitialPlayerResponse\s*=\s*(\{[\s\S]+?\});(?:\s*var\s|\s*<\/script>)/
  );

  let playerJson: any = null;

  if (playerResponseMatch) {
    try {
      playerJson = JSON.parse(playerResponseMatch[1]);
    } catch {
      // Try a more permissive extraction
    }
  }

  // Fallback: look for captionTracks directly in the raw HTML
  if (!playerJson) {
    const captions: Array<{ baseUrl: string; languageCode: string; name: string }> = [];
    const trackRegex = /"baseUrl":"(https:\/\/www\.youtube\.com\/api\/timedtext[^"]+)"/g;
    const langRegex = /"languageCode":"([^"]+)"/g;

    let trackMatch;
    while ((trackMatch = trackRegex.exec(pageHtml)) !== null) {
      captions.push({
        baseUrl: trackMatch[1].replace(/\\u0026/g, "&"),
        languageCode: "en",
        name: "Unknown",
      });
    }
    return captions;
  }

  const captionsData =
    playerJson?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!captionsData || !Array.isArray(captionsData) || captionsData.length === 0) {
    return [];
  }

  return captionsData.map((track: any) => ({
    baseUrl: track.baseUrl || "",
    languageCode: track.languageCode || "unknown",
    name: track.name?.simpleText || track.name?.runs?.[0]?.text || "Unknown",
  }));
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
  const asr = tracks.find((t) => t.baseUrl.includes("kind=asr"));
  if (asr) return asr;

  // Fall back to whatever is first
  return tracks[0];
}

/**
 * Fetches and returns the plain-text transcript for a YouTube video ID.
 * Uses direct InnerTube API access rather than the youtube-transcript package
 * to work reliably in cloud/production environments.
 */
export async function fetchTranscript(videoId: string): Promise<string> {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // 1. Fetch the video page with browser-like headers
  let pageHtml: string;
  try {
    const pageRes = await fetch(videoUrl, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
    });

    if (!pageRes.ok) {
      throw new Error(`YouTube returned HTTP ${pageRes.status} for video ${videoId}.`);
    }
    pageHtml = await pageRes.text();
  } catch (err: any) {
    throw new Error(
      `Unable to reach YouTube. Check your network connection. (${err.message})`
    );
  }

  // 2. Check for common page-level blocks before proceeding
  if (
    pageHtml.includes('"playabilityStatus":{"status":"LOGIN_REQUIRED"') ||
    pageHtml.includes('"status":"LOGIN_REQUIRED"')
  ) {
    throw new Error(
      "This video is age-restricted or private and requires sign-in. Please choose a publicly accessible video."
    );
  }

  if (
    pageHtml.includes('"status":"ERROR"') &&
    pageHtml.includes('"reason":"Video unavailable"')
  ) {
    throw new Error(
      "This video is unavailable. It may have been deleted or made private."
    );
  }

  // 3. Extract caption track list
  const tracks = extractCaptionTracks(pageHtml);

  if (tracks.length === 0) {
    throw new Error(
      "No captions are available for this video. The creator may have disabled captions, or the video may be too new for auto-captions to be generated. Please try a different video."
    );
  }

  // 4. Pick the best available track
  const track = selectBestTrack(tracks);
  if (!track || !track.baseUrl) {
    throw new Error(
      "Could not find a usable caption track for this video."
    );
  }

  // 5. Fetch the timed-text XML
  let captionXml: string;
  try {
    const captionRes = await fetch(track.baseUrl, {
      headers: {
        ...BROWSER_HEADERS,
        Referer: videoUrl,
      },
    });

    if (!captionRes.ok) {
      throw new Error(
        `Caption endpoint returned HTTP ${captionRes.status}.`
      );
    }
    captionXml = await captionRes.text();
  } catch (err: any) {
    throw new Error(`Failed to download caption track. (${err.message})`);
  }

  // 6. Parse and return
  return parseTimedTextXml(captionXml);
}
