import { useState } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useNavigate } from "react-router";

export function LandingHero() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (propertyType) params.set("type", propertyType);
    if (priceRange) params.set("price", priceRange);
    navigate(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 lg:py-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1758192838598-a1de4da5dcaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yJTIwcG9vbCUyMHN1bnNldHxlbnwxfHx8fDE3NzUyOTkwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury Estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#1A1A1A]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-6xl lg:text-8xl font-light text-white mb-4 sm:mb-6 leading-tight">
            Luxury Living
            <br />
            Within Reach
          </h1>
          <p className="font-['Montserrat'] text-sm sm:text-lg lg:text-xl font-light text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto">
            All-in-one digital realty solutions — crafted for comfort, style, and effortless luxury
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3">
            <div className="flex flex-col lg:flex-row gap-2 sm:gap-3">
              <div className="flex-1 flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-lg">
                <MapPin className="w-5 h-5 text-[#C9A96E]" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 bg-transparent border-none outline-none font-['Montserrat'] text-sm text-white placeholder:text-white/50"
                />
              </div>
              <div className="flex-1 flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-lg">
                <Home className="w-5 h-5 text-[#C9A96E]" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none font-['Montserrat'] text-sm text-white cursor-pointer"
                >
                  <option value="">Property Type</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="estate">Estate</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>
              <div className="flex-1 flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-lg">
                <DollarSign className="w-5 h-5 text-[#C9A96E]" />
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none font-['Montserrat'] text-sm text-white cursor-pointer"
                >
                  <option value="">Price Range</option>
                  <option value="0-5">Under GH₵ 5M</option>
                  <option value="5-10">GH₵ 5M - 10M</option>
                  <option value="10-15">GH₵ 10M - 15M</option>
                  <option value="15+">GH₵ 15M+</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            className="mt-10 sm:mt-20 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div>
              <div className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl lg:text-5xl font-light text-[#C9A96E] mb-1 sm:mb-2">
                GH₵ 2B+
              </div>
              <div className="font-['Montserrat'] text-[10px] sm:text-xs font-medium uppercase tracking-[0.1em] sm:tracking-[0.15em] text-white/60">
                In Sales
              </div>
            </div>
            <div>
              <div className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl lg:text-5xl font-light text-[#C9A96E] mb-1 sm:mb-2">
                1,200+
              </div>
              <div className="font-['Montserrat'] text-[10px] sm:text-xs font-medium uppercase tracking-[0.1em] sm:tracking-[0.15em] text-white/60">
                Properties Sold
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="font-['Cormorant_Garamond']  text-2xl sm:text-4xl lg:text-5xl font-light text-[#C9A96E] mb-1 sm:mb-2">
                20
              </div>
              <div className="font-['Montserrat'] text-[10px] sm:text-xs font-medium uppercase tracking-[0.1em] sm:tracking-[0.15em] text-white/60">
                Years Experience
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
