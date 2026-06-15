"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Bed, Bath, Maximize } from "lucide-react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing } from "@/lib/types";

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const q = query(
          collection(db, "listings"),
          where("status", "==", "published"),
          where("featured", "==", true)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Listing[];
        
        // Client-side sort to avoid requiring composite index creation
        list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setProperties(list);
      } catch (err) {
        console.error("Error fetching featured properties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="bg-[#1A1A1A] py-24 lg:py-32 px-6 lg:px-12 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fbbf24]">
            Selected Portfolio
          </span>
          <h2 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-6xl font-light text-white mt-4 mb-6 leading-tight">
            Featured Properties
          </h2>
          <p className="font-['Montserrat'] text-sm sm:text-base font-light text-white/60 max-w-xl">
            Explore our curated selection of signature real estate representing the pinnacle of design, luxury, and comfort in Accra.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 font-['Montserrat'] text-white/40">
            <div className="w-8 h-8 border border-[#fbbf24] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <span>Loading featured portfolio...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/property/${property.id}`} className="group block">
                  <div className="relative h-[400px] overflow-hidden rounded-2xl mb-6">
                    <img
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1080"}
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
                      <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-[#1A1A1A]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <span className="font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#fbbf24] bg-[#fbbf24]/10 px-3 py-1 rounded">
                    For Sale
                  </span>
                  <span className="font-['Cormorant_Garamond'] text-2xl text-[#fbbf24] font-medium">
                    {property.price}
                  </span>
                </div>

                <div className="flex items-center space-x-6 border-t border-white/5 pt-4 text-white/60">
                  <div className="flex items-center space-x-2">
                    <Bed className="w-4 h-4 text-[#fbbf24]" />
                    <span className="font-['Montserrat'] text-xs font-light">
                      {property.beds} Beds
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bath className="w-4 h-4 text-[#fbbf24]" />
                    <span className="font-['Montserrat'] text-xs font-light">
                      {property.baths} Baths
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Maximize className="w-4 h-4 text-[#fbbf24]" />
                    <span className="font-['Montserrat'] text-xs font-light">
                      {property.sqft} SqFt
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/listings"
            className="px-10 py-4 bg-transparent border border-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all inline-flex items-center space-x-2 group"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
