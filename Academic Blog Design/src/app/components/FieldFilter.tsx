interface FieldFilterProps {
  fields: string[];
  selectedField: string;
  onFieldSelect: (field: string) => void;
}

export function FieldFilter({ fields, selectedField, onFieldSelect }: FieldFilterProps) {
  return (
    <nav className="border-t border-b border-border py-6 mb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          className="text-[10px] uppercase tracking-[0.15em] mb-4 opacity-40 text-center"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Filter by Research Field
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onFieldSelect('All')}
            className={`text-[12px] uppercase tracking-[0.08em] px-4 py-2 border transition-all ${
              selectedField === 'All'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:bg-muted'
            }`}
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            All Fields
          </button>
          {fields.map((field) => (
            <button
              key={field}
              onClick={() => onFieldSelect(field)}
              className={`text-[12px] uppercase tracking-[0.08em] px-4 py-2 border transition-all ${
                selectedField === field
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:bg-muted'
              }`}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {field}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
