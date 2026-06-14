import { useEffect, useRef, useState } from 'react';

interface BlogPostProps {
  title: string;
  date: string;
  readTime: string;
  image?: string;
  imageCaption?: string;
  content: string[];
}

export default function BlogPost({
  title,
  date,
  readTime,
  image,
  imageCaption,
  content,
}: BlogPostProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const postRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!postRef.current) return;

      const element = postRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = element.offsetHeight;

      const scrollableDistance = elementHeight - windowHeight;
      const scrolled = -rect.top;

      const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <article ref={postRef} className="relative">
      {/* Reading Progress Indicator */}
      <div className="fixed left-0 top-0 bottom-0 w-[1px] bg-[#E5E5E3] z-40">
        <div
          className="w-full bg-[#002FA7] transition-all duration-100 ease-linear"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      <div className="max-w-[720px] mx-auto px-12 py-24">
        {/* Metadata */}
        <div className="flex items-center gap-8 mb-12 text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B]">
          <span>{date}</span>
          <span className="w-[1px] h-[12px] bg-[#1A1A1A]" />
          <span>{readTime} Read</span>
        </div>

        {/* Title */}
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-tight mb-16">
          {title}
        </h1>

        {/* Image */}
        {image && (
          <figure className="mb-16 border border-[#1A1A1A] p-2">
            <div className="w-full h-[400px] bg-[#E5E5E3] overflow-hidden">
              <img
                src={image}
                alt={imageCaption || title}
                className="w-full h-full object-cover"
              />
            </div>
            {imageCaption && (
              <figcaption className="text-[11px] leading-relaxed mt-3 px-2 text-[#6B6B6B]">
                {imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Content */}
        <div className="space-y-8">
          {content.map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-[1.8] tracking-[-0.01em]">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <div className="text-[11px] tracking-[0.1em] uppercase text-[#6B6B6B]">
              End of Essay
            </div>
            <button className="border border-[#1A1A1A] px-6 py-3 text-[11px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] hover:text-[#F9F9F7] transition-colors duration-0">
              Share
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
