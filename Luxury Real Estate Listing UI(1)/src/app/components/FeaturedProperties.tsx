import { motion } from "motion/react";
import { ArrowRight, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "react-router";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
}

const featuredProperties: Property[] = [
  {
    id: "villa-serena",
    title: "Villa Serena",
    location: "East Legon, Accra",
    price: "GH₵ 12,500,000",
    beds: 7,
    baths: 9,
    sqft: "27,000",
    image: "https://images.unsplash.com/photo-1758192838598-a1de4da5dcaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yJTIwcG9vbCUyMHN1bnNldHxlbnwxfHx8fDE3NzUyOTkwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "modern-estate",
    title: "Modern Architectural Estate",
    location: "Airport Residential, Accra",
    price: "GH₵ 18,750,000",
    beds: 8,
    baths: 12,
    sqft: "32,000",
    image: "https://images.unsplash.com/photo-1629787302738-2c6e9f3dada1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBtYW5zaW9uJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NTI5OTA2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "waterfront-penthouse",
    title: "Waterfront Penthouse",
    location: "Cantonments, Accra",
    price: "GH₵ 15,900,000",
    beds: 5,
    baths: 7,
    sqft: "18,500",
    image: "https://images.unsplash.com/photo-1613545325268-9265e1609167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NTIwMjExM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "contemporary-villa",
    title: "Contemporary Villa",
    location: "Trasacco Valley, Accra",
    price: "GH₵ 9,800,000",
    beds: 6,
    baths: 8,
    sqft: "22,400",
    image: "https://images.unsplash.com/photo-1768039049614-f3c2bae3f1db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwa2l0Y2hlbiUyMG1hcmJsZSUyMGNvdW50ZXJ0b3B8ZW58MXx8fHwxNzc1Mjk5MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

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
                <div className="flex items-center justify-between px-2">
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
