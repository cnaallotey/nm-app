import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search articles, keywords, or topics..."
          className="w-full px-6 py-4 border-2 border-border bg-card focus:border-primary outline-none transition-colors"
          style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}
        />
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.12em] opacity-30 pointer-events-none"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Press Enter
        </div>
      </form>
    </div>
  );
}
