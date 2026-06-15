import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface CTAButtonsProps {
  onRequestDetails: () => void;
  onScheduleShowing: () => void;
}

export function CTAButtons({ onRequestDetails, onScheduleShowing }: CTAButtonsProps) {
  return (
    <div className="bg-[#1A1A1A] py-8 px-6 lg:px-12 border-t border-white/5">
      <motion.div
        className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={onRequestDetails}
          className="px-8 py-4 bg-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all hover:shadow-lg hover:shadow-[#fbbf24]/20"
        >
          Request Details
        </button>
        <button
          onClick={onScheduleShowing}
          className="px-8 py-4 bg-transparent border border-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all"
        >
          Schedule A Showing
        </button>
        <Link
          href="/listings"
          className="px-8 py-4 flex items-center justify-center lg:justify-start space-x-2 font-['Montserrat'] text-sm font-medium uppercase tracking-[0.1em] text-white/70 hover:text-[#fbbf24] transition-colors group"
        >
          <span>View More Listings</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}
