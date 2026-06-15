import { motion } from "motion/react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: " NOUVELLE MAISON handled our acquisition in Trasacco Valley with exceptional professionalism and discretion. Their knowledge of the Accra market is unmatched.",
    author: "Kwame A.",
    title: "CEO, Energy Sector",
    location: "East Legon, Accra",
  },
  {
    quote: "From our first meeting to closing day, the team provided white-glove service that exceeded every expectation. They truly understand Ghana's luxury market.",
    author: "Ama S.",
    title: "Technology Entrepreneur",
    location: "Cantonments, Accra",
  },
  {
    quote: "After working with several agencies,  NOUVELLE MAISON stood out for their extensive network and ability to source off-market opportunities across Ghana.",
    author: "Kofi M.",
    title: "Diaspora Investor",
    location: "Airport Residential, Accra",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-[#1A1A1A] py-20 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl lg:text-6xl font-light text-white mb-4">
            Client Testimonials
          </h2>
          <p className="font-['Montserrat'] text-base lg:text-lg font-light text-white/60 max-w-2xl mx-auto">
            Trusted by Ghana's most discerning buyers and sellers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-8 lg:p-10 bg-[#0F0F0F] border border-white/5 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Quote className="w-10 h-10 text-[#fbbf24] mb-6" />
              <p className="font-['Montserrat'] text-base font-light text-white/80 leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              <div className="pt-6 border-t border-white/10">
                <div className="font-['Cormorant_Garamond'] text-xl font-light text-white mb-1">
                  {testimonial.author}
                </div>
                <div className="font-['Montserrat'] text-xs text-white/50">
                  {testimonial.title}
                </div>
                <div className="font-['Montserrat'] text-xs text-[#fbbf24] mt-1">
                  {testimonial.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
