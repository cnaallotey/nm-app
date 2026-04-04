import { motion } from "motion/react";
import { Building2, Users, Award, Globe } from "lucide-react";

const services = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Property Acquisition",
    description: "Expert guidance through every step of purchasing your dream estate, from initial search to final closing.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Concierge Services",
    description: "White-glove service connecting you with architects, designers, and property management professionals.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Market Analysis",
    description: "In-depth market intelligence and valuation services to ensure optimal investment decisions.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Network",
    description: "Access to exclusive off-market opportunities through our West African luxury real estate network.",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-[#0F0F0F] py-20 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-5xl lg:text-6xl font-light text-white mb-6">
              Redefining Luxury Real Estate
            </h2>
            <p className="font-['Montserrat'] text-base lg:text-lg font-light text-white/70 leading-relaxed mb-6">
              For two decades,  NOUVELLE MAISON has been the trusted name in Ghana's luxury real estate, representing the nation's most exceptional properties and distinguished clientele.
            </p>
            <p className="font-['Montserrat'] text-base lg:text-lg font-light text-white/70 leading-relaxed">
              Our commitment to discretion, integrity, and unparalleled service has established us as the premier brokerage for ultra-luxury properties across Ghana and West Africa.
            </p>
          </div>

          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1629787302738-2c6e9f3dada1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBtYW5zaW9uJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NTI5OTA2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Luxury Estate"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="p-8 bg-[#1A1A1A] border border-white/5 rounded-2xl hover:border-[#C9A96E]/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-[#C9A96E] mb-4">{service.icon}</div>
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-3">
                {service.title}
              </h3>
              <p className="font-['Montserrat'] text-sm text-white/60 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
