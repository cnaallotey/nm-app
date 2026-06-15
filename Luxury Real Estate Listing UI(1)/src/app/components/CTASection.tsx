import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-[#0F0F0F] py-20 lg:py-32 px-6 lg:px-12 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tJTIwbWFzdGVyJTIwc3VpdGV8ZW58MXx8fHwxNzc1MjIwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury Interior"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        className="max-w-[1440px] mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="font-['Montserrat'] text-base lg:text-xl font-light text-white/70 mb-10 max-w-3xl mx-auto">
          Whether you're buying, renting, or investing, our digital-driven solutions make property acquisition seamless and professional.
        </p>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <button className="px-10 py-4 bg-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all inline-flex items-center space-x-2 group">
            <span>Give Us a Call</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-4 bg-transparent border border-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all">
            Browse Properties
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-16 border-t border-white/10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div>
            <div className="font-['Montserrat'] text-xs font-medium uppercase tracking-[0.15em] text-white/50 mb-2">
              Call Us
            </div>
            <a
              href="tel:+233302523984"
              className="font-['Montserrat'] text-lg text-white hover:text-[#fbbf24] transition-colors"
            >
              +233 (0) 302 523 984
            </a>
          </div>
          <div>
            <div className="font-['Montserrat'] text-xs font-medium uppercase tracking-[0.15em] text-white/50 mb-2">
              Email Us
            </div>
            <a
              href="mailto:info@nouvellemaisonlimited.com"
              className="font-['Montserrat'] text-lg text-white hover:text-[#fbbf24] transition-colors"
            >
              info@nouvellemaisonlimited.com
            </a>
          </div>
          <div>
            <div className="font-['Montserrat'] text-xs font-medium uppercase tracking-[0.15em] text-white/50 mb-2">
              Visit Us
            </div>
            <div className="font-['Montserrat'] text-lg text-white">
              No. 36 Lagos Avenue, East Legon
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
