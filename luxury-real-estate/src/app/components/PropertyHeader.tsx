import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface PropertyStat {
  value: string;
  label: string;
}

interface PropertyHeaderProps {
  title: string;
  subtitle: string;
  price: string;
  priceSubtext?: string;
  stats: PropertyStat[];
}

export function PropertyHeader({ title, subtitle, price, priceSubtext, stats }: PropertyHeaderProps) {
  return (
    <div className="bg-[#1A1A1A] py-12 lg:py-16 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Breadcrumbs */}
        <motion.div
          className="flex items-center space-x-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.15em] text-white/40 hover:text-[#fbbf24] transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-white/30" />
          <Link
            href="/listings"
            className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.15em] text-white/40 hover:text-[#fbbf24] transition-colors"
          >
            Listings
          </Link>
          <ChevronRight className="w-3 h-3 text-white/30" />
          <span className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.15em] text-white/60">
            {title}
          </span>
        </motion.div>

        {/* Title Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-white mb-2">
            {title}
          </h1>
          <p className="font-['Montserrat'] text-base lg:text-lg font-light text-white/70">{subtitle}</p>
        </motion.div>

        {/* Price */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-5xl lg:text-6xl font-['Cormorant_Garamond'] font-light text-[#fbbf24] mb-2">
            {price}
          </div>
          {priceSubtext && (
            <p className="font-['Montserrat'] text-xs text-white/50">{priceSubtext}</p>
          )}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-0 lg:divide-x divide-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="lg:px-6 first:lg:pl-0 last:lg:pr-0">
              <div className="font-['Montserrat'] text-2xl lg:text-3xl font-light text-white mb-1">
                {stat.value}
              </div>
              <div className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.15em] text-white/50">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
