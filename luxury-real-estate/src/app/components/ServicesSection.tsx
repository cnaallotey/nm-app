import { motion } from "motion/react";
import { Building2, Users, Award, Globe } from "lucide-react";

const services = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Property Sales",
    description: "Connecting homebuyers to their properties of choice in a professional manner with competitive listings tailored to meet each buyer's lifestyle.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Rentals",
    description: "Technology-driven rental solutions that help renters acquire apartments with ease, supporting landlords with tenant filtering and occupancy assessment.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Property Advisory",
    description: "Independent, strategic advice across due diligence, property valuation, new space acquisition, compliance, and risk management.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Property Development",
    description: "Distinctive property designs that offer clients memorable living experiences, including remodelling and renovation services.",
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
              Nouvelle Maison is a digital-driven realty solutions provider. We offer intelligent solutions that empower homeowners, property investors and real estate agents.
            </p>
            <p className="font-['Montserrat'] text-base lg:text-lg font-light text-white/70 leading-relaxed">
              Founded in 2022 with the vision of providing real-time real estate solutions backed by digital technology, we bring professionalism into real estate with scientific but flexible service delivery.
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
              className="p-8 bg-[#1A1A1A] border border-white/5 rounded-2xl hover:border-[#fbbf24]/30 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-[#fbbf24] mb-4">{service.icon}</div>
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
