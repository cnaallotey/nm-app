import type { Property } from "@/data/types";

const REPO = "cnaallotey/nm-app";
const FILE_PATH = "Luxury Real Estate Listing UI(1)/src/data/properties.json";
const API_URL = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(FILE_PATH)}`;

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

export async function fetchProperties(
  token: string
): Promise<{ properties: Property[]; sha: string }> {
  const res = await fetch(`${API_URL}?ref=main`, { headers: headers(token) });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const data = await res.json();
  const content = decodeURIComponent(
    escape(atob(data.content.replace(/\n/g, "")))
  );
  return { properties: JSON.parse(content), sha: data.sha };
}

export async function saveProperties(
  token: string,
  properties: Property[],
  sha: string,
  message: string
): Promise<string> {
  const content = btoa(
    unescape(encodeURIComponent(JSON.stringify(properties, null, 2) + "\n"))
  );
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({ message, content, sha, branch: "main" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Save failed: ${res.status}`);
  }
  const data = await res.json();
  return data.content.sha;
}
