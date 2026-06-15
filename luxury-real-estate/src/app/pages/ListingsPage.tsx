"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Bed,
  Bath,
  Maximize,
  MapPin,
  ChevronDown,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  category: string;
  featured?: boolean;
}

const categories = [
  "All",
  "Waterfront Estates",
  "Urban Penthouses",
  "Gated Communities",
  "Executive Mansions",
];

const priceRanges = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under GH₵ 5M", min: 0, max: 5000000 },
  { label: "GH₵ 5M - 10M", min: 5000000, max: 10000000 },
  { label: "GH₵ 10M - 15M", min: 10000000, max: 15000000 },
  { label: "GH₵ 15M+", min: 15000000, max: Infinity },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Largest First", value: "sqft-desc" },
];

const priceParamToIndex: Record<string, number> = {
  "0-5": 1,
  "5-10": 2,
  "10-15": 3,
  "15+": 4,
};

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialPrice = priceParamToIndex[searchParams.get("price") || ""] || 0;

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriceRange, setActivePriceRange] = useState(initialPrice);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const q = query(
          collection(db, "listings"),
          where("status", "==", "published")
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          const priceStr = data.price || "";
          // Extract digits
          const priceCleaned = priceStr.replace(/[^0-9]/g, "");
          const priceVal = parseInt(priceCleaned, 10) || 0;
          
          return {
            id: doc.id,
            title: data.title || "",
            location: data.location || "",
            price: priceStr,
            priceValue: priceVal,
            beds: Number(data.beds || 0),
            baths: Number(data.baths || 0),
            sqft: data.sqft || "",
            image: data.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1080",
            category: data.category || "",
            featured: !!data.featured,
          };
        });
        setProperties(list);
      } catch (err) {
        console.error("Error fetching listings from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Price range
    const range = priceRanges[activePriceRange];
    result = result.filter(
      (p) => p.priceValue >= range.min && p.priceValue < range.max
    );

    // Sort
    switch (sortBy) {
      case "price-desc":
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "price-asc":
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "sqft-desc":
        result.sort(
          (a, b) =>
            parseInt(b.sqft.replace(/,/g, "")) -
            parseInt(a.sqft.replace(/,/g, ""))
        );
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [properties, searchQuery, activeCategory, activePriceRange, sortBy]);

  const activeFilterCount =
    (activeCategory !== "All" ? 1 : 0) + (activePriceRange !== 0 ? 1 : 0);

  const clearFilters = () => {
    setActiveCategory("All");
    setActivePriceRange(0);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navigation />

      {/* Page Hero */}
      <section className="relative pt-32 pb-16 px-6 lg:px-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A]" />
        <div className="relative max-w-[1440px] mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fbbf24] mb-4">
              Our Collection
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-white mb-6">
              Luxury Properties
            </h1>
            <p className="font-['Montserrat'] text-base font-light text-white/50 max-w-2xl mx-auto">
              Browse our curated portfolio of properties across Ghana,
              each selected for comfort, style, and effortless luxury.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-20 z-30 bg-[#1A1A1A]/95 backdrop-blur-md border-y border-white/5 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#fbbf24] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white/70"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#fbbf24] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3 flex-1 justify-end">
              {/* Category Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white/70 hover:border-[#fbbf24]/40 transition-colors">
                  <span>{activeCategory}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-52 bg-[#0F0F0F] border border-white/10 rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-4 py-2.5 font-['Montserrat'] text-sm transition-colors ${
                        activeCategory === cat
                          ? "bg-[#fbbf24]/10 text-[#fbbf24]"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white/70 hover:border-[#fbbf24]/40 transition-colors">
                  <span>{priceRanges[activePriceRange].label}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0F0F0F] border border-white/10 rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl">
                  {priceRanges.map((range, i) => (
                    <button
                      key={range.label}
                      onClick={() => setActivePriceRange(i)}
                      className={`w-full text-left px-4 py-2.5 font-['Montserrat'] text-sm transition-colors ${
                        activePriceRange === i
                          ? "bg-[#fbbf24]/10 text-[#fbbf24]"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white/70 hover:border-[#fbbf24]/40 transition-colors">
                  <span>
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0F0F0F] border border-white/10 rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`w-full text-left px-4 py-2.5 font-['Montserrat'] text-sm transition-colors ${
                        sortBy === opt.value
                          ? "bg-[#fbbf24]/10 text-[#fbbf24]"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode */}
              <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#fbbf24]/10 text-[#fbbf24]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${
                    viewMode === "list"
                      ? "bg-[#fbbf24]/10 text-[#fbbf24]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-3 font-['Montserrat'] text-xs text-[#fbbf24] hover:text-[#D4B87E] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                className="lg:hidden pt-4 pb-2 space-y-4 border-t border-white/5 mt-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category pills */}
                <div>
                  <p className="font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-2">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full font-['Montserrat'] text-xs transition-colors ${
                          activeCategory === cat
                            ? "bg-[#fbbf24] text-[#1A1A1A]"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range pills */}
                <div>
                  <p className="font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-2">
                    Price Range
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range, i) => (
                      <button
                        key={range.label}
                        onClick={() => setActivePriceRange(i)}
                        className={`px-3 py-1.5 rounded-full font-['Montserrat'] text-xs transition-colors ${
                          activePriceRange === i
                            ? "bg-[#fbbf24] text-[#1A1A1A]"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <p className="font-['Montserrat'] text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-2">
                    Sort By
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`px-3 py-1.5 rounded-full font-['Montserrat'] text-xs transition-colors ${
                          sortBy === opt.value
                            ? "bg-[#fbbf24] text-[#1A1A1A]"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="font-['Montserrat'] text-xs text-[#fbbf24] underline"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results Count */}
      <section className="px-6 lg:px-12 pt-8 pb-2">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-['Montserrat'] text-sm text-white/40">
            Showing{" "}
            <span className="text-white/70">{filteredProperties.length}</span>{" "}
            {filteredProperties.length === 1 ? "property" : "properties"}
            {activeCategory !== "All" && (
              <span>
                {" "}
                in{" "}
                <span className="text-[#fbbf24]">{activeCategory}</span>
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Property Grid */}
      <section className="px-6 lg:px-12 py-8 pb-20">
        <div className="max-w-[1440px] mx-auto">
          {loading ? (
            <div className="text-center py-32 font-['Montserrat'] text-white/40">
              <div className="w-12 h-12 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-sm tracking-wider uppercase">Loading Luxury Collection...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              className="text-center py-24"

              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-['Cormorant_Garamond'] text-3xl font-light text-white/40 mb-4">
                No properties found
              </p>
              <p className="font-['Montserrat'] text-sm text-white/30 mb-8">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-transparent border border-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  layout
                >
                  <Link href={`/property/${property.id}`} className="group block">
                    <div className="relative h-[320px] overflow-hidden rounded-2xl mb-5">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Category Tag */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.1em] text-white/80">
                          {property.category}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {property.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-[#fbbf24] rounded-full font-['Montserrat'] text-[10px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                            Featured
                          </span>
                        </div>
                      )}

                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-[#1A1A1A]" />
                      </div>

                      {/* Location */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-white/70" />
                        <span className="font-['Montserrat'] text-xs text-white/70">
                          {property.location}
                        </span>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="px-1">
                      <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-2 group-hover:text-[#fbbf24] transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex flex-col md:flex-row gap-y-2 md:items-center justify-between">
                        <span className="font-['Cormorant_Garamond'] text-2xl font-light text-[#fbbf24]">
                          {property.price}
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Bed className="w-3.5 h-3.5" />
                            <span className="font-['Montserrat'] text-xs">
                              {property.beds}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Bath className="w-3.5 h-3.5" />
                            <span className="font-['Montserrat'] text-xs">
                              {property.baths}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Maximize className="w-3.5 h-3.5" />
                            <span className="font-['Montserrat'] text-xs">
                              {property.sqft} SF
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  layout
                >
                  <Link
                    href={`/property/${property.id}`}
                    className="group flex flex-col md:flex-row gap-6 p-4 rounded-2xl border border-white/5 hover:border-[#fbbf24]/20 transition-all hover:bg-white/[0.02]"
                  >
                    {/* Image */}
                    <div className="relative w-full md:w-72 h-52 md:h-44 flex-shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {property.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-[#fbbf24] rounded-full font-['Montserrat'] text-[10px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.1em] text-[#fbbf24] mb-1 block">
                              {property.category}
                            </span>
                            <h3 className="font-['Cormorant_Garamond'] text-2xl lg:text-3xl font-light text-white group-hover:text-[#fbbf24] transition-colors">
                              {property.title}
                            </h3>
                          </div>
                          <div className="w-10 h-10 bg-white/5 group-hover:bg-[#fbbf24] rounded-full flex items-center justify-center transition-colors flex-shrink-0 ml-4">
                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#1A1A1A] transition-colors" />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 mb-4">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="font-['Montserrat'] text-sm">
                            {property.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-['Cormorant_Garamond'] text-2xl font-light text-[#fbbf24]">
                          {property.price}
                        </span>
                        <div className="flex items-center gap-5">
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Bed className="w-4 h-4" />
                            <span className="font-['Montserrat'] text-sm">
                              {property.beds} Beds
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Bath className="w-4 h-4" />
                            <span className="font-['Montserrat'] text-sm">
                              {property.baths} Baths
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Maximize className="w-4 h-4" />
                            <span className="font-['Montserrat'] text-sm">
                              {property.sqft} SF
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
