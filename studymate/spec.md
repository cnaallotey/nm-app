# YouTube Learning Quiz Platform — Specification (v1)

## 1. Overview

A web platform that takes any YouTube video URL and automatically generates a quiz (questions + answers) based on the video's content, allowing viewers to test their comprehension after watching. Inspired by NotebookLM's approach of working from transcripts rather than raw video/audio.

**Core value proposition:** People learn a lot from YouTube but rarely get tested on it. This platform closes that loop.

## 2. Tech Stack

- **Frontend/Framework:** Next.js (App Router)
- **Backend/Infra:** Firebase (Auth, Firestore, Cloud Functions, Hosting)
- **AI:** Google Gemini API (via Gen AI SDK) for transcript analysis, question generation, and (v2) essay grading
- **Transcript Source:** YouTube Transcript API / YouTube Data API v3 (captions endpoint)

## 3. Version 1 Scope (MVP)

### 3.1 User Flow
1. User pastes a YouTube video URL.
2. System fetches the video's transcript.
3. Transcript is sent to Gemini with a structured prompt to extract key concepts and generate a multiple-choice quiz.
4. User is presented with the quiz (5–10 questions to start).
5. User answers; system scores immediately (client-side or server-side, since answers are known ahead of time).
6. User sees a results screen: score, correct answers, and a brief explanation per question.

### 3.2 Explicitly Out of Scope for v1
- Essay/open-ended questions and grading (this is v2)
- Video content that has no captions/transcript available
- Multi-video / playlist ingestion
- Spaced repetition or long-term progress tracking (nice-to-have later)

## 4. Functional Requirements

### 4.1 Transcript Extraction
- Input: YouTube video URL or video ID
- Extract video ID via regex/URL parsing
- Call YouTube caption/transcript retrieval (fallback: notify user if no captions exist)
- Clean transcript (remove timestamps, filler artifacts) before sending to Gemini

### 4.2 Question Generation (Gemini)
- Prompt Gemini with the cleaned transcript
- Request structured JSON output: array of questions, each with:
  - `question` (string)
  - `options` (array of 4 strings)
  - `correctAnswerIndex` (number)
  - `explanation` (string, shown after answering)
- Number of questions configurable (default: 8)
- Difficulty could be a v1.1 stretch parameter (easy/medium/hard)

### 4.3 Quiz Taking Experience
- One question at a time or full-page scroll (design decision, either works)
- Track selected answers in client state
- On submit: compare answers, compute score
- Show results: score %, per-question correct/incorrect + explanation

### 4.4 Data Persistence
- Store generated quizzes in Firestore (keyed by video ID) so the same video isn't re-processed by Gemini every time — cache the quiz
- Store user attempts/scores (if user is authenticated) for future history features

## 5. Data Model (Firestore)

**`videos` collection**
```
{
  videoId: string,        // YouTube video ID
  title: string,
  transcriptFetchedAt: timestamp,
  quizGeneratedAt: timestamp
}
```

**`quizzes` collection**
```
{
  videoId: string,
  questions: [
    {
      question: string,
      options: string[4],
      correctAnswerIndex: number,
      explanation: string
    }
  ],
  createdAt: timestamp
}
```

**`attempts` collection** (requires auth)
```
{
  userId: string,
  videoId: string,
  answers: number[],
  score: number,
  completedAt: timestamp
}
```

## 6. API Routes (Next.js)

- `POST /api/transcript` — accepts videoUrl, returns cleaned transcript
- `POST /api/generate-quiz` — accepts videoId + transcript, calls Gemini, returns quiz JSON, caches to Firestore
- `GET /api/quiz/:videoId` — returns cached quiz if it exists
- `POST /api/submit-attempt` — accepts answers, scores them, stores attempt (if authenticated)

## 7. Gemini Prompt Strategy (v1)

- System instruction: act as an assessment designer; only use information present in the transcript; do not hallucinate facts not covered in the video.
- Request strict JSON output (use Gemini's JSON mode/schema constraint if available) to avoid parsing errors.
- Include a fallback/retry step if JSON parsing fails.

## 8. Auth

- Firebase Auth (Google sign-in is a natural fit given the YouTube/Google ecosystem)
- Anonymous/guest usage allowed for taking quizzes; auth required only to save history

## 9. Version 2 (Future Scope)

- Essay/open-ended question type
- Gemini-based grading of essay answers against a rubric derived from the transcript
- Difficulty levels
- Spaced repetition / retake prompts
- Playlist and multi-video ingestion
- Progress dashboard across videos

## 10. Open Questions

- How to handle videos without captions (auto-generated captions only, or reject entirely?)
- Rate limiting / cost control for Gemini calls (cache aggressively per video ID)
- Should quizzes be public/shareable, or private to the generating user?
