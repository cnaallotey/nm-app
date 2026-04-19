interface SidenoteProps {
  number: number;
  content: string;
}

export function Sidenote({ number, content }: SidenoteProps) {
  return (
    <span className="inline-block relative group">
      <sup
        className="cursor-help text-[11px] opacity-60 hover:opacity-100 transition-opacity"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        [{number}]
      </sup>
      <span
        className="absolute left-full ml-4 top-0 w-48 bg-citation-bg border-l-2 border-sidenote-border p-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50 shadow-lg"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <span className="text-[11px] leading-[1.5] block">
          <span className="opacity-40 mr-2" style={{ fontFamily: 'var(--font-mono)' }}>
            [{number}]
          </span>
          {content}
        </span>
      </span>
    </span>
  );
}
