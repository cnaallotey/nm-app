import { useState } from 'react';
import { motion } from 'motion/react';
import { CitationButton } from './CitationButton';

interface ArticleCardProps {
  title: string;
  author: string;
  credentials: string;
  field: string;
  date: string;
  abstract: string;
  content?: string;
  citations?: number;
  journalName?: string;
  featured?: boolean;
  keywords?: string[];
}

export function ArticleCard({
  title,
  author,
  credentials,
  field,
  date,
  abstract,
  content,
  citations = 0,
  journalName,
  featured = false,
  keywords = [],
}: ArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const citationText = `${author}, "${title}", ${journalName || 'Personal Archive'}, ${date}.`;

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = (abstract + (content || '')).split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-card border-t-2 border-b border-border-heavy ${featured ? 'pb-12 mb-12' : 'pb-8 mb-8'}`}
    >
      <div className={`${featured ? 'pt-12' : 'pt-8'}`}>
        {/* Article Header */}
        <div className="text-center mb-8">
          <div
            className="uppercase tracking-[0.15em] mb-4 opacity-60"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em' }}
          >
            {field}
          </div>
          <h2
            className={`${featured ? 'text-[2.75rem] leading-[1.1]' : 'text-[2rem] leading-[1.15]'} mb-4 px-4 cursor-pointer hover:opacity-70 transition-opacity duration-300`}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
          >
            {title}
          </h2>
          <div className="space-y-1">
            {/* <div
              className="text-[15px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {author}, {credentials}
            </div> */}
            {journalName && (
              <div
                className="uppercase tracking-[0.12em] opacity-50 text-[11px]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Published in {journalName}
              </div>
            )}
            <div
              className="opacity-40 text-[13px]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {date}
            </div>
            {readTime > 0 && (
              <div
                className="opacity-30 text-[11px] mt-1"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {readTime} min read
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Rule */}
        <div className="h-[1px] bg-rule-color opacity-20 mb-8"></div>

        {/* Abstract */}
        <div className={`${featured ? 'max-w-3xl' : 'max-w-2xl'} mx-auto px-6`}>
          <p
            className={`italic mb-6 text-[17px] leading-[1.6] opacity-80 ${featured ? 'drop-cap' : ''}`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {abstract}
          </p>

          {/* Article Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] sm:text-[13px] uppercase tracking-[0.1em] px-4 py-2 border border-border hover:bg-muted transition-colors w-full sm:w-auto"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {isExpanded ? 'Show Less' : 'Read Full Article'}
            </button>
            <CitationButton citation={citationText} />
          </div>

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="text-[10px] uppercase tracking-[0.1em] px-2 py-1 border border-border opacity-50 hover:opacity-100 transition-opacity"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Expanded Content */}
        {isExpanded && content && (
          <>
            <div className="h-[2px] bg-rule-color opacity-20 my-8"></div>
            <div
              className="max-w-2xl mx-auto px-6 prose"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <div className="text-[17px] leading-[1.7] whitespace-pre-line">
                {content}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.article>
  );
}
