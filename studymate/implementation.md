# Implementation Plan — YouTube Learning Quiz Platform

This document breaks `spec.md` into concrete, ordered implementation steps for an AI coding agent. Follow phases in order; each phase should be working and testable before moving to the next.

## Phase 0: Project Setup

1. Scaffold a Next.js app (App Router, TypeScript).
   ```
   npx create-next-app@latest quiz-platform --typescript --app --tailwind
   ```
2. Install dependencies:
   ```
   npm install firebase firebase-admin @google/genai youtube-transcript
   ```
3. Set up Firebase project (Auth, Firestore, Hosting) and add config to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   FIREBASE_SERVICE_ACCOUNT_KEY=   # for admin SDK, server-side only
   GEMINI_API_KEY=
   ```
4. Create `lib/firebase.ts` (client SDK init) and `lib/firebaseAdmin.ts` (admin SDK init, server-only).
5. Create `lib/gemini.ts` to initialize the Gen AI client using `GEMINI_API_KEY`.

## Phase 1: Transcript Extraction

1. Create `lib/youtube.ts`:
   - `extractVideoId(url: string): string` — parse video ID from any YouTube URL format
   - `fetchTranscript(videoId: string): Promise<string>` — use `youtube-transcript` package, join caption segments into plain text, strip timestamps
2. Create API route `app/api/transcript/route.ts`:
   - Accepts `{ videoUrl }`
   - Returns `{ videoId, title, transcript }` or a clear error if no captions exist
3. Test manually with 2–3 known videos (one with auto-captions, one with manual captions, one with no captions) to confirm error handling.

## Phase 2: Quiz Generation via Gemini

1. Create `lib/quizGenerator.ts`:
   - Function `generateQuiz(transcript: string, numQuestions = 8)`
   - Use Gemini structured output / JSON schema mode to force this shape:
     ```ts
     type Question = {
       question: string;
       options: [string, string, string, string];
       correctAnswerIndex: number;
       explanation: string;
     };
     ```
   - System instruction: only generate questions answerable strictly from the transcript; no outside facts.
   - Wrap in a retry (max 2 retries) in case JSON parsing fails.
2. Create API route `app/api/generate-quiz/route.ts`:
   - Accepts `{ videoId, transcript }`
   - Checks Firestore `quizzes/{videoId}` first — if it exists, return cached quiz (skip Gemini call)
   - Otherwise calls `generateQuiz`, writes result to Firestore, returns quiz
3. Create API route `app/api/quiz/[videoId]/route.ts`:
   - `GET` — returns cached quiz by videoId, 404 if not found

## Phase 3: Firestore Schema & Rules

1. Implement collections per spec: `videos`, `quizzes`, `attempts`.
2. Write Firestore security rules:
   - `videos`, `quizzes`: publicly readable, writable only by server (admin SDK / Cloud Functions)
   - `attempts`: readable/writable only by the authenticated owner (`request.auth.uid == resource.data.userId`)
3. Deploy rules via Firebase CLI.

## Phase 4: Frontend — Core Pages

1. `/` — Home page: input field for YouTube URL, "Generate Quiz" button
   - On submit: call `/api/transcript`, then `/api/generate-quiz`, redirect to `/quiz/[videoId]`
   - Show loading state (transcript fetch + quiz generation can take 5–15s)
2. `/quiz/[videoId]` — Quiz-taking page
   - Fetch quiz via `/api/quiz/[videoId]`
   - Render questions one at a time or as a scrollable list (agent's choice, favor simplicity: one at a time with a progress bar)
   - Track answers in local component state (`useState` or `useReducer`)
   - "Submit" button appears after last question is answered
3. `/quiz/[videoId]/results` — Results page
   - Show score (X/N correct), per-question breakdown with the user's answer, correct answer, and explanation
   - If authenticated, save attempt via `/api/submit-attempt`

## Phase 5: Auth

1. Add Firebase Auth with Google sign-in provider.
2. Add a simple auth context/provider (`lib/authContext.tsx`) wrapping the app.
3. Guest users can generate and take quizzes; only signed-in users get attempts saved and a history page.
4. `/history` — lists past attempts for the signed-in user (simple table: video title, score, date).

## Phase 6: Polish & Guardrails

1. Rate-limit `/api/generate-quiz` per IP/user to control Gemini API cost (e.g., simple in-memory or Firestore-based counter).
2. Handle edge cases:
   - No captions available → friendly error message, suggest another video
   - Video is age-restricted / private / region-locked → friendly error
   - Transcript too short (<200 words) → warn that quiz quality may be low
3. Add basic analytics (quiz generated, quiz completed) if desired later.

## Phase 7: Deployment

1. Deploy Next.js app to Firebase Hosting (or Vercel, agent's choice, but Firebase keeps everything in one place given the stack).
2. Confirm environment variables are set in the hosting provider's dashboard, not committed to source control.
3. Smoke test the full flow end-to-end in production: paste URL → generate quiz → take quiz → view results.

## Explicitly Deferred to v2 (do not build yet)

- Essay/open-ended question type + Gemini grading rubric
- Difficulty levels
- Playlist/multi-video ingestion
- Spaced repetition / retake scheduling
- Public quiz sharing
