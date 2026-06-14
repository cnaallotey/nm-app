# TaskBoard — Implementation Guide

> Full-stack task request platform: Next.js (Pages Router) · Auth0 · Node/Express · PostgreSQL · Prisma

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Monorepo Setup](#4-monorepo-setup)
5. [Database Schema (Prisma)](#5-database-schema-prisma)
6. [Auth0 Configuration](#6-auth0-configuration)
7. [Express API Server](#7-express-api-server)
8. [Next.js Frontend](#8-nextjs-frontend)
9. [Core Feature Logic](#9-core-feature-logic)
10. [Email Notifications](#10-email-notifications)
11. [Admin Panel](#11-admin-panel)
12. [Environment Variables](#12-environment-variables)
13. [Build Order](#13-build-order)
14. [Deployment](#14-deployment)

---

## 1. Project Overview

**TaskBoard** is a hybrid community/freelance platform where users can post task requests (paid or community-based) and other users can either apply themselves or nominate someone else to take them on.

### Key Characteristics
- **Hybrid model** — tasks can be paid (with a stated budget) or community/favour-based
- **Fluid roles** — the same user can be a poster, a doer, and a recommender across different tasks
- **Semi-open** — tasks are publicly browsable without an account; all actions require authentication
- **No in-app payments** — paid tasks display a budget for reference; parties settle payment offline

### The Three User Actions
| Action | Who can do it | What it creates |
|---|---|---|
| Post a task | Any authenticated user | A `Task` record |
| Apply for a task | Any authenticated user (not the poster) | An `Application` with `type = SELF` |
| Nominate someone | Any authenticated user (not the poster) | An `Application` with `type = NOMINATION` |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js (Pages Router), React, TypeScript |
| Authentication | Auth0 (`@auth0/nextjs-auth0`, `express-oauth2-jwt-bearer`) |
| API server | Node.js + Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack Query (React Query) |
| Client state | Zustand |
| Email | Resend SDK |
| Dev tooling | Concurrently, ts-node, ESLint, Prettier |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────┐
│         Browser (React)             │
│  Next.js Pages Router (port 3000)   │
│                                     │
│  • Public pages (SSR / SSG)         │
│  • Auth0 session via cookie         │
│  • Axios → Express with Bearer token│
└──────────────┬──────────────────────┘
               │ HTTP (proxied in dev)
               ▼
┌─────────────────────────────────────┐
│      Express API Server (port 4000) │
│                                     │
│  • express-oauth2-jwt-bearer (JWT)  │
│  • Routes → Controllers → Services  │
│  • Prisma → PostgreSQL              │
│  • Resend (email)                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│           PostgreSQL DB             │
│  profiles, tasks, applications,     │
│  reviews, notifications             │
└─────────────────────────────────────┘

Auth flow:
Browser ──login──▶ Auth0 Universal Login
Auth0   ──callback─▶ Next.js /api/auth/callback
Next.js ──access token──▶ Express (Authorization: Bearer)
Express ──verify──▶ Auth0 JWKS endpoint
```

### Request Authentication Flow
1. User logs in via Auth0 Universal Login
2. `@auth0/nextjs-auth0` stores session in an encrypted httpOnly cookie
3. Client calls `/pages/api/token.ts` to get a fresh access token
4. Axios interceptor attaches token as `Authorization: Bearer <token>`
5. Express middleware validates the JWT against Auth0's JWKS endpoint
6. `req.auth.payload.sub` is used to look up the `Profile` row
7. `req.profile` is attached for all downstream use

---

## 4. Monorepo Setup

### Root structure
```
/
├── apps/
│   ├── web/          ← Next.js frontend
│   └── api/          ← Express backend
├── package.json      ← root workspace config
├── .env.example
└── README.md
```

### Root `package.json`
```json
{
  "name": "taskboard",
  "private": true,
  "workspaces": ["apps/web", "apps/api"],
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=apps/api\" \"npm run dev --workspace=apps/web\"",
    "build": "npm run build --workspace=apps/api && npm run build --workspace=apps/web",
    "db:migrate": "npm run migrate --workspace=apps/api",
    "db:seed": "npm run seed --workspace=apps/api"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

### Next.js rewrite (development proxy)
In `apps/web/next.config.js`:
```js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ]
  },
}
```

---

## 5. Database Schema (Prisma)

File: `apps/api/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────

enum Role {
  USER
  ADMIN
}

enum TaskType {
  PAID
  COMMUNITY
}

enum TaskStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum ApplicationType {
  SELF
  NOMINATION
}

enum ApplicationStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum NotificationType {
  NEW_APPLICATION
  NEW_NOMINATION
  APPLICATION_ACCEPTED
  APPLICATION_REJECTED
  TASK_ASSIGNED
  TASK_COMPLETED
  NEW_REVIEW
}

// ─── Models ──────────────────────────────────────────────

model Profile {
  id            String   @id @default(cuid())
  auth0UserId   String   @unique
  username      String   @unique
  fullName      String
  avatarUrl     String?
  bio           String?
  location      String?
  skills        String[]
  averageRating Float    @default(0)
  reviewCount   Int      @default(0)
  role          Role     @default(USER)
  banned        Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tasksPosted      Task[]        @relation("TaskPoster")
  tasksAssigned    Task[]        @relation("TaskAssignee")
  applicationsMade Application[] @relation("Applicant")
  nominations      Application[] @relation("NominatedUser")
  reviewsGiven     Review[]      @relation("Reviewer")
  reviewsReceived  Review[]      @relation("Reviewee")
  notifications    Notification[]
}

model Task {
  id             String     @id @default(cuid())
  posterId       String
  title          String
  description    String
  taskType       TaskType
  budget         Float?
  currency       String?
  skillsRequired String[]
  location       String?
  isRemote       Boolean    @default(true)
  status         TaskStatus @default(OPEN)
  assignedToId   String?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  poster       Profile       @relation("TaskPoster", fields: [posterId], references: [id])
  assignedTo   Profile?      @relation("TaskAssignee", fields: [assignedToId], references: [id])
  applications Application[]
  reviews      Review[]
}

model Application {
  id              String            @id @default(cuid())
  taskId          String
  applicantId     String
  type            ApplicationType
  nominatedUserId String?
  coverNote       String
  status          ApplicationStatus @default(PENDING)
  createdAt       DateTime          @default(now())

  task          Task     @relation(fields: [taskId], references: [id])
  applicant     Profile  @relation("Applicant", fields: [applicantId], references: [id])
  nominatedUser Profile? @relation("NominatedUser", fields: [nominatedUserId], references: [id])

  @@unique([taskId, applicantId])
}

model Review {
  id         String   @id @default(cuid())
  taskId     String
  reviewerId String
  revieweeId String
  rating     Int
  comment    String
  createdAt  DateTime @default(now())

  task     Task    @relation(fields: [taskId], references: [id])
  reviewer Profile @relation("Reviewer", fields: [reviewerId], references: [id])
  reviewee Profile @relation("Reviewee", fields: [revieweeId], references: [id])

  @@unique([taskId, reviewerId])
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  payload   Json
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())

  user Profile @relation(fields: [userId], references: [id])
}
```

### Key indexes to add in migration
```sql
CREATE INDEX idx_tasks_status ON "Task"(status);
CREATE INDEX idx_tasks_poster ON "Task"("posterId");
CREATE INDEX idx_applications_task ON "Application"("taskId");
CREATE INDEX idx_notifications_user_unread ON "Notification"("userId", read);

-- Full-text search index
ALTER TABLE "Task" ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || description)) STORED;
CREATE INDEX idx_tasks_search ON "Task" USING GIN(search_vector);
```

### Rating recalculation — Postgres trigger
```sql
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Profile"
  SET
    "averageRating" = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM "Review"
      WHERE "revieweeId" = NEW."revieweeId"
    ),
    "reviewCount" = (
      SELECT COUNT(*)
      FROM "Review"
      WHERE "revieweeId" = NEW."revieweeId"
    )
  WHERE id = NEW."revieweeId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
AFTER INSERT ON "Review"
FOR EACH ROW EXECUTE FUNCTION update_profile_rating();
```

---

## 6. Auth0 Configuration

### Dashboard setup checklist

**1. Create Application**
- Type: Regular Web App
- Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
- Allowed Logout URLs: `http://localhost:3000`
- Allowed Web Origins: `http://localhost:3000`

**2. Create API**
- Name: `TaskBoard API`
- Identifier (audience): `https://api.taskboard.app`
- Signing algorithm: RS256

**3. Post-Login Action** — adds custom claims to the access token

```javascript
// Auth0 Action: Add custom claims
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://taskboard.app';
  const { role, profileId } = event.user.app_metadata || {};

  api.accessToken.setCustomClaim(`${namespace}/role`, role || 'USER');
  api.accessToken.setCustomClaim(`${namespace}/profileId`, profileId || null);
  api.idToken.setCustomClaim(`${namespace}/username`, event.user.user_metadata?.username || null);
};
```

> **Critical:** Auth0 silently strips any custom claims that are not namespaced with a full URL. Always use the `https://taskboard.app/` prefix.

### Next.js — `pages/api/auth/[...auth0].ts`
```typescript
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
    },
  }),
});
```

### Next.js — `pages/api/token.ts`
```typescript
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function token(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ['openid', 'profile'],
  });
  res.json({ accessToken });
});
```

### Axios interceptor — `apps/web/lib/api.ts`
```typescript
import axios from 'axios';

// Module-level token getter — initialized once in _app.tsx
let getTokenFn: (() => Promise<string | undefined>) | null = null;

export function initTokenGetter(fn: () => Promise<string | undefined>) {
  getTokenFn = fn;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Initialize in `_app.tsx`:
```typescript
// In _app.tsx, inside the component
useEffect(() => {
  initTokenGetter(async () => {
    const res = await fetch('/api/token');
    const { accessToken } = await res.json();
    return accessToken;
  });
}, []);
```

### Express auth middleware — `apps/api/src/middleware/auth.middleware.ts`
```typescript
import { auth } from 'express-oauth2-jwt-bearer';
import { prisma } from '../lib/prisma';
import type { RequestHandler } from 'express';

export const verifyToken = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

export const attachProfile: RequestHandler = async (req, res, next) => {
  try {
    const auth0UserId = req.auth?.payload.sub as string;
    const profile = await prisma.profile.findUnique({ where: { auth0UserId } });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    if (profile.banned) return res.status(403).json({ error: 'Account suspended' });

    (req as any).profile = profile;
    next();
  } catch (err) {
    next(err);
  }
};

// Combined middleware — use on all protected routes
export const requireAuth = [verifyToken, attachProfile];
```

---

## 7. Express API Server

### Entry point — `apps/api/src/index.ts`
```typescript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error.middleware';
import taskRoutes from './routes/tasks.routes';
import applicationRoutes from './routes/applications.routes';
import reviewRoutes from './routes/reviews.routes';
import userRoutes from './routes/users.routes';
import notificationRoutes from './routes/notifications.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/tasks', taskRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorMiddleware);

app.listen(process.env.API_PORT || 4000, () => {
  console.log(`API running on port ${process.env.API_PORT || 4000}`);
});
```

### API Endpoint Reference

#### Tasks — `/api/tasks`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List tasks with filters + full-text search |
| GET | `/:id` | Public | Single task with relations |
| POST | `/` | Required | Create task |
| PATCH | `/:id` | Poster only | Update task (field restrictions by status) |
| DELETE | `/:id` | Poster / Admin | Cancel task |

**Query params for `GET /`:**
- `search` — full-text search on title + description
- `type` — `paid` or `community`
- `skills` — comma-separated skill tags
- `remote` — `true` or `false`
- `status` — `open`, `in_progress`, `completed`, `cancelled`
- `page`, `limit` — pagination

#### Applications — `/api/applications`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Submit application or nomination |
| GET | `/task/:taskId` | Poster only | All applications for a task |
| PATCH | `/:id/accept` | Poster only | Accept application; assigns task |
| PATCH | `/:id/reject` | Poster only | Reject one application |

**POST body:**
```json
{
  "taskId": "clxxx",
  "type": "nomination",
  "nominatedUserId": "clyyy",
  "coverNote": "Alice would be perfect for this because..."
}
```

**Guards enforced in `applications.service.ts`:**
- Cannot apply to own task
- `@@unique([taskId, applicantId])` — one submission per user per task
- Task must have status `OPEN`
- `nominatedUserId` required when `type = NOMINATION`

#### Reviews — `/api/reviews`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Submit review (poster ↔ assignee, COMPLETED tasks only) |
| GET | `/user/:profileId` | Public | All reviews for a user |

#### Users — `/api/users`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | User directory with search + filters |
| GET | `/me` | Required | Current user's full profile |
| GET | `/:username` | Public | Public profile + stats |
| POST | `/profile` | Required | Create profile (onboarding) |
| PATCH | `/me` | Required | Update own profile |

#### Notifications — `/api/notifications`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Required | Paginated notification list |
| GET | `/unread-count` | Required | `{ count: number }` |
| PATCH | `/read-all` | Required | Mark all as read |
| PATCH | `/:id/read` | Required | Mark one as read |

#### Admin — `/api/admin`
All routes require `role = ADMIN`

| Method | Path | Description |
|---|---|---|
| GET | `/stats` | Platform overview stats |
| GET | `/users` | All users (paginated) |
| PATCH | `/users/:id/ban` | Ban a user |
| PATCH | `/users/:id/unban` | Unban a user |
| GET | `/tasks` | All tasks (paginated) |
| DELETE | `/tasks/:id` | Remove any task |

---

## 8. Next.js Frontend

### Project structure — `apps/web/`
```
pages/
├── _app.tsx                  UserProvider, QueryClientProvider, token initializer
├── _document.tsx
├── index.tsx                 Landing / hero page
├── onboarding.tsx            Post-signup profile setup (username, bio, skills)
├── tasks/
│   ├── index.tsx             Public task feed (SSR)
│   ├── new.tsx               Create task — withPageAuthRequired
│   └── [id]/
│       ├── index.tsx         Task detail
│       └── edit.tsx          Edit task — poster only
├── u/[username].tsx          Public user profile
├── users/index.tsx           User directory
├── notifications.tsx         Full notification history — withPageAuthRequired
├── admin/
│   ├── index.tsx             Stats dashboard
│   ├── users.tsx             User management
│   └── tasks.tsx             Task management
└── api/
    ├── auth/[...auth0].ts    Auth0 universal handler
    └── token.ts              Access token endpoint
```

### Page summary

#### `/tasks` — Task Feed
- `getServerSideProps` fetches first page of tasks with current URL query params
- Hydrates TanStack Query cache for immediate render
- `TaskFilters` (client component) updates URL params via `router.push` — triggers re-fetch
- Unauthenticated users see all tasks; CTA buttons show a sign-in modal

#### `/tasks/[id]` — Task Detail
- `getServerSideProps` fetches task + poster profile
- Non-poster authenticated user sees:
  - **Apply** button → `ApplicationForm` modal (cover note field)
  - **Nominate Someone** button → `NominationForm` modal (debounced `GET /api/users?search=` + cover note)
- Poster sees `ApplicationPanel` — two tabs: **Applications** | **Nominations**, each with Accept / Reject actions
- Status badge; poster controls lifecycle via a status dropdown (transitions enforced server-side)

#### `/onboarding`
- Shown after first Auth0 login when `profile.username` is null
- Fields: username (real-time uniqueness check on blur), bio, skills tag input, location
- On submit: `POST /api/users/profile` → redirect to `/tasks`

#### `/u/[username]` — User Profile
- Public page: avatar, name, bio, skill chips, location, star rating, review count
- Tabs: Posted Tasks | Completed Tasks | Reviews Received
- Own profile adds an "Edit Profile" button → `ProfileEditModal`

### Key components

#### `ApplicationPanel.tsx`
```
Props: taskId, posterId
State: selected tab (Applications | Nominations)
Queries: GET /api/applications/task/:taskId
Actions: accept(applicationId), reject(applicationId)

Nomination display:
  "Nominated by @{applicant.username} → @{nominatedUser.username}"
  Cover note from nominator
  Accept button sets task.assignedToId = nominatedUser.id
```

#### `NominationForm.tsx`
```
State: searchQuery (debounced 300ms), selectedUser, coverNote
Query: GET /api/users?search={query} (fires when searchQuery.length >= 2)
Renders: search results as user cards with "Select" button
On submit: POST /api/applications { type: 'nomination', nominatedUserId, coverNote }
```

#### `NotificationBell.tsx`
```
Polls: GET /api/notifications/unread-count every 30s
Zustand store: notifications.store.ts holds unread count
Renders: bell icon with badge count
Click: opens NotificationDropdown
```

#### `TagInput.tsx`
```
Props: value (string[]), onChange
Behaviour: Enter/comma adds tag; × removes tag; autocomplete from existing task skills
Used in: task creation form, profile edit modal, user directory filters
```

### Hooks

```typescript
// useCurrentProfile.ts
// Combines Auth0 useUser with a fetch of the full Profile row
export function useCurrentProfile() {
  const { user, isLoading: authLoading } = useUser();
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => api.get('/api/users/me').then(r => r.data),
    enabled: !!user,
  });
  return { profile, isLoading: authLoading || profileLoading };
}
```

```typescript
// useNotifications.ts
// Manages unread count polling + notification list
export function useNotifications() {
  const setUnread = useNotificationsStore(s => s.setUnread);

  useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => api.get('/api/notifications/unread-count').then(r => r.data.count),
    refetchInterval: 30_000,
    onSuccess: setUnread,
  });

  // ... notification list query and mutation helpers
}
```

---

## 9. Core Feature Logic

### Task lifecycle

```
OPEN
 │
 ├─ poster accepts application ──▶ IN_PROGRESS
 │                                      │
 ├─ poster / admin cancels ────▶ CANCELLED
 │                                      │
 └──────────────────────────────▶ COMPLETED (poster marks done)
                                         │
                                  both parties prompted to review
```

**Status transition enforcement** in `tasks.service.ts`:
```typescript
const ALLOWED_TRANSITIONS = {
  OPEN: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

function assertTransition(from: TaskStatus, to: TaskStatus) {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new AppError(400, `Cannot transition from ${from} to ${to}`);
  }
}
```

### Nomination flow — full detail

```
Nominator submits:
  POST /api/applications
  { taskId, type: NOMINATION, nominatedUserId, coverNote }
          │
          ├─ Guard: nominator !== poster
          ├─ Guard: task.status === OPEN
          ├─ Guard: @@unique [taskId, applicantId] — one record per nominator per task
          ├─ Guard: nominatedUserId must belong to a real, non-banned Profile
          │
          ├─ Creates Application row
          │   applicantId     = nominator.id
          │   nominatedUserId = nominated person's id
          │   type            = NOMINATION
          │
          └─ Creates Notification for nominated user
              type: NEW_NOMINATION
              payload: { taskId, nominatorId, nominatorUsername, taskTitle }


Poster accepts nomination:
  PATCH /api/applications/:id/accept
          │
          ├─ task.assignedToId = application.nominatedUserId  ← NOT applicantId
          ├─ task.status       = IN_PROGRESS
          ├─ All other applications for this task → REJECTED
          │
          ├─ Notification → nominated user   (APPLICATION_ACCEPTED)
          ├─ Notification → nominator        (TASK_ASSIGNED — courtesy)
          └─ Notification → rejected applicants (APPLICATION_REJECTED)
```

### Review eligibility
```typescript
async function canReview(reviewerId: string, taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (task?.status !== 'COMPLETED') throw new AppError(400, 'Task not completed');

  const isParty = task.posterId === reviewerId || task.assignedToId === reviewerId;
  if (!isParty) throw new AppError(403, 'Only poster or assignee can review');

  const existing = await prisma.review.findUnique({
    where: { taskId_reviewerId: { taskId, reviewerId } },
  });
  if (existing) throw new AppError(409, 'Already reviewed');
}
```

### Profile onboarding guard
In `getServerSideProps` of any auth-protected page:
```typescript
const session = await getSession(req, res);
if (!session) return { redirect: { destination: '/api/auth/login' } };

const profile = await fetchProfile(session.user.sub);
if (!profile?.username) {
  return { redirect: { destination: '/onboarding' } };
}
```

---

## 10. Email Notifications

### Setup — `apps/api/src/lib/email.ts`
```typescript
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);
```

### Email triggers by notification type

| Notification type | Recipient | Subject |
|---|---|---|
| `NEW_APPLICATION` | Task poster | Someone applied to your task |
| `NEW_NOMINATION` | Nominated user | You've been nominated for a task |
| `APPLICATION_ACCEPTED` | Applicant / nominated user | You've been selected |
| `APPLICATION_REJECTED` | Applicant | An update on your application |
| `TASK_COMPLETED` | Poster + assignee | Leave a review |
| `NEW_REVIEW` | Reviewee | You received a new review |

### `email.service.ts` pattern
```typescript
export async function sendNotificationEmail(
  notification: Notification & { user: Profile }
) {
  const { type, payload, user } = notification;

  const templates: Record<NotificationType, EmailTemplate> = {
    NEW_APPLICATION: {
      subject: `New application for "${(payload as any).taskTitle}"`,
      html: newApplicationTemplate(payload as any),
    },
    // ... other types
  };

  const template = templates[type];
  if (!template) return;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: user.email, // fetched from Auth0 Management API or stored on Profile
    subject: template.subject,
    html: template.html,
  });
}
```

> **Note:** Auth0 manages email addresses. Either store the email on the `Profile` model during onboarding, or call the Auth0 Management API to retrieve it. Storing it on `Profile` is simpler and avoids an extra API call per email send.

---

## 11. Admin Panel

### Access control
- `profile.role` must be `ADMIN`
- Set via a direct DB update (no UI for role promotion — admin access is infrastructure-level)
- Express `admin.middleware.ts` reads the `https://taskboard.app/role` custom claim from the JWT (set by the Auth0 Post-Login Action) — no extra DB query needed

```typescript
// admin.middleware.ts
export const requireAdmin: RequestHandler = (req, res, next) => {
  const role = req.auth?.payload['https://taskboard.app/role'];
  if (role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  next();
};
```

### Admin pages

#### `/admin` — Stats dashboard
```
Total users          [count]
Total tasks          [count]
  Open               [count]
  In Progress        [count]
  Completed          [count]
  Cancelled          [count]
Applications today   [count]
Reviews today        [count]
```

#### `/admin/users` — User management
- Table: username, full name, email, role, status (active/banned), joined date, task count
- Actions: Ban / Unban

#### `/admin/tasks` — Task management
- Table: title, type, poster, status, created date, application count
- Actions: Cancel / Delete

---

## 12. Environment Variables

File: `.env.example` (copy to `.env` and fill in values)

```bash
# ─── Database ────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/taskboard

# ─── Auth0 ───────────────────────────────────────────────
# From Auth0 dashboard > Applications > Your App > Settings
AUTH0_SECRET=                        # 32+ random bytes: openssl rand -hex 32
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_TENANT.auth0.com
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# From Auth0 dashboard > APIs > TaskBoard API > Settings
AUTH0_AUDIENCE=https://api.taskboard.app

# ─── API server ──────────────────────────────────────────
API_PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000

# ─── Email ───────────────────────────────────────────────
RESEND_API_KEY=
EMAIL_FROM=noreply@taskboard.app

# ─── App ─────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 13. Build Order

Build in this exact sequence to avoid dependency and auth debugging hell:

### Phase 1 — Infrastructure
1. Monorepo setup — root `package.json`, workspaces, `concurrently` dev script
2. Prisma schema + `prisma migrate dev` + `seed.ts`
3. Auth0 dashboard — Application, API (with audience), Post-Login Action

### Phase 2 — Auth plumbing
4. Express bootstrap + `express-oauth2-jwt-bearer` middleware + error handler
5. Next.js `[...auth0].ts` handler + `UserProvider` in `_app.tsx`
6. `/pages/api/token.ts` endpoint
7. Axios interceptor in `lib/api.ts`
8. Verify the full auth flow end-to-end before building any features

### Phase 3 — Profile sync
9. `POST /api/users/profile` endpoint (creates Profile on first login)
10. `/onboarding` page with `getServerSideProps` guard
11. `useCurrentProfile` hook
12. Update Auth0 `app_metadata.profileId` and `app_metadata.role` after profile creation (via Auth0 Management API call in the Express service)

### Phase 4 — Core features
13. Tasks CRUD + full-text search
14. Applications — self-apply flow end-to-end
15. Nominations — nominate flow end-to-end
16. Application acceptance — task assignment + bulk rejection + notifications
17. Task lifecycle — status transitions + mark complete
18. Reviews — submission + rating recalculation trigger

### Phase 5 — Supporting features
19. User profiles + user directory
20. Notifications — in-app polling + email via Resend
21. Task feed — SSR + client-side filters
22. Task detail — full interactive UI

### Phase 6 — Admin + polish
23. Admin panel
24. Empty states, loading skeletons, error boundaries
25. Dark mode (`next-themes`)
26. Mobile responsiveness audit
27. Auth0 Action for role custom claim — wire up admin middleware

---

## 14. Deployment

### Services needed
| Service | What it hosts | Recommended provider |
|---|---|---|
| Next.js frontend | `apps/web` | Vercel |
| Express API | `apps/api` | Railway or Render |
| PostgreSQL | Database | Railway (managed) or Supabase (Postgres-only) |
| Auth0 | Auth | Auth0 (free tier sufficient for MVP) |
| Resend | Email | Resend (free tier: 3,000 emails/month) |

### Vercel (frontend)
1. Connect `apps/web` directory as root
2. Add all `NEXT_PUBLIC_*` and Auth0 env vars in Vercel dashboard
3. Update Auth0 Application — add production URLs to Callback, Logout, and Web Origins
4. Update `AUTH0_BASE_URL` to production URL

### Railway (API + DB)
1. Create a PostgreSQL database service — copy `DATABASE_URL`
2. Create a Node.js service pointing to `apps/api`
3. Add all API env vars
4. Set start command: `node dist/index.js`
5. Run migrations on deploy: add `npx prisma migrate deploy` as a pre-start command
6. Update `NEXT_PUBLIC_API_URL` on Vercel to the Railway API URL
7. Update CORS `origin` in Express to the Vercel production URL

### Auth0 production checklist
- [ ] Update Application callback/logout/origins URLs to production domains
- [ ] Verify Post-Login Action is deployed and active
- [ ] Confirm `AUTH0_AUDIENCE` matches the API identifier exactly
- [ ] Test that access tokens contain the namespaced custom claims
- [ ] Set `AUTH0_SECRET` to a new random value (not the dev one)

---

*Generated for TaskBoard — Next.js Pages Router · Auth0 · Express · PostgreSQL · Prisma*
