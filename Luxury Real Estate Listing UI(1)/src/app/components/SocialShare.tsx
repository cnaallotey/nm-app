import { motion } from "motion/react";
import { Facebook, Twitter, Mail, Share2 } from "lucide-react";

export function SocialShare() {
  return (
    <div className="bg-[#1A1A1A] py-8 px-6 lg:px-12 border-t border-white/5">
      <motion.div
        className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-['Montserrat'] text-xs font-medium uppercase tracking-[0.15em] text-white/60">
          Share This Listing
        </span>
        <div className="flex items-center space-x-4">
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#fbbf24] hover:border-[#fbbf24] transition-all group">
            <Facebook className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#fbbf24] hover:border-[#fbbf24] transition-all group">
            <Twitter className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#fbbf24] hover:border-[#fbbf24] transition-all group">
            <Mail className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#fbbf24] hover:border-[#fbbf24] transition-all group">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
