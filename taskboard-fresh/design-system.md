# TaskBoard — Design System

> Bold, expressive, accent-heavy UI · Plus Jakarta Sans · Violet/Purple · Cool blue-gray neutrals · Rounded corners · Full dark/light system preference support

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius](#5-border-radius)
6. [Shadows & Elevation](#6-shadows--elevation)
7. [Component Patterns](#7-component-patterns)
8. [Iconography](#8-iconography)
9. [Motion & Animation](#9-motion--animation)
10. [Dark Mode](#10-dark-mode)
11. [Tailwind Config](#11-tailwind-config)
12. [shadcn/ui Theming](#12-shadcnui-theming)
13. [Page-by-Page UI Guidelines](#13-page-by-page-ui-guidelines)
14. [Accessibility](#14-accessibility)

---

## 1. Design Principles

### Bold by default
TaskBoard is not a quiet product. Typography is large, accent colors are used liberally, and interactive elements have clear presence. Avoid washed-out or overly neutral UIs.

### Expressive but structured
Boldness is balanced with a clear grid, consistent spacing, and predictable component behavior. Every element earns its space.

### Information hierarchy first
Users scanning the task feed need to extract key info in under two seconds. Every card, page, and modal is designed around the most important piece of information being immediately obvious.

### Dark and light are equals
Both modes are fully designed — not afterthoughts. No component should look broken or low-contrast in either mode.

### Accessible always
WCAG AA contrast minimums are non-negotiable. Interactive targets are touch-friendly. Motion is reduced on request.

---

## 2. Color System

### Approach
- **Neutrals**: cool blue-gray (Slate family from Tailwind)
- **Primary accent**: Violet/Purple — used for CTAs, active states, highlights
- **Semantic colors**: green (success), amber (warning), red (destructive)
- All colors are defined as CSS custom properties and mapped to Tailwind via the config

### CSS Custom Properties

Define in `apps/web/styles/globals.css`:

```css
@layer base {
  :root {
    /* ── Neutrals (cool blue-gray / Slate) ── */
    --color-bg:           #f8fafc;   /* slate-50  — page background */
    --color-bg-subtle:    #f1f5f9;   /* slate-100 — section backgrounds */
    --color-surface:      #ffffff;   /* white     — cards, modals */
    --color-surface-raised: #ffffff; /* white     — elevated cards */
    --color-border:       #e2e8f0;   /* slate-200 */
    --color-border-strong:#cbd5e1;   /* slate-300 */

    --color-text-primary: #0f172a;   /* slate-900 */
    --color-text-secondary:#475569;  /* slate-600 */
    --color-text-tertiary: #94a3b8;  /* slate-400 */
    --color-text-disabled: #cbd5e1;  /* slate-300 */
    --color-text-inverse:  #ffffff;

    /* ── Violet / Purple accent ── */
    --color-accent:        #7c3aed;  /* violet-600 — primary CTA */
    --color-accent-hover:  #6d28d9;  /* violet-700 */
    --color-accent-active: #5b21b6;  /* violet-800 */
    --color-accent-subtle: #ede9fe;  /* violet-100 — tinted backgrounds */
    --color-accent-muted:  #ddd6fe;  /* violet-200 — borders, chips */
    --color-accent-text:   #5b21b6;  /* violet-800 — text on light bg */
    --color-accent-fg:     #ffffff;  /* text on accent bg */

    /* ── Semantic ── */
    --color-success:       #10b981;  /* emerald-500 */
    --color-success-subtle:#d1fae5;  /* emerald-100 */
    --color-success-text:  #065f46;  /* emerald-900 */

    --color-warning:       #f59e0b;  /* amber-500 */
    --color-warning-subtle:#fef3c7;  /* amber-100 */
    --color-warning-text:  #78350f;  /* amber-900 */

    --color-danger:        #ef4444;  /* red-500 */
    --color-danger-hover:  #dc2626;  /* red-600 */
    --color-danger-subtle: #fee2e2;  /* red-100 */
    --color-danger-text:   #7f1d1d;  /* red-900 */

    --color-info:          #3b82f6;  /* blue-500 */
    --color-info-subtle:   #dbeafe;  /* blue-100 */
    --color-info-text:     #1e3a8a;  /* blue-900 */

    /* ── Task type badges ── */
    --color-paid-bg:       #ede9fe;  /* violet-100 */
    --color-paid-text:     #5b21b6;  /* violet-800 */
    --color-paid-border:   #ddd6fe;  /* violet-200 */

    --color-community-bg:  #d1fae5;  /* emerald-100 */
    --color-community-text:#065f46;  /* emerald-900 */
    --color-community-border:#a7f3d0;/* emerald-200 */

    /* ── Task status badges ── */
    --color-status-open:         #dbeafe; /* blue-100   */
    --color-status-open-text:    #1e40af; /* blue-800   */
    --color-status-progress:     #fef3c7; /* amber-100  */
    --color-status-progress-text:#92400e; /* amber-800  */
    --color-status-completed:    #d1fae5; /* emerald-100*/
    --color-status-completed-text:#065f46;/* emerald-900*/
    --color-status-cancelled:    #f1f5f9; /* slate-100  */
    --color-status-cancelled-text:#475569;/* slate-600  */
  }

  .dark {
    /* ── Neutrals ── */
    --color-bg:            #0a0a0f;  /* near-black with cool tint */
    --color-bg-subtle:     #111118;  /* slightly lifted */
    --color-surface:       #16161f;  /* cards, modals */
    --color-surface-raised:#1e1e2a;  /* elevated cards */
    --color-border:        #2a2a3a;
    --color-border-strong: #3a3a50;

    --color-text-primary:  #f1f5f9;  /* slate-100 */
    --color-text-secondary:#94a3b8;  /* slate-400 */
    --color-text-tertiary: #475569;  /* slate-600 */
    --color-text-disabled: #334155;  /* slate-700 */
    --color-text-inverse:  #0f172a;

    /* ── Violet / Purple accent (slightly brighter in dark) ── */
    --color-accent:        #8b5cf6;  /* violet-500 */
    --color-accent-hover:  #7c3aed;  /* violet-600 */
    --color-accent-active: #6d28d9;  /* violet-700 */
    --color-accent-subtle: #1e1033;  /* deep violet tint */
    --color-accent-muted:  #2d1b54;  /* violet tinted border */
    --color-accent-text:   #c4b5fd;  /* violet-300 — text on dark bg */
    --color-accent-fg:     #ffffff;

    /* ── Semantic (dark) ── */
    --color-success:       #34d399;
    --color-success-subtle:#052e16;
    --color-success-text:  #6ee7b7;

    --color-warning:       #fbbf24;
    --color-warning-subtle:#1c0a00;
    --color-warning-text:  #fde68a;

    --color-danger:        #f87171;
    --color-danger-hover:  #ef4444;
    --color-danger-subtle: #2d0a0a;
    --color-danger-text:   #fca5a5;

    --color-info:          #60a5fa;
    --color-info-subtle:   #0c1a3a;
    --color-info-text:     #93c5fd;

    /* ── Task type badges (dark) ── */
    --color-paid-bg:       #1e1033;
    --color-paid-text:     #c4b5fd;
    --color-paid-border:   #2d1b54;

    --color-community-bg:  #052e16;
    --color-community-text:#6ee7b7;
    --color-community-border:#064e3b;

    /* ── Task status badges (dark) ── */
    --color-status-open:         #0c1a3a;
    --color-status-open-text:    #93c5fd;
    --color-status-progress:     #1c0a00;
    --color-status-progress-text:#fde68a;
    --color-status-completed:    #052e16;
    --color-status-completed-text:#6ee7b7;
    --color-status-cancelled:    #111118;
    --color-status-cancelled-text:#475569;
  }
}
```

### Color usage rules

| Token | Use for |
|---|---|
| `--color-accent` | Primary buttons, links, active nav, focus rings |
| `--color-accent-subtle` | Hover backgrounds on rows, selected states |
| `--color-accent-muted` | Chip borders, tag outlines, secondary highlights |
| `--color-bg` | Page/body background |
| `--color-surface` | Cards, modals, dropdowns |
| `--color-surface-raised` | Floating elements, popovers |
| `--color-border` | Default dividers and input borders |
| `--color-text-secondary` | Supporting labels, meta info, captions |
| `--color-text-tertiary` | Placeholders, disabled labels, timestamps |

---

## 3. Typography

### Typeface

**Plus Jakarta Sans** — used for everything. Import via Google Fonts or self-host.

```html
<!-- In _document.tsx -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

```css
/* globals.css */
body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

### Type scale

| Name | Size | Weight | Line height | Use |
|---|---|---|---|---|
| `display` | 48px / 3rem | 800 | 1.1 | Hero headlines |
| `h1` | 36px / 2.25rem | 700 | 1.15 | Page titles |
| `h2` | 28px / 1.75rem | 700 | 1.2 | Section headers |
| `h3` | 22px / 1.375rem | 600 | 1.3 | Card titles, modal headers |
| `h4` | 18px / 1.125rem | 600 | 1.4 | Sub-sections |
| `body-lg` | 17px / 1.0625rem | 400 | 1.6 | Long-form descriptions |
| `body` | 15px / 0.9375rem | 400 | 1.6 | Default body text |
| `body-sm` | 13px / 0.8125rem | 400 | 1.5 | Supporting text, captions |
| `label` | 13px / 0.8125rem | 600 | 1.4 | Form labels, column headers |
| `caption` | 11px / 0.6875rem | 500 | 1.4 | Timestamps, meta, badges |
| `mono` | 13px / 0.8125rem | 400 | 1.5 | Code, IDs |

### Tailwind typography classes (add to config)

```js
// Extend fontSize in tailwind.config.js
fontSize: {
  'display': ['3rem',    { lineHeight: '1.1',  fontWeight: '800' }],
  'h1':      ['2.25rem', { lineHeight: '1.15', fontWeight: '700' }],
  'h2':      ['1.75rem', { lineHeight: '1.2',  fontWeight: '700' }],
  'h3':      ['1.375rem',{ lineHeight: '1.3',  fontWeight: '600' }],
  'h4':      ['1.125rem',{ lineHeight: '1.4',  fontWeight: '600' }],
  'body-lg': ['1.0625rem',{ lineHeight: '1.6', fontWeight: '400' }],
  'body':    ['0.9375rem',{ lineHeight: '1.6', fontWeight: '400' }],
  'body-sm': ['0.8125rem',{ lineHeight: '1.5', fontWeight: '400' }],
  'label':   ['0.8125rem',{ lineHeight: '1.4', fontWeight: '600' }],
  'caption': ['0.6875rem',{ lineHeight: '1.4', fontWeight: '500' }],
}
```

### Typography rules
- **Never use default font-size below 11px** — even for badges
- **Heading weights are 700–800** — never lighter in display contexts
- **Body text is 400** — use 500 only for emphasis within body copy, never for entire paragraphs
- **Color**: primary text on all main content; secondary on meta (posters, dates, counts); tertiary on placeholders only
- **Truncation**: task titles and descriptions truncate at 2 lines in cards (`line-clamp-2`)

---

## 4. Spacing & Layout

### Spacing scale
TaskBoard uses Tailwind's default 4px base scale. Key values:

| Token | px | Use |
|---|---|---|
| `space-1` | 4px | Icon padding, tight gaps |
| `space-2` | 8px | Internal component padding |
| `space-3` | 12px | Compact list item gaps |
| `space-4` | 16px | Default padding, card inner spacing |
| `space-5` | 20px | Section gaps within a card |
| `space-6` | 24px | Card padding (default) |
| `space-8` | 32px | Between cards / vertical rhythm |
| `space-10` | 40px | Section padding |
| `space-12` | 48px | Large section breaks |
| `space-16` | 64px | Page-level vertical padding |
| `space-20` | 80px | Hero section padding |

### Layout grid

```
Max content width:  1280px  (7xl)
Comfortable reading: 768px (prose/forms)
Narrow modals/panels: 480px

Page padding (horizontal):
  mobile:  16px (px-4)
  tablet:  24px (px-6)
  desktop: 32px (px-8)
```

### Task feed grid
```css
/* Mobile: 1 column */
/* Tablet (768px+): 2 columns */
/* Desktop (1280px+): 3 columns */

grid-template-columns:
  mobile:  1fr
  md:      repeat(2, 1fr)
  xl:      repeat(3, 1fr)

gap: 24px (gap-6)
```

### Navbar
- Height: 64px (`h-16`)
- Sticky top, backdrop blur + border bottom
- Max width: 1280px, centered
- Left: logo + primary nav links
- Right: search trigger, notification bell, user avatar

### Sidebar (Admin)
- Width: 240px fixed
- Collapsible to icon-only (64px) on mobile

---

## 5. Border Radius

```css
/* globals.css / tailwind.config.js */
borderRadius: {
  'none':  '0',
  'sm':    '6px',    /* small inputs, tight elements */
  DEFAULT: '10px',   /* default — cards, buttons, inputs */
  'md':    '12px',   /* modals, dropdowns, panels */
  'lg':    '14px',   /* large cards, featured elements */
  'xl':    '18px',   /* hero cards, big feature blocks */
  '2xl':   '24px',   /* avatars (large), image cards */
  'full':  '9999px', /* pills, tags, avatar (small) */
}
```

### Usage guide

| Element | Radius |
|---|---|
| Buttons (default) | `rounded` (10px) |
| Buttons (pill style, e.g. tags) | `rounded-full` |
| Input fields | `rounded` (10px) |
| Cards | `rounded-lg` (14px) |
| Modals / Sheets | `rounded-xl` (18px) or `rounded-t-xl` (bottom sheets) |
| Dropdowns | `rounded-md` (12px) |
| Badges / Status chips | `rounded-full` |
| Skill tags | `rounded-full` |
| Avatars (small, ≤40px) | `rounded-full` |
| Avatars (large, 80px+) | `rounded-2xl` |
| Notification bell badge | `rounded-full` |
| Toast notifications | `rounded-lg` (14px) |

---

## 6. Shadows & Elevation

```css
boxShadow: {
  'xs':  '0 1px 2px 0 rgb(0 0 0 / 0.04)',
  'sm':  '0 2px 4px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  DEFAULT:'0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  'md':  '0 8px 24px 0 rgb(0 0 0 / 0.10), 0 4px 8px -4px rgb(0 0 0 / 0.06)',
  'lg':  '0 16px 48px 0 rgb(0 0 0 / 0.14), 0 8px 16px -8px rgb(0 0 0 / 0.08)',
  'accent': '0 4px 20px 0 rgb(124 58 237 / 0.35)',  /* violet glow — primary CTA hover */
  'none':   'none',
}
```

### Elevation rules
| Level | Shadow | Use |
|---|---|---|
| 0 | none | Inline elements, flat list items |
| 1 | `shadow-xs` | Subtle card lift (default card in light mode) |
| 2 | `shadow-sm` | Hovered cards, active rows |
| 3 | `shadow` | Floating tooltips, sticky nav in light mode |
| 4 | `shadow-md` | Dropdowns, popovers |
| 5 | `shadow-lg` | Modals, command palette |

> **Dark mode note:** In dark mode, elevation is expressed primarily through background lightness (`--color-surface` → `--color-surface-raised`) rather than shadow opacity. Keep shadows subtle on dark backgrounds.

---

## 7. Component Patterns

### Buttons

**Variants:**

```tsx
// Primary — main CTA
<button className="
  bg-[var(--color-accent)] text-white
  hover:bg-[var(--color-accent-hover)]
  active:bg-[var(--color-accent-active)]
  hover:shadow-accent
  px-5 py-2.5 rounded-[10px]
  text-[15px] font-semibold
  transition-all duration-150
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
">
  Apply for Task
</button>

// Secondary — outlined
<button className="
  border border-[var(--color-border-strong)]
  bg-[var(--color-surface)]
  text-[var(--color-text-primary)]
  hover:border-[var(--color-accent-muted)]
  hover:bg-[var(--color-accent-subtle)]
  px-5 py-2.5 rounded-[10px]
  text-[15px] font-semibold
  transition-all duration-150
">
  View Profile
</button>

// Ghost — no border
<button className="
  text-[var(--color-text-secondary)]
  hover:text-[var(--color-text-primary)]
  hover:bg-[var(--color-bg-subtle)]
  px-4 py-2 rounded-[10px]
  text-[15px] font-medium
  transition-all duration-150
">
  Cancel
</button>

// Destructive
<button className="
  bg-[var(--color-danger)] text-white
  hover:bg-[var(--color-danger-hover)]
  px-5 py-2.5 rounded-[10px]
  text-[15px] font-semibold
  transition-all duration-150
">
  Remove Task
</button>
```

**Sizes:**
| Size | Padding | Font | Use |
|---|---|---|---|
| `xs` | `px-3 py-1` | 12px | Inline table actions |
| `sm` | `px-4 py-2` | 13px | Secondary actions in cards |
| `md` (default) | `px-5 py-2.5` | 15px | Primary page actions |
| `lg` | `px-6 py-3` | 16px | Hero CTAs, modal submits |

---

### Task Card

```
┌────────────────────────────────────┐
│  [PAID badge]      [OPEN badge]    │  ← top row: type + status
│                                    │
│  Task title (h3, 2-line clamp)     │  ← bold, large
│  Description (body-sm, 2-line)     │  ← secondary color
│                                    │
│  [🏷 Vue] [🏷 TypeScript]          │  ← skill chips (max 3 + overflow)
│                                    │
│  ──────────────────────────────    │
│  [Avatar] @username  •  2h ago     │  ← poster info
│  📍 Remote           4 applicants  │  ← meta row
└────────────────────────────────────┘
```

```tsx
// Card styles
<div className="
  bg-[var(--color-surface)]
  border border-[var(--color-border)]
  rounded-[14px] p-6
  hover:border-[var(--color-accent-muted)]
  hover:shadow-md
  hover:-translate-y-0.5
  transition-all duration-200
  cursor-pointer
  group
">
```

**Hover state:** border shifts to accent-muted, subtle lift (`-translate-y-0.5`), shadow increases.

---

### Badges & Chips

**Task type badge:**
```tsx
// Paid
<span className="
  bg-[var(--color-paid-bg)]
  text-[var(--color-paid-text)]
  border border-[var(--color-paid-border)]
  text-caption font-semibold uppercase tracking-wide
  px-2.5 py-1 rounded-full
">
  Paid
</span>

// Community
<span className="
  bg-[var(--color-community-bg)]
  text-[var(--color-community-text)]
  border border-[var(--color-community-border)]
  text-caption font-semibold uppercase tracking-wide
  px-2.5 py-1 rounded-full
">
  Community
</span>
```

**Status badge:**
```tsx
const statusStyles = {
  OPEN:        'bg-[var(--color-status-open)] text-[var(--color-status-open-text)]',
  IN_PROGRESS: 'bg-[var(--color-status-progress)] text-[var(--color-status-progress-text)]',
  COMPLETED:   'bg-[var(--color-status-completed)] text-[var(--color-status-completed-text)]',
  CANCELLED:   'bg-[var(--color-status-cancelled)] text-[var(--color-status-cancelled-text)]',
}
// Apply with: `${statusStyles[status]} text-caption font-semibold px-2.5 py-1 rounded-full`
```

**Skill chip:**
```tsx
<span className="
  bg-[var(--color-accent-subtle)]
  text-[var(--color-accent-text)]
  border border-[var(--color-accent-muted)]
  text-caption font-medium
  px-2.5 py-1 rounded-full
">
  Vue.js
</span>
```

---

### Input fields

```tsx
<input className="
  w-full
  bg-[var(--color-surface)]
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-tertiary)]
  rounded-[10px] px-4 py-2.5
  text-body
  outline-none
  focus:border-[var(--color-accent)]
  focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-20
  transition-colors duration-150
  disabled:opacity-50 disabled:cursor-not-allowed
" />

// Error state — add:
// border-[var(--color-danger)] focus:border-[var(--color-danger)]
// focus:ring-[var(--color-danger)]
```

Form label:
```tsx
<label className="
  block text-label text-[var(--color-text-primary)]
  mb-1.5
">
  Task Title
</label>
```

Helper / error text:
```tsx
<p className="mt-1.5 text-body-sm text-[var(--color-text-tertiary)]">
  A clear title gets more applicants
</p>
<p className="mt-1.5 text-body-sm text-[var(--color-danger)]">
  Title is required
</p>
```

---

### Avatar

```tsx
// Small (32px) — in card meta, notification rows
<div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-accent-subtle)]">
  <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
</div>

// Medium (40px) — navbar, lists
<div className="w-10 h-10 rounded-full overflow-hidden ...">

// Large (80px) — profile page header
<div className="w-20 h-20 rounded-2xl overflow-hidden ...">

// Fallback (no image): show initials on accent-subtle background
<div className="... flex items-center justify-center
  bg-[var(--color-accent-subtle)]
  text-[var(--color-accent-text)] font-semibold text-body">
  {initials}
</div>
```

---

### Rating Stars

```tsx
// Filled star: text-[var(--color-warning)]
// Empty star:  text-[var(--color-border-strong)]
// Use Lucide's <Star /> icon, size 14–16px
// Always show numeric score next to stars: "4.8 (12)"
```

---

### Notification item

```
┌─────────────────────────────────────────┐
│  [●] [Icon]  Someone applied to your    │  ← unread dot + type icon + message
│              task "Design a logo"       │
│              2 minutes ago              │  ← tertiary timestamp
└─────────────────────────────────────────┘
```

- Unread: left border `border-l-2 border-[var(--color-accent)]` + `bg-[var(--color-accent-subtle)]`
- Read: no left border, `bg-[var(--color-surface)]`
- Type icons (Lucide): `FileText` (application), `UserPlus` (nomination), `CheckCircle` (accepted), `XCircle` (rejected), `Star` (review), `Trophy` (completed)

---

### Modal / Dialog

```tsx
// Overlay
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

// Panel
<div className="
  bg-[var(--color-surface)]
  border border-[var(--color-border)]
  rounded-[18px] shadow-lg
  w-full max-w-lg mx-auto
  p-6
">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-h3 text-[var(--color-text-primary)]">Apply for Task</h3>
    <button className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]
      rounded-[10px] p-1.5 hover:bg-[var(--color-bg-subtle)] transition-colors">
      <X size={18} />
    </button>
  </div>
  {/* Content */}
  {/* Footer */}
  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[var(--color-border)]">
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Submit Application</Button>
  </div>
</div>
```

---

### Empty State

```tsx
// Every list that can be empty MUST have one of these
<div className="flex flex-col items-center justify-center py-20 text-center">
  <div className="
    w-16 h-16 rounded-2xl
    bg-[var(--color-accent-subtle)]
    flex items-center justify-center mb-4
  ">
    <Icon size={28} className="text-[var(--color-accent)]" />
  </div>
  <h3 className="text-h4 text-[var(--color-text-primary)] mb-2">
    No tasks yet
  </h3>
  <p className="text-body text-[var(--color-text-secondary)] max-w-sm mb-6">
    Be the first to post a task and start getting things done.
  </p>
  <Button variant="primary">Post a Task</Button>
</div>
```

Empty states for each context:
| Context | Icon | Headline |
|---|---|---|
| Task feed (no results) | `SearchX` | No tasks match your filters |
| My posted tasks | `ClipboardList` | You haven't posted a task yet |
| Applications received | `Inbox` | No applications yet |
| Reviews | `Star` | No reviews yet |
| Notifications | `Bell` | You're all caught up |
| User directory | `Users` | No users found |

---

### Skeleton / Loading

```tsx
// Skeleton base class
const skeleton = "bg-[var(--color-bg-subtle)] animate-pulse rounded-[10px]"

// TaskCard skeleton
<div className="bg-[var(--color-surface)] border border-[var(--color-border)]
  rounded-[14px] p-6 space-y-4">
  <div className="flex gap-2">
    <div className={`${skeleton} h-5 w-16`} />  {/* type badge */}
    <div className={`${skeleton} h-5 w-14`} />  {/* status badge */}
  </div>
  <div className={`${skeleton} h-6 w-3/4`} />   {/* title */}
  <div className="space-y-2">
    <div className={`${skeleton} h-4 w-full`} />
    <div className={`${skeleton} h-4 w-2/3`} />
  </div>
  <div className="flex gap-2">
    <div className={`${skeleton} h-5 w-16 rounded-full`} />
    <div className={`${skeleton} h-5 w-20 rounded-full`} />
  </div>
  <div className={`${skeleton} h-px w-full`} />
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`${skeleton} h-8 w-8 rounded-full`} />
      <div className={`${skeleton} h-4 w-24`} />
    </div>
    <div className={`${skeleton} h-4 w-16`} />
  </div>
</div>
```

---

### Toast notifications

- Position: bottom-right, stacked
- Width: 360px max
- Auto-dismiss: 4 seconds (errors: 6 seconds, no auto-dismiss)

```
✅ Success  — left border accent (success green), icon CheckCircle
⚠️ Warning  — left border warning amber, icon AlertTriangle
❌ Error    — left border danger red, icon XCircle
ℹ️ Info     — left border accent violet, icon Info
```

```tsx
<div className="
  bg-[var(--color-surface)]
  border border-[var(--color-border)]
  border-l-4 border-l-[var(--color-success)]
  rounded-[14px] shadow-md
  p-4 flex items-start gap-3
  max-w-sm w-full
">
  <CheckCircle size={18} className="text-[var(--color-success)] mt-0.5 shrink-0" />
  <div>
    <p className="text-body font-semibold text-[var(--color-text-primary)]">Application sent</p>
    <p className="text-body-sm text-[var(--color-text-secondary)]">
      The task poster will review it soon.
    </p>
  </div>
  <button className="ml-auto text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">
    <X size={16} />
  </button>
</div>
```

---

## 8. Iconography

Use **Lucide React** exclusively (`lucide-react` — already a shadcn/ui dependency).

### Size standards
| Context | Size |
|---|---|
| Inline in body text | 14px |
| Button icons | 16px |
| Nav icons | 20px |
| Empty state illustrations | 28px |
| Feature icons (large) | 32px |

### Icon map for TaskBoard

| Concept | Lucide icon |
|---|---|
| Task / post | `ClipboardList` |
| Apply (self) | `LogIn` |
| Nominate | `UserPlus` |
| Paid task | `DollarSign` |
| Community task | `Heart` |
| Location | `MapPin` |
| Remote | `Globe` |
| Skills / tags | `Tag` |
| Status: open | `Circle` |
| Status: in progress | `Clock` |
| Status: completed | `CheckCircle2` |
| Status: cancelled | `XCircle` |
| Rating / review | `Star` |
| Notification | `Bell` |
| User / profile | `User` |
| Settings | `Settings` |
| Admin | `ShieldCheck` |
| Search | `Search` |
| Filter | `SlidersHorizontal` |
| Edit | `Pencil` |
| Delete / remove | `Trash2` |
| Ban | `Ban` |
| Close / dismiss | `X` |
| Chevron | `ChevronDown` / `ChevronRight` |
| External link | `ArrowUpRight` |
| Copy | `Copy` |
| Upload (avatar) | `Upload` |
| Calendar / date | `Calendar` |
| Budget | `Banknote` |

---

## 9. Motion & Animation

### Principles
- Motion should be functional — it communicates state change, not decoration
- Default durations are short (150–250ms); nothing drags
- Respect `prefers-reduced-motion` — disable all transforms and transitions when set

### Duration scale
```css
--duration-fast:    100ms;  /* micro-interactions: button press, checkbox tick */
--duration-default: 150ms;  /* most transitions: color, border, shadow */
--duration-medium:  250ms;  /* element appear/disappear, dropdown open */
--duration-slow:    350ms;  /* modal enter/exit, page transitions */
```

### Easing
```css
--ease-default:  cubic-bezier(0.16, 1, 0.3, 1);    /* snappy, slight overshoot */
--ease-in:       cubic-bezier(0.4, 0, 1, 1);
--ease-out:      cubic-bezier(0, 0, 0.2, 1);
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* bouncy — use sparingly */
```

### Standard transitions

```css
/* All interactive elements */
transition: color 150ms ease, background-color 150ms ease,
            border-color 150ms ease, box-shadow 150ms ease,
            transform 150ms ease;

/* Cards on hover */
transform: translateY(-2px);
transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 200ms ease, border-color 200ms ease;
```

### Modal / dialog animation
- Enter: fade in (`opacity: 0 → 1`) + scale up (`scale: 0.96 → 1`), 250ms
- Exit: fade out + scale down, 200ms

### Skeleton pulse
- Use Tailwind `animate-pulse` — background oscillates between `bg-subtle` and `bg-surface`
- Duration: 1.5s infinite

### Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Dark Mode

### Implementation
Use `next-themes` with `attribute="class"` strategy — adds `class="dark"` to `<html>`.

```tsx
// _app.tsx
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {/* app */}
</ThemeProvider>
```

```tsx
// ThemeToggle component
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Cycle: system → light → dark → system
}
```

### Dark mode checklist for every component
- [ ] Background uses `--color-surface` or `--color-bg` (never hardcoded white)
- [ ] Text uses semantic tokens (never hardcoded `text-gray-900`)
- [ ] Borders use `--color-border` or `--color-border-strong`
- [ ] Shadows are subtle — rely on background lift for dark elevation
- [ ] All badges have both light and dark token variants
- [ ] Images and avatars have a fallback background using `--color-accent-subtle`
- [ ] Focus rings are visible in both modes (`ring-[var(--color-accent)]`)
- [ ] Skeleton shimmer reads clearly in both modes

### Dark mode specific adjustments
- Navbar: in dark mode, use `bg-[var(--color-bg)]/80 backdrop-blur-md` for glassmorphism
- Cards: in dark mode, a very subtle inner glow helps lift them from the background:
  ```css
  box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.04);
  ```
- The accent violet is slightly brighter in dark mode (`violet-500` vs `violet-600`) to maintain vibrancy against dark backgrounds

---

## 11. Tailwind Config

`apps/web/tailwind.config.js`:

```js
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...fontFamily.sans],
      },
      fontSize: {
        'display': ['3rem',     { lineHeight: '1.1',  fontWeight: '800' }],
        'h1':      ['2.25rem',  { lineHeight: '1.15', fontWeight: '700' }],
        'h2':      ['1.75rem',  { lineHeight: '1.2',  fontWeight: '700' }],
        'h3':      ['1.375rem', { lineHeight: '1.3',  fontWeight: '600' }],
        'h4':      ['1.125rem', { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg': ['1.0625rem',{ lineHeight: '1.6',  fontWeight: '400' }],
        'body':    ['0.9375rem',{ lineHeight: '1.6',  fontWeight: '400' }],
        'body-sm': ['0.8125rem',{ lineHeight: '1.5',  fontWeight: '400' }],
        'label':   ['0.8125rem',{ lineHeight: '1.4',  fontWeight: '600' }],
        'caption': ['0.6875rem',{ lineHeight: '1.4',  fontWeight: '500' }],
      },
      borderRadius: {
        'sm':  '6px',
        DEFAULT:'10px',
        'md':  '12px',
        'lg':  '14px',
        'xl':  '18px',
        '2xl': '24px',
      },
      boxShadow: {
        'xs':     '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'sm':     '0 2px 4px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        DEFAULT:  '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'md':     '0 8px 24px 0 rgb(0 0 0 / 0.10), 0 4px 8px -4px rgb(0 0 0 / 0.06)',
        'lg':     '0 16px 48px 0 rgb(0 0 0 / 0.14), 0 8px 16px -8px rgb(0 0 0 / 0.08)',
        'accent': '0 4px 20px 0 rgb(124 58 237 / 0.35)',
      },
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover:   'var(--color-accent-hover)',
          active:  'var(--color-accent-active)',
          subtle:  'var(--color-accent-subtle)',
          muted:   'var(--color-accent-muted)',
          text:    'var(--color-accent-text)',
          fg:      'var(--color-accent-fg)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised:  'var(--color-surface-raised)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong:  'var(--color-border-strong)',
        },
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      animation: {
        'fade-in':    'fadeIn 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up':   'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':   'scaleIn 250ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                   to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { from: { transform: 'scale(0.96)', opacity: '0' },     to: { transform: 'scale(1)',    opacity: '1' } },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
```

---

## 12. shadcn/ui Theming

Run `npx shadcn-ui@latest init` and set the following in `components.json`:

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "rsc": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

Override shadcn's default CSS variables in `globals.css` to match the TaskBoard palette:

```css
@layer base {
  :root {
    --background: 210 40% 98%;        /* slate-50 */
    --foreground: 222 84% 5%;         /* slate-900 */
    --card: 0 0% 100%;
    --card-foreground: 222 84% 5%;
    --primary: 262 83% 58%;           /* violet-600 */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 262 83% 96%;            /* violet-50 */
    --accent-foreground: 262 83% 38%; /* violet-800 */
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;            /* slate-200 */
    --input: 214 32% 91%;
    --ring: 262 83% 58%;              /* violet-600 */
    --radius: 0.625rem;               /* 10px */
  }

  .dark {
    --background: 240 6% 5%;
    --foreground: 210 40% 96%;
    --card: 240 6% 9%;
    --card-foreground: 210 40% 96%;
    --primary: 263 70% 64%;           /* violet-500 */
    --primary-foreground: 0 0% 100%;
    --secondary: 240 4% 12%;
    --secondary-foreground: 210 40% 96%;
    --muted: 240 4% 12%;
    --muted-foreground: 215 16% 57%;
    --accent: 270 50% 14%;
    --accent-foreground: 270 50% 75%;
    --destructive: 0 63% 63%;
    --destructive-foreground: 0 0% 100%;
    --border: 240 5% 20%;
    --input: 240 5% 20%;
    --ring: 263 70% 64%;
  }
}
```

### Components to install
```bash
npx shadcn-ui@latest add button dialog tabs badge avatar input textarea
npx shadcn-ui@latest add select skeleton toast dropdown-menu sheet
npx shadcn-ui@latest add separator scroll-area popover command
```

---

## 13. Page-by-Page UI Guidelines

### Landing page (`/`)
- Full-width hero with large display headline, subheading, two CTAs (Browse Tasks / Post a Task)
- Subtle animated gradient background using violet tones
- Below fold: 3-column "how it works" section with large icon, heading, description
- Featured/recent tasks strip (6 cards)
- Simple footer

### Task Feed (`/tasks`)
- Sticky filter bar below navbar: search input (full width on mobile), filter chips for type/skills/remote
- Results count: "24 open tasks"
- 3-column card grid (desktop), 2-col (tablet), 1-col (mobile)
- Cards sorted by newest by default
- "Load more" button or infinite scroll

### Task Detail (`/tasks/[id]`)
- Two-column layout (desktop): main content (2/3) + sidebar (1/3)
- Main: title, type+status badges, description, skills, location/remote
- Sidebar: poster card (avatar, name, rating, link to profile), budget (if paid), posted date, action buttons
- Below main content: `ApplicationPanel` (poster) or application CTAs (others)
- Mobile: single column, action buttons sticky at bottom

### Task Creation (`/tasks/new`)
- Single-column centered form, max-width 640px
- Step-like visual grouping: Basic Info → Details → Skills & Location
- Live preview panel on desktop (right side)
- "Publish Task" primary CTA, "Save Draft" secondary (future)

### User Profile (`/u/[username]`)
- Profile header: large avatar (80px, rounded-2xl), name, username, bio, location, skills
- Stats bar: avg rating (stars + number), tasks completed, reviews count
- Tabbed content below: Posted Tasks | Completed Tasks | Reviews

### Onboarding (`/onboarding`)
- Centered single-column, max-width 480px
- Progress indicator (3 steps)
- Friendly, encouraging copy — not clinical
- Large "Get Started" CTA

### Admin (`/admin/*`)
- Left sidebar navigation (240px)
- Content area with data tables (shadcn Table component)
- Stats cards at top of dashboard using the surface-raised background

---

## 14. Accessibility

### Color contrast
- All text on background meets WCAG AA (4.5:1 for body, 3:1 for large text)
- Accent violet (`#7c3aed`) on white: 6.1:1 ✓
- Dark mode accent (`#8b5cf6`) on dark bg (`#0a0a0f`): 5.8:1 ✓
- Never convey information with color alone — always pair with icon or text

### Focus management
- All interactive elements have a visible focus ring: `ring-2 ring-[var(--color-accent)] ring-offset-2`
- Modal/dialog: focus trapped inside when open; focus returns to trigger on close
- Skip-to-main-content link at top of page

### Touch targets
- Minimum 44×44px for all interactive elements on mobile
- Icon-only buttons always have an `aria-label`

### Semantic HTML
- Use `<button>` for actions, `<a>` for navigation — never `<div onClick>`
- Form inputs always have associated `<label>` elements (not just placeholder text)
- Use `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>` correctly
- Task status and type badges use `aria-label` for screen readers

### Screen reader support
- Images: meaningful `alt` text; decorative images get `alt=""`
- Avatars: `alt={`${username}'s avatar`}`
- Rating: `aria-label="4.8 out of 5 stars"`
- Notifications badge: `aria-label={`${count} unread notifications`}`
- Loading states: `aria-busy="true"` on the loading container

### Keyboard navigation
- Task feed filterable and navigable by keyboard
- Modal dismissible with `Escape`
- Dropdown menus navigable with arrow keys (shadcn handles this)
- Tab order follows visual reading order

---

*Generated for TaskBoard — design-system.md v1.0*
