import { motion } from "motion/react";

export function ContactForm() {
  return (
    <div className="bg-[#1A1A1A] py-16 px-6 lg:px-12">
      <motion.div
        className="max-w-[1440px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#0F0F0F] border-l-4 border-[#C9A96E] rounded-2xl p-8 lg:p-12">
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-4">
            Interested in Villa Serena?
          </h2>
          <p className="font-['Montserrat'] text-sm text-white/60 mb-10">
            Fill out the form below and one of our property specialists will be in touch within 24 hours.
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#C9A96E] focus:outline-none transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#C9A96E] focus:outline-none transition-colors"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#C9A96E] focus:outline-none transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#C9A96E] focus:outline-none transition-colors"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#C9A96E] focus:outline-none transition-colors resize-none"
                placeholder="I'm interested in learning more about this property..."
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                className="mt-1 w-4 h-4 rounded border-white/20 bg-[#1A1A1A] text-[#C9A96E] focus:ring-[#C9A96E]"
              />
              <label htmlFor="consent" className="font-['Montserrat'] text-xs text-white/50 leading-relaxed">
                By submitting this form, I agree to be contacted by  NOUVELLE MAISON regarding this property and other listings. I understand I can opt out at any time.
              </label>
            </div>

            <button
              type="submit"
              className="w-full lg:w-auto px-12 py-4 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all hover:shadow-lg hover:shadow-[#C9A96E]/20"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
