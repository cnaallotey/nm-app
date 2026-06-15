import { motion } from "motion/react";
import { Building2, Waves, Mountain, TreePine } from "lucide-react";

const categories = [
  {
    icon: <Waves className="w-10 h-10" />,
    title: "Waterfront Estates",
    description: "Exclusive beachfront and lakeside properties",
    properties: 48,
    image: "https://images.unsplash.com/photo-1758192838598-a1de4da5dcaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yJTIwcG9vbCUyMHN1bnNldHxlbnwxfHx8fDE3NzUyOTkwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    icon: <Building2 className="w-10 h-10" />,
    title: "Urban Penthouses",
    description: "Sky-high luxury in Accra's premier locations",
    properties: 35,
    image: "https://images.unsplash.com/photo-1664353656766-4a51425753df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZW50aG91c2UlMjBjaXR5JTIwdmlldyUyMG5pZ2h0fGVufDF8fHx8MTc3NTI5OTY1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    icon: <Mountain className="w-10 h-10" />,
    title: "Gated Communities",
    description: "Exclusive estates in secure gated enclaves",
    properties: 62,
    image: "https://images.unsplash.com/photo-1579991515244-f8ec47f8263d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlc3RhdGUlMjBpbmZpbml0eSUyMHBvb2wlMjBvY2VhbnxlbnwxfHx8fDE3NzUyOTk2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    icon: <TreePine className="w-10 h-10" />,
    title: "Executive Mansions",
    description: "Grand residences for distinguished living",
    properties: 28,
    image: "https://images.unsplash.com/photo-1629787302738-2c6e9f3dada1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBtYW5zaW9uJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NTI5OTA2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function PropertyCategories() {
  return (
    <section className="bg-[#0F0F0F] py-20 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl lg:text-6xl font-light text-white mb-4">
            Explore by Category
          </h2>
          <p className="font-['Montserrat'] text-base lg:text-lg font-light text-white/60 max-w-2xl mx-auto">
            From beachfront villas to city penthouses, find your perfect sanctuary
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-[#fbbf24] mb-4 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-2">
                  {category.title}
                </h3>
                <p className="font-['Montserrat'] text-sm text-white/70 mb-4">
                  {category.description}
                </p>
                <div className="font-['Montserrat'] text-xs uppercase tracking-[0.15em] text-[#fbbf24]">
                  {category.properties} Properties
                </div>
              </div>

              {/* Hover Border */}
              <div className="absolute inset-0 border-2 border-[#fbbf24] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
