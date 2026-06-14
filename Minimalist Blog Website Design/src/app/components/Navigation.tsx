import { useState } from 'react';

export default function Navigation() {
  const [activeLink, setActiveLink] = useState('ESSAYS');

  const links = ['ESSAYS', 'ARCHIVE', 'ABOUT', 'CONTACT'];

  return (
    <nav className="border-b border-[#1A1A1A] bg-[#F9F9F7] sticky top-0 z-50">
      <div className="flex items-center justify-between px-12 py-6">
        <div className="flex gap-12">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => setActiveLink(link)}
              className={`text-[11px] tracking-[0.15em] transition-colors duration-0 hover:text-[#002FA7] ${
                activeLink === link ? 'text-[#002FA7]' : 'text-[#1A1A1A]'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
        <div className="text-[11px] tracking-[0.15em]">
          {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).toUpperCase()}
        </div>
      </div>
    </nav>
  );
}
