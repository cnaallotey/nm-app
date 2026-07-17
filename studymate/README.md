# StudyMate

A YouTube-powered study tool that converts any video into an AI-generated quiz. Paste a video link, get a structured quiz, attempt it, and track your learning progress over time.

---

## What It Does

- **Quiz Generation** — Paste any YouTube URL. The app fetches the transcript, sends it to Gemini, and generates a multiple-choice quiz with explanations.
- **Quiz Attempts** — Take the quiz, submit your answers, and get instant scoring with per-question feedback.
- **Lessons Catalog** — Browse all quizzes you've generated, see your best scores, and retake any lesson.
- **Attempts History** — Full log of every quiz attempt with scores, pass/fail status, and date.
- **Dashboard Overview** — Pass rate chart, summary stats, and quick links to recent activity.
- **Pro Subscriptions** — Paystack-powered billing. Paying users unlock unlimited quiz generation.
- **Feedback Widget** — Floating bottom-right widget for users to submit bug reports or improvement ideas directly into Firestore.
- **Admin Panel** — Restricted to the owner email. Tabs for managing users (plan, status), reviewing the payments ledger, and triaging feedback tickets.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Auth | Firebase Authentication (Google Sign-In) |
| Database | Cloud Firestore |
| Server SDK | Firebase Admin SDK |
| AI | Google Gemini (`@google/genai`) |
| Payments | Paystack Inline JS + server-side verification |

---

## Project Structure

```
studymate/
├── app/
│   ├── page.tsx                   # Landing page (Framer Motion scroll animations)
│   ├── dashboard/
│   │   ├── layout.tsx             # Sidebar, auth gate, user card, feedback widget
│   │   ├── page.tsx               # Overview: stats, pass rate chart, recent attempts
│   │   ├── generate/page.tsx      # YouTube URL input → quiz generation
│   │   ├── lessons/page.tsx       # Lessons catalog with thumbnail cards
│   │   ├── attempts/page.tsx      # Full attempts history table
│   │   └── admin/page.tsx         # Admin panel (email-gated)
│   ├── quiz/[videoId]/
│   │   ├── page.tsx               # Active quiz — question + options
│   │   └── results/page.tsx       # Score, per-question review, sticky video
│   └── api/
│       ├── generate-quiz/         # POST — fetches transcript, calls Gemini, stores quiz
│       ├── quiz/[videoId]/        # GET — returns stored quiz for a video
│       ├── submit-attempt/        # POST — scores answers, writes attempt to Firestore
│       ├── transcript/            # GET — fetches YouTube transcript
│       └── verify-payment/        # POST — verifies Paystack reference, upgrades plan
├── components/
│   ├── CheckoutModal.tsx          # Paystack inline popup + server verification flow
│   └── FeedbackWidget.tsx         # Floating bug/idea reporter
├── lib/
│   ├── authContext.tsx            # Auth state, real-time profile listener, isAdmin
│   ├── firebase.ts                # Firebase client SDK init
│   ├── firebaseAdmin.ts           # Firebase Admin SDK init (server-side only)
│   ├── gemini.ts                  # Gemini client init
│   ├── quizGenerator.ts           # Prompt builder + Gemini response parser
│   └── youtube.ts                 # Transcript fetching utilities
├── firestore.rules                # Security rules (email-gated admin, payment write guard)
└── .env.local                     # Environment variables (see below)
```

---

## Environment Variables

Create `.env.local` in the project root. All variables are required.

```env
# Firebase Client (public — safe to expose to the browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin SDK (server-side only — never expose to browser)
# Paste the full service account JSON as a single-line string
FIREBASE_SERVICE_ACCOUNT_KEY=

# Google Gemini
GEMINI_API_KEY=

# Paystack (get from dashboard.paystack.com → Settings → API Keys)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build (run to verify before deploying)
npm run build
```

---

## Key Dev Notes

### Admin Access
Admin access is **email-gated only** — hardcoded to `charlesallotey1995@gmail.com` in `lib/authContext.tsx`. No Firestore role field is involved. The Firestore rules use `request.auth.token.email` directly for the `isAdmin()` check, which is both faster and more tamper-resistant.

To change the admin email, update the `ADMIN_EMAIL` constant in [`lib/authContext.tsx`](lib/authContext.tsx) and the matching string in [`firestore.rules`](firestore.rules).

### Payment Flow
1. User clicks **Upgrade to Pro** → `CheckoutModal` opens.
2. Paystack Inline JS SDK loads (CDN, no npm package) and opens the native Paystack popup.
3. On successful payment, the client sends `{ reference, userId, email }` to `POST /api/verify-payment`.
4. The server hits `api.paystack.co/transaction/verify/:ref` with the secret key.
5. If `status === "success"`, the server writes to `/payments` and sets `users/{uid}.plan = "Pro"` using the Admin SDK (bypasses client Firestore rules).
6. Client shows the success screen; the sidebar plan badge updates in real time via the Firestore `onSnapshot` listener in `authContext.tsx`.

### Firestore Collections

| Collection | Written by | Purpose |
|---|---|---|
| `users` | Client (on first sign-in), Admin SDK (plan upgrades) | User profiles |
| `quizzes` | Server API route | Generated quiz questions |
| `videos` | Server API route | Video metadata cache |
| `attempts` | Client | Per-quiz attempt records |
| `payments` | Admin SDK only (via verify-payment route) | Payment ledger |
| `feedback` | Client | User-submitted bug/idea reports |

### Passing Grade
A quiz is considered **passed** if the user scores **≥ 80%**. This threshold is used in the pass rate chart and the lessons catalog status pills.

### Framer Motion Types
Cubic-bezier easing arrays passed to Framer Motion must be cast explicitly in TypeScript:
```ts
transition={{ ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
```
Without the cast, `next build` will fail TypeScript checks.

### Paystack Currency
The checkout is configured for **NGN (Nigerian Naira)**. Amount is stored in kobo (smallest unit). To change currency or price, update `PLAN_AMOUNT_KOBO`, `PLAN_CURRENCY`, and `PLAN_LABEL` at the top of [`components/CheckoutModal.tsx`](components/CheckoutModal.tsx).
