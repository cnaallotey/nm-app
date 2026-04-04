import { motion } from "motion/react";
import {
  Wine,
  Dumbbell,
  Car,
  Waves,
  Wifi,
  Fan,
  Camera,
  Sparkles,
  Trees,
  Droplets,
  Sun,
  Navigation,
} from "lucide-react";

interface Amenity {
  icon: React.ReactNode;
  label: string;
}

const amenitiesList: Amenity[] = [
  { icon: <Sparkles className="w-6 h-6" />, label: "Bowling Alley" },
  { icon: <Navigation className="w-6 h-6" />, label: "Putting Range" },
  { icon: <Droplets className="w-6 h-6" />, label: "Spa & Sauna" },
  { icon: <Wine className="w-6 h-6" />, label: "Wine Cellar" },
  { icon: <Sun className="w-6 h-6" />, label: "94 Solar Panels" },
  { icon: <Car className="w-6 h-6" />, label: "10-Car Garage" },
  { icon: <Waves className="w-6 h-6" />, label: "Saltwater Pools" },
  { icon: <Fan className="w-6 h-6" />, label: "2 Elevators" },
  { icon: <Dumbbell className="w-6 h-6" />, label: "Private Gym" },
  { icon: <Camera className="w-6 h-6" />, label: "Security System" },
  { icon: <Wifi className="w-6 h-6" />, label: "Smart Home Tech" },
  { icon: <Trees className="w-6 h-6" />, label: "Landscaped Gardens" },
];

export function AmenitiesGrid() {
  return (
    <div className="bg-[#1A1A1A] py-16 px-6 lg:px-12">
      <motion.div
        className="max-w-[1440px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-12 text-center">
          Premium Amenities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {amenitiesList.map((amenity, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-[#1A1A1A] border border-white/5 hover:border-[#C9A96E]/30 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="text-[#C9A96E] group-hover:scale-110 transition-transform">
                {amenity.icon}
              </div>
              <span className="font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 group-hover:text-white transition-colors">
                {amenity.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
