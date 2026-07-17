# CallFlow Waitlist — v1 Landing Page Plan
**Goal:** Capture qualified leads (businesses with call-heavy workflows) before build is complete, validate demand, and gather campaign-type data to prioritize Phase 1 features.

---

## 1. Target Audience

Primary: customer support/care teams and small-to-mid businesses in West Africa (and beyond) that regularly need to call lists of customers — support follow-ups, feedback collection, renewal reminders, dispute confirmations. Likely first adopters: fintech support teams, telco resellers, SaaS customer success teams, insurance agents doing renewal outreach.

---

## 2. Page Structure

1. **Hero** — headline, one-line subhead, single CTA (email capture), no distractions
2. **Problem** — the manual-calling pain, framed concretely
3. **Solution** — what CallFlow does, in plain terms
4. **How it works** — 3-4 step visual (define campaign → upload list → AI calls → results dashboard)
5. **Use cases** — 3 cards (feedback collection, renewal reminders, dispute follow-ups)
6. **Waitlist form** — email + 1-2 qualifying questions (see §5)
7. **FAQ** — compliance/consent question, pricing timing, launch timing
8. **Footer** — link back to Clientra.tech suite

Keep it to a single page, no scroll-jacking, mobile-first (West Africa market context — most traffic will be mobile).

---

## 3. Copy — Two Variants for A/B Test

Following the same control-vs-provoke pattern from the FormDrop PostHog experiment.

### Variant A — Control (calm, benefit-led)

**Headline:** "Let AI make your follow-up calls."
**Subhead:** "Upload a list, tell it what to ask, and get structured results back — no agents dialing one by one."
**CTA button:** "Join the waitlist"

### Variant B — Provoke (pain-led)

**Headline:** "Stop paying people to dial down a spreadsheet."
**Subhead:** "CallFlow calls your customer list, asks what you need to know, and hands you the answers — while your team does everything else."
**CTA button:** "Get early access"

Run both behind a PostHog feature flag / experiment exactly like the FormDrop test — 50/50 split, track waitlist-form-submit as the goal event, let it run to a meaningful sample before declaring a winner.

---

## 4. Section Copy (shared across both variants)

**Problem section:**
> Feedback checks. Renewal reminders. Dispute follow-ups. Somebody on your team is manually working through a list, one call at a time — and it never quite gets finished before the next list arrives.

**Solution section:**
> CallFlow dispatches AI voice agents to make the calls for you. You define the reason for calling and what to listen for. It calls your list, has the conversation, and gives you structured, filterable results — resolved, needs follow-up, satisfaction score, notes — without anyone picking up a phone.

**How it works (4 steps):**
1. Define your campaign — the reason for calling and what a good outcome looks like
2. Upload your contact list
3. CallFlow's AI agent calls everyone on the list
4. Review results in a live dashboard, filtered by outcome

**Use case cards:**
- **Feedback collection** — "Was the solution we gave you actually good for you?"
- **Renewal reminders** — "Your subscription expires in 5 days — want us to renew it?"
- **Dispute follow-ups** — "Confirming your refund went through, any remaining concerns?"

---

## 5. Waitlist Form Fields

Keep it short — every extra field costs conversion.

- Email (required)
- What would you use this for? (single-select: Feedback collection / Renewal reminders / Dispute follow-ups / Other — free text if Other)
- Roughly how many calls per month? (single-select: <100 / 100-500 / 500-2000 / 2000+) — useful for pricing/capacity planning later

Optional stretch field: "Which tool do you currently use to manage this?" — useful competitive intel, but only add if conversion in testing holds up with it included.

---

## 6. Implementation Notes

Given your existing stack, the fastest path to a working waitlist page:

- **Form + pipeline:** you already have a working Tally → Activepieces → Customer.io pipeline (built for other Clientra form flows) — reuse the same pattern rather than building new infrastructure. Alternatively, dogfood **FormDrop** itself for the waitlist form, which also doubles as a live demo/case study for FormDrop when you eventually pitch that product too.
- **A/B test:** same PostHog setup as the FormDrop experiment — feature flag for variant assignment, track `waitlist_signup` as the conversion event, segment by variant in PostHog insights.
- **Page:** static Nuxt page (or plain HTML) under a `callflow.clientra.tech` subdomain, matching the `formdrop.clientra.tech` pattern you already use for sub-products.
- **Email sequence:** once someone joins, a short 2-3 email nurture sequence via Customer.io — confirmation immediately, a "here's how it works" email a few days later, and a launch-day email when Phase 1 ships.

---

## 7. Success Metrics (pre-launch)

- Waitlist signups (target: define a number based on traffic sources you plan to use)
- Signup → qualifying-question completion rate (validates the survey questions aren't too much friction)
- Distribution across use-case categories (tells you which Phase 3 campaign template to build first)
- Distribution across call-volume tiers (informs pricing model open question from spec.md §12)

---

## 8. Open Questions

- Which channel brings first traffic — LinkedIn/personal network, cold outreach to existing Bitterbrains/freelance client contacts, or a small paid test?
- Should this be branded as a standalone product or explicitly "part of Clientra.tech" from day one? (Affects whether it lives on its own domain or a Clientra subdomain, and how much of the existing Clientra story you lean on in copy.)
