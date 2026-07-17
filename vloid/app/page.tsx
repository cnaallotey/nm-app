"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Check,
  CheckCircle2,
  ChevronDown,
  ListChecks,
  Loader2,
  Menu,
  MessageSquareText,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  Target,
  Upload,
  X,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   Copy — two variants from the plan (control vs. provoke).
   Flip ACTIVE to run the other. The value is also sent to
   FormDrop so signups can be segmented by variant later.
 ──────────────────────────────────────────────────────────── */
const COPY = {
  A: {
    id: "A-control",
    headline: ["Let AI make your", "follow-up calls."],
    accentWord: "follow-up",
    subhead:
      "Upload a list, tell it what to ask, and get structured results back — no agents dialing one by one.",
    cta: "Join the waitlist",
  },
  B: {
    id: "B-provoke",
    headline: ["Stop paying people to dial", "down a spreadsheet."],
    accentWord: "dial",
    subhead:
      "Vloid calls your customer list, asks what you need to know, and hands you the answers — while your team does everything else.",
    cta: "Get early access",
  },
} as const;

const ACTIVE = COPY.B;

/* ────────────────────────────────────────────────────────────
   Motion helpers
 ──────────────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  y = 16,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-64px" });
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      ref={ref}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ────────────────────────────────────────────────────────────
   Brand mark
 ──────────────────────────────────────────────────────────── */
function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
        <PhoneCall className="h-4 w-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-base font-semibold tracking-tight text-ink font-sans">
        Vloid
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Nav
 ──────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Use cases", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a href="#top" aria-label="Vloid home" className="flex items-center">
          <Logo />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-medium text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1 rounded-lg bg-ink px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            {ACTIVE.cta}
          </a>
        </div>

        <button
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-canvas px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#waitlist"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-ink py-2 text-center text-sm font-medium text-white"
            >
              {ACTIVE.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ────────────────────────────────────────────────────────────
   Animated voice waveform (continuous)
 ──────────────────────────────────────────────────────────── */
function Waveform() {
  const reduce = useReducedMotion();
  const bars = [12, 22, 34, 18, 28, 40, 24, 14, 30, 20, 36, 16];
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-primary/70"
          style={{ height: h }}
          animate={
            reduce
              ? undefined
              : { scaleY: [0.4, 1, 0.55, 0.9, 0.4] }
          }
          transition={{
            duration: 1.2 + (i % 4) * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Hero
 ──────────────────────────────────────────────────────────── */
function Hero({
  email,
  setEmail,
  onQuickSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  onQuickSubmit: () => void;
}) {
  return (
    <section id="top" className="relative overflow-hidden bg-canvas border-b border-line py-16 sm:py-24">
      {/* Background Grids */}
      <div className="antigravity-grid antigravity-grid-mask pointer-events-none absolute inset-0 opacity-100" aria-hidden />
      <div className="antigravity-dot-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6">
        <motion.a
          href="https://clientra.tech"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary shadow-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Early access · part of the Clientra suite
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06, ease: EASE }}
          className="mx-auto mt-6 max-w-3xl text-balance text-4xl leading-[1.05] text-ink sm:text-6xl antigravity-heading"
        >
          {ACTIVE.headline[0]}{" "}
          <span className="text-primary font-semibold">
            {ACTIVE.headline[1]}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base"
        >
          {ACTIVE.subhead}
        </motion.p>

        {/* quick email capture */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          onSubmit={(e) => {
            e.preventDefault();
            onQuickSubmit();
          }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-label="Work email"
            className="h-11 flex-1 rounded-lg border border-line bg-mist px-4 text-xs text-ink outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="group inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-strong"
          >
            {ACTIVE.cta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-[11px] text-muted"
        >
          No spam. Two quick questions and you&apos;re on the list.
        </motion.p>

        {/* live-call preview card formatted like a developer dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
          className="mx-auto mt-14 max-w-lg"
        >
          <div className="rounded-xl border border-line bg-mist p-1.5 shadow-sm">
            <div className="rounded-lg border border-line bg-white p-5 text-left relative overflow-hidden">
              {/* console dot decoration */}
              <div className="absolute top-4 right-4 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-line" />
                <span className="w-1.5 h-1.5 rounded-full bg-line" />
                <span className="w-1.5 h-1.5 rounded-full bg-line" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
                    <PhoneCall className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      Renewal Reminders
                    </p>
                    <p className="text-[10px] font-medium text-muted uppercase tracking-wider">Campaign · Active</p>
                  </div>
                </div>
                <Waveform />
              </div>

              <div className="mt-5 space-y-2">
                {[
                  { n: "Ama O.", s: "Renewal confirmed", tone: "good" },
                  { n: "Kojo B.", s: "Needs follow-up", tone: "warn" },
                  { n: "T. Mensah", s: "Resolved · 9/10", tone: "good" },
                ].map((r) => (
                  <div
                    key={r.n}
                    className="flex items-center justify-between rounded-lg border border-line bg-mist px-3 py-2"
                  >
                    <span className="text-xs font-medium text-ink font-mono">{r.n}</span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-mono ${
                        r.tone === "good" ? "text-mint" : "text-amber"
                      }`}
                    >
                      <span
                        className={`h-1 w-1 rounded-full ${
                          r.tone === "good" ? "bg-mint" : "bg-amber"
                        }`}
                      />
                      {r.s}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11px] text-muted font-mono">
                <span>340 / 500 called</span>
                <span className="font-semibold text-primary">68% complete</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Continuous outcome marquee
 ──────────────────────────────────────────────────────────── */
const OUTCOMES: { label: string; tone: "good" | "warn" | "flat" }[] = [
  { label: "Renewal confirmed", tone: "good" },
  { label: "Needs follow-up", tone: "warn" },
  { label: "Satisfaction 9/10", tone: "good" },
  { label: "Callback scheduled", tone: "warn" },
  { label: "Refund verified", tone: "good" },
  { label: "Left voicemail", tone: "flat" },
  { label: "Consent recorded", tone: "good" },
  { label: "Not interested", tone: "flat" },
  { label: "Escalated to human", tone: "warn" },
  { label: "Payment reminder delivered", tone: "good" },
];

function Marquee() {
  const reduce = useReducedMotion();
  const row = [...OUTCOMES, ...OUTCOMES];
  const toneClass = {
    good: "bg-mint",
    warn: "bg-amber",
    flat: "bg-muted/50",
  };
  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-b border-line bg-mist py-3"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-mist to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-mist to-transparent" />
      <motion.div
        className="flex w-max gap-3"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        {row.map((o, i) => (
          <span
            key={i}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-sm"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${toneClass[o.tone]}`} />
            {o.label}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Problem
 ──────────────────────────────────────────────────────────── */
function Problem() {
  return (
    <section className="border-b border-line bg-canvas py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
        <Reveal>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            The problem
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-5xl sm:leading-[1.1] antigravity-heading">
            The list never quite gets finished.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Feedback checks. Renewal reminders. Dispute follow-ups. Somebody on
            your team is manually working through a list, one call at a time —
            and it never quite gets finished before the next list arrives.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Solution
 ──────────────────────────────────────────────────────────── */
function Solution() {
  const chips = [
    "Resolved",
    "Needs follow-up",
    "Satisfaction score",
    "Notes",
  ];
  return (
    <section className="bg-mist border-b border-line py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              The solution
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl antigravity-heading">
              You define the call. Vloid makes it.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              Vloid dispatches AI voice agents to make the calls for you. You
              define the reason for calling and what to listen for. It calls your
              list, has the conversation, and gives you structured, filterable
              results — without anyone picking up a phone.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-7 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <ResultsPanel />
        </Reveal>
      </div>
    </section>
  );
}

function ResultsPanel() {
  const rows = [
    { name: "Ama Owusu", tag: "Resolved", score: "9/10", tone: "good" },
    { name: "Bright Kojo", tag: "Needs follow-up", score: "—", tone: "warn" },
    { name: "Zola Ventures", tag: "Renewal confirmed", score: "8/10", tone: "good" },
    { name: "N. Adjei", tag: "Callback booked", score: "—", tone: "warn" },
    { name: "Farida M.", tag: "Resolved", score: "10/10", tone: "good" },
  ];
  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-ink">Results</span>
        </div>
        <span className="rounded-lg bg-primary-soft px-2.5 py-1 text-[10px] font-bold text-primary">
          Filter: all
        </span>
      </div>
      <div className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-mist text-[10px] font-bold text-muted font-mono">
                {r.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <span className="text-xs font-semibold text-ink">{r.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[10px] font-bold font-mono ${
                  r.tone === "good"
                    ? "bg-mint/10 text-mint"
                    : "bg-amber/10 text-amber"
                }`}
              >
                {r.tag}
              </span>
              <span className="w-8 text-right text-xs font-semibold text-muted font-mono">
                {r.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   How it works
 ──────────────────────────────────────────────────────────── */
const STEPS = [
  {
    icon: Target,
    title: "Define campaign",
    desc: "Set the reason for calling and what a good outcome looks like.",
  },
  {
    icon: Upload,
    title: "Upload contact list",
    desc: "Bring your own numbers — a spreadsheet is enough to start.",
  },
  {
    icon: PhoneCall,
    title: "Voice agents dial",
    desc: "Vloid works through the whole list and conducts the calls.",
  },
  {
    icon: ListChecks,
    title: "Review live dashboard",
    desc: "Results are structured, filterable, and instantly ready.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="bg-canvas border-b border-line py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl antigravity-heading">
              Four steps from list to answers.
            </h2>
          </Reveal>
        </div>

        {/* Technical, grid-aligned layout matching Google developer aesthetic */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid border-t border-l border-line md:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              variants={item}
              className="crosshair crosshair-tl group relative border-r border-b border-line bg-white p-6 transition-colors hover:bg-mist/30"
            >
              <span className="absolute right-5 top-5 text-[10px] font-bold text-line transition-colors font-mono group-hover:text-primary/45">
                0{i + 1}
              </span>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary transition-transform group-hover:scale-105">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-sm font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Use cases
 ──────────────────────────────────────────────────────────── */
const USE_CASES = [
  {
    icon: MessageSquareText,
    title: "Feedback collection",
    quote: "Was the solution we gave you actually good for you?",
  },
  {
    icon: RefreshCw,
    title: "Renewal reminders",
    quote: "Your subscription expires in 5 days — want us to renew it?",
  },
  {
    icon: ShieldCheck,
    title: "Dispute follow-ups",
    quote: "Confirming your refund went through — any remaining concerns?",
  },
];

function UseCases() {
  return (
    <section id="use-cases" className="bg-mist border-b border-line py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Use cases
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl antigravity-heading">
              Built for the calls you keep putting off.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {USE_CASES.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-xl border border-line bg-white p-7 transition-colors hover:bg-white/90">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <u.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-sm font-semibold text-ink">
                  {u.title}
                </h3>
                <p className="mt-3 border-l-2 border-primary/30 pl-4 text-xs italic leading-relaxed text-muted">
                  &ldquo;{u.quote}&rdquo;
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Waitlist form
 ──────────────────────────────────────────────────────────── */
const USE_CASE_OPTIONS = [
  "Feedback collection",
  "Renewal reminders",
  "Dispute follow-ups",
  "Other",
] as const;

const VOLUME_OPTIONS = ["<100", "100-500", "500-2000", "2000+"] as const;

function PillGroup<T extends string>({
  options,
  value,
  onChange,
  name,
  isDark = false,
}: {
  options: readonly T[];
  value: T | "";
  onChange: (v: T) => void;
  name: string;
  isDark?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={name}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              active
                ? "border-primary bg-primary text-white shadow-sm"
                : isDark
                ? "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:text-white"
                : "border-line bg-white text-ink hover:border-primary/30"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Waitlist({
  email,
  setEmail,
  formRef,
}: {
  email: string;
  setEmail: (v: string) => void;
  formRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [useCase, setUseCase] = useState<(typeof USE_CASE_OPTIONS)[number] | "">(
    ""
  );
  const [useCaseOther, setUseCaseOther] = useState("");
  const [volume, setVolume] = useState<(typeof VOLUME_OPTIONS)[number] | "">("");
  const [gotcha, setGotcha] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          use_case: useCase,
          use_case_other: useCaseOther,
          monthly_calls: volume,
          variant: ACTIVE.id,
          _gotcha: gotcha,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please try again in a moment.");
    }
  }

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-ink py-16 text-white sm:py-24 border-b border-line"
    >
      {/* Background Grids in Dark Mode Section */}
      <div className="antigravity-grid antigravity-grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden />
      
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              The waitlist
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1] antigravity-heading">
              Get early access to Vloid.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              We&apos;re onboarding early teams in batches. Tell us what
              you&apos;d use it for and roughly how many calls you make — it
              helps us build the right thing first.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-3.5">
              {[
                "First look at pricing and locked-in launch rates",
                "Shape which campaign type we build first",
                "No commitment — leave the list any time",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-white/80">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                  <span className="text-xs font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          {/* Glassmorphic Technical Form container */}
          <div
            ref={formRef}
            className="scroll-mt-24 rounded-xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-md shadow-2xl sm:p-8"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-mint/10">
                  <CheckCircle2 className="h-7 w-7 text-mint" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">
                  You&apos;re on the list.
                </h3>
                <p className="mt-2 max-w-xs text-xs text-white/70">
                  Check your inbox for a confirmation. We&apos;ll be in touch as
                  early-access batches open up.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label
                    htmlFor="wl-email"
                    className="mb-1.5 block text-xs font-semibold text-white/90"
                  >
                    Work email <span className="text-primary">*</span>
                  </label>
                  <input
                    id="wl-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-xs text-white outline-none transition focus:border-primary focus:bg-white/10 focus:ring-2 focus:ring-primary/25"
                  />
                </div>

                <div>
                  <span className="mb-2 block text-xs font-semibold text-white/90">
                    What would you use this for?
                  </span>
                  <PillGroup
                    name="Use case"
                    options={USE_CASE_OPTIONS}
                    value={useCase}
                    onChange={setUseCase}
                    isDark={true}
                  />
                  {useCase === "Other" && (
                    <input
                      type="text"
                      value={useCaseOther}
                      onChange={(e) => setUseCaseOther(e.target.value)}
                      placeholder="Tell us what you'd call for…"
                      className="mt-3 h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-xs text-white outline-none transition focus:border-primary focus:bg-white/10 focus:ring-2 focus:ring-primary/25"
                    />
                  )}
                </div>

                <div>
                  <span className="mb-2 block text-xs font-semibold text-white/90">
                    Roughly how many calls per month?
                  </span>
                  <PillGroup
                    name="Calls per month"
                    options={VOLUME_OPTIONS}
                    value={volume}
                    onChange={setVolume}
                    isDark={true}
                  />
                </div>

                {/* honeypot */}
                <input
                  type="text"
                  name="_gotcha"
                  value={gotcha}
                  onChange={(e) => setGotcha(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                {status === "error" && (
                  <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3.5 py-2 text-xs text-red-400">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-semibold text-white transition-colors hover:bg-primary-strong disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving your spot…
                    </>
                  ) : (
                    <>
                      {ACTIVE.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-white/60">
                  We&apos;ll only use your email for Vloid updates.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   FAQ
 ──────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Do the people we call know they're talking to an AI?",
    a: "Yes. Vloid opens every call by identifying itself as an automated assistant calling on your behalf. It's built to honour do-not-call flags and record consent, and you stay the data controller for your own contact list — we're the tool that places the calls.",
  },
  {
    q: "How much will it cost?",
    a: "Pricing isn't final yet — settling it is part of what this waitlist is for. That's why we ask about your call volume. Early-access members get first look at pricing and locked-in launch rates before we open it up more widely.",
  },
  {
    q: "When does it launch?",
    a: "Phase 1 is in active build. We're inviting waitlist members in batches as capacity opens, starting with the use cases people tell us they need most — which is exactly why the two questions on the form matter.",
  },
  {
    q: "Can I use my own numbers and contact list?",
    a: "That's the whole idea. You upload your contact list and define the campaign; Vloid handles the dialing and the conversation, then hands you structured results back — resolved, needs follow-up, satisfaction score, notes.",
  },
  {
    q: "Which languages and regions are supported?",
    a: "We're starting with the call flows most common to support teams in West Africa and expanding from there. Tell us your market when you join and it helps us prioritise what comes next.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-canvas py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              FAQ
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl antigravity-heading">
              Questions, answered.
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 divide-y divide-line rounded-lg border border-line bg-white px-5 sm:px-7">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs font-bold text-ink">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`h-4.5 w-4.5 shrink-0 text-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-xs leading-relaxed text-muted">
                    {f.a}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Footer
 ──────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-line bg-mist">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-xs leading-relaxed text-muted">
              AI voice agents that make your follow-up calls and hand you the
              answers. Part of the Clientra suite.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold text-muted font-mono">
              <AudioLines className="h-3.5 w-3.5 text-primary" />
              vloid.clientra.tech
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink">
                Product
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted">
                <li>
                  <a href="#how" className="hover:text-primary transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-primary transition-colors">
                    Use cases
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#waitlist" className="hover:text-primary transition-colors">
                    Join the waitlist
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink">
                Clientra suite
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted">
                <li>
                  <a
                    href="https://clientra.tech"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Clientra.tech
                  </a>
                </li>
                <li>
                  <a
                    href="https://formdrop.clientra.tech"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    FormDrop
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-[10px] text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Vloid · Clientra.tech</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────
   Page
 ──────────────────────────────────────────────────────────── */
export default function Page() {
  const [email, setEmail] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  function goToForm() {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => {
      formRef.current?.querySelector<HTMLInputElement>("#wl-email")?.focus();
    }, 600);
  }

  return (
    <main>
      <Nav />
      <Hero email={email} setEmail={setEmail} onQuickSubmit={goToForm} />
      <Marquee />
      <Problem />
      <Solution />
      <HowItWorks />
      <UseCases />
      <Waitlist email={email} setEmail={setEmail} formRef={formRef} />
      <FAQ />
      <Footer />
    </main>
  );
}
