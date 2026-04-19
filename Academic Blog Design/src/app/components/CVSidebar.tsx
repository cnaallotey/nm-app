interface Publication {
  year: string;
  title: string;
  journal: string;
}

interface CVSidebarProps {
  name: string;
  credentials: string;
  institution: string;
  researchInterests: string[];
  recentPublications: Publication[];
  email: string;
}

export function CVSidebar({
  name,
  credentials,
  institution,
  researchInterests,
  recentPublications,
  email,
}: CVSidebarProps) {
  return (
    <div className="lg:sticky lg:top-8">
      <div className="border-t-2 border-b border-border-heavy pt-8 pb-8">
        {/* Name & Credentials */}
        <div className="mb-8">
          <h3
            className="text-[1.5rem] leading-[1.2] mb-2"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
          >
            {name}
          </h3>
          <div
            className="text-[14px] opacity-70 mb-1"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {credentials}
          </div>
          <div
            className="text-[12px] uppercase tracking-[0.1em] opacity-50"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {institution}
          </div>
        </div>

        <div className="h-[1px] bg-rule-color opacity-15 mb-6"></div>

        {/* Research Interests */}
        <div className="mb-8">
          <h4
            className="text-[11px] uppercase tracking-[0.15em] mb-3 opacity-50"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Research Interests
          </h4>
          <ul className="space-y-2">
            {researchInterests.map((interest, index) => (
              <li
                key={index}
                className="text-[14px] leading-[1.5]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-[1px] bg-rule-color opacity-15 mb-6"></div>

        {/* Recent Publications */}
        {/* <div className="mb-8">
          <h4
            className="text-[11px] uppercase tracking-[0.15em] mb-3 opacity-50"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Recent Citations
          </h4>
          <ul className="space-y-4">
            {recentPublications.map((pub, index) => (
              <li key={index}>
                <div
                  className="text-[11px] opacity-40 mb-1"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {pub.year}
                </div>
                <div
                  className="text-[13px] leading-[1.4] mb-1"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {pub.title}
                </div>
                <div
                  className="text-[11px] italic opacity-50"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {pub.journal}
                </div>
              </li>
            ))}
          </ul>
        </div> */}

        <div className="h-[1px] bg-rule-color opacity-15 mb-6"></div>

        {/* Contact */}
        <div>
          <h4
            className="text-[11px] uppercase tracking-[0.15em] mb-3 opacity-50"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Contact
          </h4>
          <a
            href={`mailto:${email}`}
            className="text-[13px] underline hover:opacity-60 transition-opacity"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}
