interface Stat {
  label: string;
  value: string | number;
}

interface StatsPanelProps {
  stats: Stat[];
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="border-t-2 border-b border-border-heavy py-8 mb-12">
      <div
        className="text-[10px] uppercase tracking-[0.15em] mb-6 opacity-40 text-center"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        Archive Statistics
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div
              className="text-[2rem] mb-1 leading-none"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
            >
              {stat.value}
            </div>
            <div
              className="text-[11px] uppercase tracking-[0.1em] opacity-50"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
