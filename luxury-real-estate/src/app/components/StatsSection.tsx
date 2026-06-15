import { motion } from "motion/react";
import { TrendingUp, Home, Users, Globe } from "lucide-react";

const stats = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: "GH₵ 2.4B+",
    label: "Total Sales Volume",
    description: "In luxury property transactions",
  },
  {
    icon: <Home className="w-8 h-8" />,
    value: "1,200+",
    label: "Properties Sold",
    description: "Across Ghana's premium markets",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: "950+",
    label: "Satisfied Clients",
    description: "Trust us with their investments",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    value: "5",
    label: "Core Services",
    description: "Comprehensive realty solutions",
  },
];

export function StatsSection() {
  return (
    <section className="bg-[#1A1A1A] py-20 lg:py-32 px-6 lg:px-12 border-y border-white/5">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl lg:text-6xl font-light text-white mb-4">
            Excellence in Numbers
          </h2>
          <p className="font-['Montserrat'] text-base lg:text-lg font-light text-white/60 max-w-2xl mx-auto">
            Our track record speaks for itself
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fbbf24]/10 rounded-full text-[#fbbf24] mb-6">
                {stat.icon}
              </div>
              <div className="font-['Cormorant_Garamond'] text-5xl font-light text-white mb-2">
                {stat.value}
              </div>
              <div className="font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.15em] text-white/80 mb-2">
                {stat.label}
              </div>
              <div className="font-['Montserrat'] text-sm text-white/50">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
