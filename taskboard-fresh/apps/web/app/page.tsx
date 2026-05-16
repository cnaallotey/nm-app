import { WaitlistForm } from "./_components/waitlist-form";
import { WaitlistReveal } from "./_components/waitlist-reveal";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[var(--color-bg)] px-6 py-16">
      <WaitlistReveal>
        <div className="relative w-full max-w-md">
          {/* Decorative accent glow behind the card. */}
          <div
            data-glow
            aria-hidden="true"
            className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-[var(--color-accent)] opacity-20 blur-3xl"
          />

          <div
            data-card
            className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-md sm:p-10"
          >
            <div className="mb-7 text-center">
              <span
                data-animate
                className="inline-block rounded-full border border-[var(--color-accent-muted)] bg-[var(--color-accent-subtle)] px-2.5 py-1 text-caption font-semibold uppercase tracking-wide text-[var(--color-accent-text)]"
              >
                Launching soon
              </span>
              <h1
                data-animate
                className="mt-5 text-h1 text-[var(--color-text-primary)]"
              >
                TaskBoard
              </h1>
              <p
                data-animate
                className="mt-3 text-body text-[var(--color-text-secondary)]"
              >
                Post a task, apply for one, or nominate someone. Paid or
                community — get things done together. Join the waitlist for
                early access.
              </p>
            </div>

            <div data-animate>
              <WaitlistForm />
            </div>

            <p
              data-animate
              className="mt-5 text-center text-caption text-[var(--color-text-tertiary)]"
            >
              No spam. One email when we launch.
            </p>
          </div>
        </div>
      </WaitlistReveal>
    </main>
  );
}
