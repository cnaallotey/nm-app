import { motion } from "motion/react";

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <div className="bg-[#1A1A1A] py-16 px-6 lg:px-12">
      <motion.div
        className="max-w-[1440px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto bg-[#F5F0E8] rounded-2xl p-8 lg:p-12">
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#1A1A1A] mb-8">
            About This Property
          </h2>
          <div className="space-y-6">
            {description.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="font-['Montserrat'] text-base lg:text-lg font-light text-[#1A1A1A]/80 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Pull Quote */}
          <div className="mt-10 pt-10 border-t border-[#1A1A1A]/10">
            <div className="bg-[#C9A96E]/10 border-l-4 border-[#C9A96E] py-6 px-8">
              <p className="font-['Cormorant_Garamond'] text-2xl lg:text-3xl font-light text-[#1A1A1A] italic">
                "27,000 sq ft of air-conditioned living space across three meticulously designed levels"
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
