import { motion } from "motion/react";
import { ArrowRight, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "react-router";
import allProperties from "@/data/properties.json";
import type { Property } from "@/data/types";

const featuredProperties = allProperties.filter((p: Property) => p.featured);

export function FeaturedProperties() {
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
            Featured Estates
          </h2>
          <p className="font-['Montserrat'] text-base lg:text-lg font-light text-white/60 max-w-2xl mx-auto">
            Discover our handpicked selection of the world's most extraordinary properties
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/property/${property.id}`} className="group block">
                <div className="relative h-[400px] overflow-hidden rounded-2xl mb-6">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Property Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-['Cormorant_Garamond'] text-3xl font-light text-white mb-2">
                          {property.title}
                        </h3>
                        <p className="font-['Montserrat'] text-sm text-white/70">
                          {property.location}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-[#C9A96E] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-[#1A1A1A]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="flex flex-col md:flex-row gap-y-2 md:items-center justify-between px-2">
                  <div className="font-['Cormorant_Garamond'] text-3xl font-light text-[#C9A96E]">
                    {property.price}
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-white/60">
                      <Bed className="w-4 h-4" />
                      <span className="font-['Montserrat'] text-sm">{property.beds}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/60">
                      <Bath className="w-4 h-4" />
                      <span className="font-['Montserrat'] text-sm">{property.baths}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/60">
                      <Maximize className="w-4 h-4" />
                      <span className="font-['Montserrat'] text-sm">{property.sqft} SF</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/listings"
            className="px-10 py-4 bg-transparent border border-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-all inline-flex items-center space-x-2 group"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
