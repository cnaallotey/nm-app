# Admin Platform Implementation Guide — Firebase

A step-by-step guide to add a Firebase-backed admin platform to this app so you can
manage **listings** and **form submissions** (inquiries, showing requests, detail
requests) without touching code.

This guide is written specifically for **this codebase**:

- Next.js `^15.1.0` (App Router, `src/app/`)
- React `^19`
- Tailwind CSS v4
- Radix / shadcn UI primitives already in `src/app/components/ui/`
- `sonner` for toasts, `react-hook-form` for forms, `lucide-react` for icons
- Brand: **Nouvelle Maison Ltd.**, Accra — prices in `GH₵`, gold accent `#C9A96E`, dark `#1A1A1A` / `#0F0F0F`

---

## 0. What we're building

| Public site (today) | After this guide |
| --- | --- |
| Listings hardcoded in `FeaturedProperties.tsx`, `ListingsPage.tsx`, `PropertyDetailPage.tsx` | Listings read from **Firestore** |
| Forms (`ContactForm`, `ScheduleShowingModal`, `RequestDetailsModal`) do nothing on submit | Forms **write to Firestore** |
| No back office | `/admin` area: login, dashboard, listing CRUD + image upload, submissions inbox |

Firebase products used:

- **Firestore** — listings + submissions database
- **Authentication** — admin login (email/password)
- **Storage** — property image uploads
- **Security Rules** — public can read listings + create submissions; only admins can write/manage
- (optional) **Cloud Functions** — email notification on new submission

---

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> → **Add project** (e.g. `nouvelle-maison`).
2. Disable Google Analytics unless you want it.
3. In the project: **Build → Firestore Database → Create database** → Production mode → region `eur3` or nearest.
4. **Build → Authentication → Get started → Email/Password → Enable.**
5. **Build → Storage → Get started** (start in production mode).
6. **Project settings (gear) → General → Your apps → Web (`</>`)** → register app → copy the config object.

### Create your first admin user

In **Authentication → Users → Add user**, create your own login (email + password).
We'll grant it admin rights with a **custom claim** in Step 8.

---

## 2. Install dependencies

```bash
yarn add firebase
# Server-side admin (API routes / scripts / setting claims):
yarn add firebase-admin
```

---

## 3. Environment variables

Create `.env.local` in the project root (already git-ignored by Next.js conventions —
confirm it's in `.gitignore`):

```bash
# --- Client (safe to expose; these are public by design) ---
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nouvelle-maison.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nouvelle-maison
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nouvelle-maison.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# --- Server only (NEVER prefix with NEXT_PUBLIC) ---
# From Firebase console → Project settings → Service accounts → Generate new private key
FIREBASE_ADMIN_PROJECT_ID=nouvelle-maison
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@nouvelle-maison.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> The private key contains literal `\n`. Keep the quotes and replace newlines with `\n`
> as shown, then convert back at runtime (see `lib/firebase-admin.ts`).

---

## 4. Firebase client SDK

Create `src/lib/firebase.ts`:

```ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Avoid re-initializing during Next.js hot reload / RSC
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## 5. Firebase Admin SDK (server)

Create `src/lib/firebase-admin.ts` — used by API routes for verifying sessions and
privileged writes:

```ts
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app: App =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
```

---

## 6. Data model (Firestore)

Two top-level collections. Field names below match the **current code** so migration is mechanical.

### `listings/{listingId}`

Derived from `FeaturedProperties.tsx`, `ListingsPage.tsx`, and `PropertyDetailPage.tsx`.

```ts
// src/lib/types.ts
import { Timestamp } from "firebase/firestore";

export interface Listing {
  id: string;                 // slug, e.g. "villa-serena" — used in /property/[id]
  title: string;              // "Villa Serena"
  location: string;           // "East Legon, Accra"
  price: string;              // "GH₵ 12,500,000"  (kept as display string, as today)
  priceSubtext?: string;      // "Approx. $980,000 | £780,000"
  beds: number;               // 7
  baths: number;              // 9
  sqft: string;               // "27,000"
  description: string;        // long multi-paragraph text
  images: string[];           // Storage download URLs; images[0] = cover (the `image` field today)
  amenities?: string[];       // optional, drives AmenitiesGrid
  yearBuilt?: number;
  status: "published" | "draft" | "sold";
  featured: boolean;          // show in FeaturedProperties on the landing page
  order?: number;             // manual sort
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

> **Why `price` stays a string:** the public components render `GH₵ 12,500,000` verbatim.
> Keep it as-is for a zero-risk migration. If you later want sorting/filtering by price,
> add a numeric `priceValue: number` field alongside it.

### `submissions/{submissionId}`

One collection for all three forms, discriminated by `type`. Fields below are taken
directly from `ContactForm.tsx`, `ScheduleShowingModal.tsx`, `RequestDetailsModal.tsx`.

```ts
export type SubmissionType = "inquiry" | "showing" | "details";

export interface Submission {
  id: string;
  type: SubmissionType;

  // common to all three forms
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;          // ContactForm "message", modal "notes"/"message"

  // showing-only (ScheduleShowingModal)
  preferredDate?: string;    // showing-date
  preferredTime?: string;    // showing-time

  // context
  propertyId?: string;       // which listing the form was about
  propertyTitle?: string;    // e.g. "Villa Serena" (denormalized for the inbox)
  consent: boolean;

  // workflow
  status: "new" | "read" | "contacted" | "archived";
  source: string;            // page/component the form lived on
  createdAt: Timestamp;
}
```

---

## 7. Security Rules

### Firestore — `firestore.rules`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // Listings: world-readable, admin-writable
    match /listings/{id} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Submissions: anyone can create (public forms), only admins can read/manage
    match /submissions/{id} {
      allow create: if
        request.resource.data.consent == true &&
        request.resource.data.email is string &&
        request.resource.data.firstName is string &&
        request.resource.data.status == "new";
      allow read, update, delete: if isAdmin();
    }
  }
}
```

### Storage — `storage.rules`

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /listings/{allPaths=**} {
      allow read: if true;                 // public property images
      allow write: if request.auth != null
                   && request.auth.token.admin == true;
    }
  }
}
```

Deploy rules from the console (Firestore → Rules / Storage → Rules) or via the CLI:

```bash
npm i -g firebase-tools
firebase login
firebase init firestore storage   # in project root, choose existing project
firebase deploy --only firestore:rules,storage:rules
```

---

## 8. Admin access via custom claims

Anyone with a Firebase login is just a user. Make yourself an **admin** by setting a
custom claim. Create a one-off script `scripts/set-admin.mjs`:

```js
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import "dotenv/config";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const email = process.argv[2];
const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, { admin: true });
console.log(`✅ ${email} is now an admin`);
process.exit(0);
```

Run it:

```bash
node scripts/set-admin.mjs you@nouvellemaison.com
```

The user must **sign out and back in** for the new claim to appear in their token.

---

## 9. Wiring the public forms to Firestore

Replace the inert `<form>` handlers. Example for `ContactForm.tsx` — convert it to a
client component and submit to Firestore (rules already restrict it safely):

```tsx
"use client";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

// inside the component:
const [submitting, setSubmitting] = useState(false);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  if (!fd.get("consent")) return toast.error("Please accept the consent notice.");

  setSubmitting(true);
  try {
    await addDoc(collection(db, "submissions"), {
      type: "inquiry",
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      propertyTitle: "Villa Serena",
      consent: true,
      status: "new",
      source: "ContactForm",
      createdAt: serverTimestamp(),
    });
    toast.success("Inquiry sent. We'll be in touch within 24 hours.");
    e.currentTarget.reset();
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
  }
}
```

> Add `name="firstName"` etc. to each input (they currently only have `id`), set the
> form's `onSubmit={handleSubmit}`, and disable the button while `submitting`.
> Repeat for `ScheduleShowingModal` (`type: "showing"`, plus `preferredDate`/`preferredTime`)
> and `RequestDetailsModal` (`type: "details"`).

### Reading listings on the public site

Swap the hardcoded arrays for a fetch. Server component example:

```tsx
import { adminDb } from "@/lib/firebase-admin";

async function getFeatured() {
  const snap = await adminDb
    .collection("listings")
    .where("status", "==", "published")
    .where("featured", "==", true)
    .orderBy("order")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
```

(Or use the client SDK with `onSnapshot` if you want live updates.)

---

## 10. The admin area

### Route structure (`src/app/admin/`)

```
src/app/admin/
  layout.tsx              // admin shell: sidebar + auth guard (client)
  login/page.tsx          // email/password sign-in
  page.tsx                // dashboard (counts: listings, new submissions)
  listings/
    page.tsx              // table of listings + "New" button
    new/page.tsx          // create form
    [id]/page.tsx         // edit form (reuse ListingForm)
  submissions/
    page.tsx              // inbox: filter by type/status
    [id]/page.tsx         // submission detail + status controls
```

### Auth context

Create `src/app/admin/AuthGuard.tsx` (client):

```tsx
"use client";
import { useEffect, useState } from "react";
import { onIdTokenChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onIdTokenChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdTokenResult();
        setIsAdmin(token.claims.admin === true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  return { user, isAdmin, loading, logout: () => signOut(auth) };
}
```

In `admin/layout.tsx`, call `useAdminAuth()`; while `loading` show a spinner; if
`!user || !isAdmin` redirect to `/admin/login`. (Login page itself bypasses the guard.)

> **Defense in depth:** the guard is UX only — real protection is the Firestore/Storage
> rules from Step 7. Never rely on hiding the UI alone.

### Login page

```tsx
"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
// form with email + password → signInWithEmailAndPassword(auth, email, pw)
// on success → router.push("/admin")
```

### Listing form + image upload

Use `react-hook-form` (already installed). For images, upload to Storage and store the
download URL:

```tsx
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

async function uploadImage(file: File, listingId: string) {
  const path = `listings/${listingId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef); // push into listing.images[]
}
```

Then `setDoc(doc(db, "listings", id), data)` to create/update (use the slug as the
doc id so `/property/[id]` keeps working).

### Submissions inbox

```tsx
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
// query(collection(db,"submissions"), orderBy("createdAt","desc"))
// filter chips by type ("inquiry"|"showing"|"details") and status ("new"|...)
// row click → detail page; buttons set status: read / contacted / archived
```

Reuse `src/app/components/ui/table.tsx`, `badge.tsx`, `select.tsx`, `dialog.tsx` for a
consistent look with the rest of the app.

---

## 11. Reuse the existing design system

The admin should feel like the site. Reuse:

- **Colors:** gold `#C9A96E`, dark surfaces `#1A1A1A` / `#0F0F0F`, white at low opacity for text.
- **Fonts:** `Cormorant Garamond` (headings), `Montserrat` (UI/labels) — already loaded.
- **Primitives:** everything in `src/app/components/ui/` (button, card, table, dialog, select, badge, sonner toasts).
- **Path alias:** confirm `@/*` → `src/*` in `tsconfig.json`; if absent, the snippets use `@/lib/...`.

---

## 12. (Optional) Email notification on new submission

Cloud Function so you get an email when a form comes in:

```ts
// functions/src/index.ts
import { onDocumentCreated } from "firebase-functions/v2/firestore";
// import an email provider (Resend, SendGrid, nodemailer + SMTP)

export const notifyOnSubmission = onDocumentCreated(
  "submissions/{id}",
  async (event) => {
    const s = event.data?.data();
    // send email to sales@nouvellemaison.com with s.firstName, s.email, s.type, ...
  }
);
```

Deploy: `firebase deploy --only functions`.

---

## 13. Build order (checklist)

- [ ] Create Firebase project; enable Firestore, Auth (email/pw), Storage
- [ ] Add `firebase` + `firebase-admin`; set `.env.local`
- [ ] Add `src/lib/firebase.ts`, `src/lib/firebase-admin.ts`, `src/lib/types.ts`
- [ ] Deploy Firestore + Storage rules (Step 7)
- [ ] Create admin user; run `set-admin.mjs`; re-login
- [ ] Build `/admin/login` + `AuthGuard` + `/admin/layout.tsx`
- [ ] Build listings CRUD (`/admin/listings/*`) with image upload
- [ ] Build submissions inbox (`/admin/submissions/*`)
- [ ] Migrate hardcoded listings into Firestore (script reading current `featuredProperties` array)
- [ ] Wire public forms to write `submissions`
- [ ] Swap public components to read listings from Firestore
- [ ] (Optional) email-notification Cloud Function

---

## 14. Migration script for existing listings

One-off to seed Firestore from today's hardcoded data:

```js
// scripts/seed-listings.mjs  — run with: node scripts/seed-listings.mjs
import { adminDb } from "../src/lib/firebase-admin.js"; // or inline admin init
const listings = [
  {
    id: "villa-serena",
    title: "Villa Serena",
    location: "East Legon, Accra",
    price: "GH₵ 12,500,000",
    priceSubtext: "Approx. $980,000 | £780,000",
    beds: 7, baths: 9, sqft: "27,000",
    images: [/* the 4 Unsplash URLs from PropertyDetailPage */],
    description: "Villa Serena represents the pinnacle of luxury living...",
    status: "published", featured: true, order: 1,
  },
  // ...modern-estate, waterfront-penthouse, contemporary-villa
];
for (const l of listings) {
  await adminDb.collection("listings").doc(l.id)
    .set({ ...l, createdAt: new Date(), updatedAt: new Date() });
}
```

---

## 15. Notes & gotchas

- **`next.config.ts` image domains:** if you keep Unsplash + add Firebase Storage and
  use `next/image`, add `images.unsplash.com` and `firebasestorage.googleapis.com` to
  `images.remotePatterns`.
- **RSC vs client:** the client SDK (`firebase/*`) only runs in `"use client"` components
  or the browser. For server components / API routes use `firebase-admin`.
- **Never expose** `FIREBASE_ADMIN_PRIVATE_KEY` to the client — no `NEXT_PUBLIC_` prefix.
- **Cost:** Firestore + Storage free tier (Spark) is plenty for a single brokerage site.
  Cloud Functions require the Blaze (pay-as-you-go) plan.
- **Backups:** enable scheduled Firestore exports if listings become business-critical.
