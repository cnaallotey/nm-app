import { motion } from 'motion/react';

export function Header() {
  return (
    <header className="border-b-4 border-primary py-12 mb-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[2.5rem] md:text-[3.5rem] leading-[1.1] mb-3 px-4"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
          >
            The Modern Archivist
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] md:text-[14px] uppercase tracking-[0.15em] md:tracking-[0.2em] mb-2 px-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            A Digital Archive of Scholarly Research
          </motion.div>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-[2px] bg-primary mx-auto mt-6"
          ></motion.div>
        </div>
      </div>
    </header>
  );
}
