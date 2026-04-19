import { useState } from 'react';

interface CitationButtonProps {
  citation: string;
}

export function CitationButton({ citation }: CitationButtonProps) {
  const [showCitation, setShowCitation] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setShowCitation(!showCitation)}
        className="text-[11px] sm:text-[13px] uppercase tracking-[0.1em] px-4 py-2 border border-border hover:bg-muted transition-colors w-full sm:w-auto"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        Cite This Article
      </button>

      {showCitation && (
        <div
          className="absolute bg-white top-full mt-2 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[500px] max-w-[500px] bg-citation-bg border border-border p-4 shadow-lg z-10"
        >
          <div className="flex items-start justify-between mb-2">
            <div
              className="text-[10px] uppercase tracking-[0.12em] opacity-50"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Citation (MLA Format)
            </div>
            <button
              onClick={handleCopy}
              className="text-[10px] uppercase tracking-[0.12em] hover:opacity-100 opacity-60 transition-opacity"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p
            className="text-[13px] leading-[1.5] select-all"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {citation}
          </p>
        </div>
      )}
    </div>
  );
}
