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

const amenitiesMap: Record<string, React.ReactNode> = {
  "Bowling Alley": <Sparkles className="w-6 h-6" />,
  "Putting Range": <Navigation className="w-6 h-6" />,
  "Spa & Sauna": <Droplets className="w-6 h-6" />,
  "Wine Cellar": <Wine className="w-6 h-6" />,
  "94 Solar Panels": <Sun className="w-6 h-6" />,
  "10-Car Garage": <Car className="w-6 h-6" />,
  "Saltwater Pools": <Waves className="w-6 h-6" />,
  "2 Elevators": <Fan className="w-6 h-6" />,
  "Private Gym": <Dumbbell className="w-6 h-6" />,
  "Security System": <Camera className="w-6 h-6" />,
  "Smart Home Tech": <Wifi className="w-6 h-6" />,
  "Landscaped Gardens": <Trees className="w-6 h-6" />,
};

interface Amenity {
  icon: React.ReactNode;
  label: string;
}

interface AmenitiesGridProps {
  amenities?: string[];
}

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  const displayedAmenities: Amenity[] =
    amenities && amenities.length > 0
      ? amenities.map((label) => ({
          icon: amenitiesMap[label] || <Sparkles className="w-6 h-6" />,
          label,
        }))
      : Object.entries(amenitiesMap).map(([label, icon]) => ({ icon, label }));

  if (displayedAmenities.length === 0) return null;

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
          {displayedAmenities.map((amenity, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-[#1A1A1A] border border-white/5 hover:border-[#fbbf24]/30 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="text-[#fbbf24] group-hover:scale-110 transition-transform">
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
