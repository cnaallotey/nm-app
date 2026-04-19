export function Navigation() {
  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'All Publications', href: '#publications' },
    { label: 'About', href: '#about' },
    { label: 'CV', href: '#cv' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="border-b border-border py-4 sticky top-0 bg-background z-40 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ul className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="text-[11px] md:text-[12px] uppercase tracking-[0.1em] hover:opacity-100 opacity-60 transition-opacity"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
