interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  onClick: () => void;
}

export default function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  category,
  onClick,
}: BlogCardProps) {
  return (
    <article
      onClick={onClick}
      className="border border-[#1A1A1A] p-8 cursor-pointer hover:bg-[#1A1A1A] hover:text-[#F9F9F7] transition-colors duration-0 group"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-[11px] tracking-[0.15em] uppercase text-[#6B6B6B] group-hover:text-[#F9F9F7]">
          {category}
        </span>
        <div className="flex items-center gap-4 text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B] group-hover:text-[#F9F9F7]">
          <span>{date}</span>
          <span className="w-[1px] h-[10px] bg-[#1A1A1A] group-hover:bg-[#F9F9F7]" />
          <span>{readTime}</span>
        </div>
      </div>

      <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] mb-4">
        {title}
      </h2>

      <p className="text-[13px] leading-[1.7] tracking-[-0.01em] text-[#6B6B6B] group-hover:text-[#E5E5E3]">
        {excerpt}
      </p>

      <div className="mt-6 pt-6 border-t border-[#1A1A1A] group-hover:border-[#F9F9F7]">
        <span className="text-[11px] tracking-[0.15em] uppercase group-hover:text-[#002FA7]">
          Read Essay →
        </span>
      </div>
    </article>
  );
}
