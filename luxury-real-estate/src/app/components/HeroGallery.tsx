import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroGalleryProps {
  images: string[];
  address?: string;
}

export function HeroGallery({ images, address }: HeroGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative w-full">
        {/* Main Image */}
        <div className="relative w-full h-[70vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`Property view ${activeIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          {/* Address Overlay */}
          {address && (
            <div className="absolute bottom-8 left-6 lg:left-12">
              <p className="font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                {address}
              </p>
            </div>
          )}

          {/* Watch Video Button */}
          <button className="absolute top-8 right-6 lg:right-12 flex items-center space-x-2 px-6 py-3 bg-transparent border border-white/40 rounded-full backdrop-blur-sm hover:bg-white/10 hover:border-white/60 transition-all group">
            <Play className="w-4 h-4 text-white group-hover:text-[#fbbf24] transition-colors" />
            <span className="font-['Montserrat'] text-[11px] font-medium uppercase tracking-[0.15em] text-white">
              Watch Video
            </span>
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Filmstrip */}
        <div className="bg-[#1A1A1A] py-4 px-6 lg:px-12">
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative h-24 overflow-hidden rounded-sm transition-all ${
                  index === activeIndex
                    ? "ring-2 ring-[#fbbf24] opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-[#fbbf24] transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={images[activeIndex]}
              alt={`Full view ${activeIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
