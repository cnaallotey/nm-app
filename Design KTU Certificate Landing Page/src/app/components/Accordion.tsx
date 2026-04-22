import { useState } from 'react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="text-[#1a1a1a] pr-4" style={{ fontSize: '15px', fontWeight: 500 }}>
              {item.question}
            </span>
            <span className="text-pink-600 flex-shrink-0" style={{ fontSize: '20px' }}>
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          {openIndex === index && (
            <div className="mt-3 text-gray-600" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
