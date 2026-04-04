import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Properties", href: "/listings" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="font-['Cormorant_Garamond'] md:text-2xl font-light text-white tracking-wider">
                 NOUVELLE MAISON
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="font-['Montserrat'] text-[11px] font-medium uppercase tracking-[0.15em] text-white/80 hover:text-[#C9A96E] transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C9A96E] transition-all group-hover:w-full" />
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-['Montserrat'] text-[11px] font-medium uppercase tracking-[0.15em] text-white/80 hover:text-[#C9A96E] transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C9A96E] transition-all group-hover:w-full" />
                  </a>
                )
              )}
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <span className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.15em] text-white/60">
                  EN
                </span>
                <span className="text-white/30">|</span>
                <span className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.15em] text-white/60 hover:text-[#C9A96E] transition-colors cursor-pointer">
                  ES
                </span>
              </div>
              <a
                href="tel:+233302741234"
                className="flex items-center space-x-2 font-['Montserrat'] text-sm text-white/90 hover:text-[#C9A96E] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+233 (0) 30 274 1234</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white/90 hover:text-[#C9A96E] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#1A1A1A] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
              {navLinks.map((link, index) =>
                link.href.startsWith("/") ? (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-['Montserrat'] text-xl font-medium uppercase tracking-[0.15em] text-white hover:text-[#C9A96E] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-['Montserrat'] text-xl font-medium uppercase tracking-[0.15em] text-white hover:text-[#C9A96E] transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {link.label}
                  </motion.a>
                )
              )}
              <motion.a
                href="tel:+233302741234"
                className="flex items-center space-x-2 font-['Montserrat'] text-lg text-white/90 hover:text-[#C9A96E] transition-colors mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Phone className="w-5 h-5" />
                <span>+233 (0) 30 274 1234</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}