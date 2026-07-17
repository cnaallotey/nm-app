import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === "your_gemini_api_key_here") {
  console.warn("GEMINI_API_KEY environment variable is not configured.");
}

// Initialize the Google Gen AI client with the API key from environment variables
export const ai = new GoogleGenAI({
  apiKey: apiKey === "your_gemini_api_key_here" ? "" : apiKey,
});
