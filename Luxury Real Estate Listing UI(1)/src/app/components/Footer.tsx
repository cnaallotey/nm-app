import { motion } from "motion/react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Properties", href: "/listings" },
  { label: "Contact Us", href: "/contact" },
];

const propertyTypes = [
  { label: "Waterfront Estates", href: "/listings?type=waterfront" },
  { label: "Penthouses", href: "/listings?type=penthouse" },
  { label: "Gated Communities", href: "/listings?type=gated" },
  { label: "Executive Mansions", href: "/listings?type=mansion" },
  { label: "Townhouses", href: "/listings?type=townhouse" },
];

export function Footer() {
  return (
    <footer className="bg-[#0F0F0F] border-t border-white/5">
      {/* Newsletter Section */}
      <div className="py-16 px-6 lg:px-12 border-b border-white/5">
        <motion.div
          className="max-w-[1440px] mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl font-light text-white mb-4">
            Join Our Network
          </h3>
          <p className="font-['Montserrat'] text-sm text-white/60 mb-8 max-w-2xl mx-auto">
            Stay informed about exclusive luxury properties and market insights. Subscribe to receive curated listings directly to your inbox.
          </p>
          <form className="flex flex-col lg:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#C9A96E] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <Link to="/" className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-4 block">
                 NOUVELLE MAISON
              </Link>
              <p className="font-['Montserrat'] text-sm text-white/50 leading-relaxed">
                Digital-driven realty solutions provider since 2022.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
                Explore
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-['Montserrat'] text-sm text-white/60 hover:text-[#C9A96E] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Property Types */}
            <div>
              <h4 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
                Property Types
              </h4>
              <ul className="space-y-3">
                {propertyTypes.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-['Montserrat'] text-sm text-white/60 hover:text-[#C9A96E] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#C9A96E] mt-1 flex-shrink-0" />
                  <span className="font-['Montserrat'] text-sm text-white/60 leading-relaxed">
                    No. 36 Lagos Avenue<br />East Legon, Ghana
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-[#C9A96E] mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <a
                      href="tel:+233302523984"
                      className="block font-['Montserrat'] text-sm text-white/60 hover:text-[#C9A96E] transition-colors"
                    >
                      +233 (0) 302 523 984
                    </a>
                    <a
                      href="tel:+233303983219"
                      className="block font-['Montserrat'] text-sm text-white/60 hover:text-[#C9A96E] transition-colors"
                    >
                      +233 (0) 303 983 219
                    </a>
                    <a
                      href="tel:+233257728848"
                      className="block font-['Montserrat'] text-sm text-white/60 hover:text-[#C9A96E] transition-colors"
                    >
                      +233 (0) 257 728 848
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-[#C9A96E] mt-1 flex-shrink-0" />
                  <a
                    href="mailto:info@nouvellemaisonlimited.com"
                    className="font-['Montserrat'] text-sm text-white/60 hover:text-[#C9A96E] transition-colors"
                  >
                    info@nouvellemaisonlimited.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <p className="font-['Montserrat'] text-xs text-white/40">
                © 2025 Nouvelle Maison Ltd. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <a
                  href="#"
                  className="font-['Montserrat'] text-xs text-white/40 hover:text-[#C9A96E] transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="font-['Montserrat'] text-xs text-white/40 hover:text-[#C9A96E] transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="font-['Montserrat'] text-xs text-white/40 hover:text-[#C9A96E] transition-colors"
                >
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
