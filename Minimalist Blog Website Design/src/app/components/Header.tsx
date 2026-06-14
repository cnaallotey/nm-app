export default function Header() {
  return (
    <header className="border-b border-[#1A1A1A] bg-[#F9F9F7]">
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-7 border-r border-[#1A1A1A] p-12 min-h-[320px] flex flex-col justify-end">
          <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-tight mb-4">
            Paper &<br />Ink
          </h1>
          <p className="text-[11px] uppercase tracking-[0.15em] mt-2">
            Est. 2026
          </p>
        </div>
        <div className="col-span-5 p-12 flex items-end">
          <p className="text-[13px] leading-relaxed max-w-[280px]">
            A study in typographic restraint, editorial precision, and the deliberate use of space.
          </p>
        </div>
      </div>
    </header>
  );
}
