import { motion } from "motion/react";
import Link from "next/link";
import {
  Building2,
  Users,
  Award,
  Globe,
  Search,
  FileText,
  Handshake,
  TrendingUp,
  Home,
  Briefcase,
  ShieldCheck,
  Landmark,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { Footer } from "../components/Footer";

const coreServices = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Property Sales",
    description:
      "Nouvelle Maison connects homebuyers to their properties of choice in a professional manner. We offer competitive property listings tailored to meet each buyer's lifestyle and preference.",
    features: [
      "Competitive property listings",
      "Tailored to buyer lifestyle and preference",
      "Professional property matching",
      "End-to-end transaction support",
    ],
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Rentals",
    description:
      "Technology-driven rental solutions that help renters acquire apartments with ease. Our system supports landlords with vacant property advertisements, applicant filtering and occupancy assessment.",
    features: [
      "Vacant property advertisements",
      "Applicant filtering and assessment",
      "Buy-to-let investment optimisation",
      "Commercial property rental management",
    ],
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Property Advisory",
    description:
      "We provide independent, strategic advice to aspiring homeowners, property developers, REITs, landlords, and agents across due diligence, valuation, compliance, and risk management.",
    features: [
      "Due diligence and compliance",
      "Property valuation services",
      "New space acquisition advisory",
      "Risk management guidance",
    ],
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Property Development",
    description:
      "Nouvelle Maison creates distinctive property designs that offer clients memorable living experiences. Clients with existing properties can benefit from our remodelling and renovation services.",
    features: [
      "Distinctive property design",
      "Remodelling and renovation",
      "Lifestyle-driven development",
      "Value and functionality enhancement",
    ],
  },
];

const additionalServices = [
  {
    icon: <Home className="w-6 h-6" />,
    title: "Property Management",
    description:
      "On-site marketing, tenant and business center management, short period letting and AirBnB property management for landlords.",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Property Search",
    description:
      "A bespoke search service for clients with specific requirements — we find what the open market cannot.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Front-of-Office Reception",
    description:
      "Courier, post and visitor management services for residential and commercial properties.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Legal Coordination",
    description:
      "We coordinate with solicitors, surveyors, and the Lands Commission to ensure smooth, secure transactions.",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Investment Advisory",
    description:
      "Strategic guidance for buy-to-let investments ensuring optimal returns for property investors in Ghana.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Due Diligence",
    description:
      "Thorough background checks on properties, titles, and sellers to protect you from fraud and encumbrances.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "AirBnB Management",
    description:
      "End-to-end AirBnB property management for landlords looking to maximise short-term rental income.",
  },
  {
    icon: <Landmark className="w-6 h-6" />,
    title: "Land Acquisition",
    description:
      "Expert guidance on acquiring and securing land for development, including chieftaincy and government land processes.",
  },
];

const process = [
  {
    step: "01",
    title: "Consultation",
    description:
      "We begin with an in-depth conversation to understand your goals, preferences, budget, and timeline.",
  },
  {
    step: "02",
    title: "Strategy",
    description:
      "Our team develops a tailored plan — whether that's a curated property search, a marketing strategy, or an investment roadmap.",
  },
  {
    step: "03",
    title: "Execution",
    description:
      "We handle viewings, negotiations, due diligence, and coordination with all parties to keep the process seamless.",
  },
  {
    step: "04",
    title: "Completion",
    description:
      "From signing to handover, we ensure every detail is managed so you can enjoy your new property with peace of mind.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navigation />

      {/* Hero */}
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
              What We Do
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-white mb-6">
              Our Services
            </h1>
            <p className="font-['Montserrat'] text-base font-light text-white/50 max-w-2xl mx-auto">
              All-in-one digital realty solutions designed to simplify and
              enhance the living experience of our clients across Ghana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Services */}
      <section className="px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-4">
              Core Services
            </h2>
            <p className="font-['Montserrat'] text-sm text-white/50 max-w-xl mx-auto">
              The pillars of our offering — built on expertise, trust, and
              results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreServices.map((service, index) => (
              <motion.div
                key={index}
                className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-8 lg:p-10 hover:border-[#fbbf24]/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 bg-[#fbbf24]/10 rounded-full flex items-center justify-center text-[#fbbf24] flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-['Cormorant_Garamond'] text-3xl font-light text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="font-['Montserrat'] text-sm text-white/50 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="ml-0 lg:ml-[4.75rem] space-y-3">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#fbbf24] mt-0.5 flex-shrink-0" />
                      <span className="font-['Montserrat'] text-sm text-white/60">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#0F0F0F] px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-4">
              How We Work
            </h2>
            <p className="font-['Montserrat'] text-sm text-white/50 max-w-xl mx-auto">
              A proven process that delivers results at every stage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="font-['Cormorant_Garamond'] text-7xl font-light text-[#fbbf24]/15 block mb-2">
                  {step.step}
                </span>
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-3">
                  {step.title}
                </h3>
                <p className="font-['Montserrat'] text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 right-0 translate-x-1/2">
                    <ArrowRight className="w-5 h-5 text-white/10" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Grid */}
      <section className="px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-4">
              Additional Services
            </h2>
            <p className="font-['Montserrat'] text-sm text-white/50 max-w-xl mx-auto">
              Complementary offerings to support every aspect of property
              ownership
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                className="p-6 bg-[#0F0F0F] border border-white/5 rounded-2xl hover:border-[#fbbf24]/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="w-10 h-10 bg-[#fbbf24]/10 rounded-full flex items-center justify-center text-[#fbbf24] mb-4">
                  {service.icon}
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-xl font-light text-white mb-2">
                  {service.title}
                </h3>
                <p className="font-['Montserrat'] text-xs text-white/50 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="bg-[#0F0F0F] px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-6xl font-light text-white mb-6">
              Let's Work Together
            </h2>
            <p className="font-['Montserrat'] text-base font-light text-white/50 max-w-2xl mx-auto mb-10">
              Ready to buy, sell, or invest? Our team is here to provide the
              expert guidance and personalised service you deserve.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-10 py-4 bg-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all inline-flex items-center gap-2 group"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/listings"
                className="px-10 py-4 bg-transparent border border-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all"
              >
                Browse Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
