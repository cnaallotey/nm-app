import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 px-4 py-3 bg-primary text-primary-foreground border-2 border-primary hover:bg-background hover:text-foreground transition-colors shadow-lg"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <div className="text-[11px] uppercase tracking-[0.12em]">↑ Top</div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
