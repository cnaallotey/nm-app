import { motion } from "motion/react";
import { Link } from "react-router";
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
    title: "Property Acquisition",
    description:
      "Expert guidance through every step of purchasing your dream property in Ghana — from identifying the right neighbourhood to final closing.",
    features: [
      "Curated property shortlists tailored to your brief",
      "Accompanied viewings with market commentary",
      "Negotiation and offer management",
      "Due diligence and title verification",
    ],
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Property Sales",
    description:
      "Strategic marketing and discreet representation to achieve the best possible outcome when selling your luxury property.",
    features: [
      "Professional photography and virtual tours",
      "Targeted marketing to qualified buyers",
      "Off-market and private sale options",
      "Market positioning and pricing strategy",
    ],
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Valuation & Advisory",
    description:
      "In-depth market intelligence and certified valuations to ensure you make optimal investment decisions with confidence.",
    features: [
      "Certified property valuations",
      "Investment feasibility analysis",
      "Neighbourhood and trend reports",
      "Portfolio review and strategy",
    ],
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Diaspora Investment",
    description:
      "A dedicated programme for Ghanaians abroad looking to invest in premium real estate back home, managed end-to-end on your behalf.",
    features: [
      "Virtual property tours and walkthroughs",
      "Trusted legal and surveyor referrals",
      "Construction progress monitoring",
      "Rental management and income remittance",
    ],
  },
];

const additionalServices = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Concierge Services",
    description:
      "White-glove service connecting you with architects, interior designers, and property management professionals.",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Property Search",
    description:
      "A bespoke search service for clients with specific requirements — we find what the open market cannot.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Legal Coordination",
    description:
      "We coordinate with solicitors, surveyors, and the Lands Commission to ensure smooth, secure transactions.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Relocation Assistance",
    description:
      "Comprehensive support for clients relocating to Ghana — from neighbourhood advice to school and utility setup.",
  },
  {
    icon: <Home className="w-6 h-6" />,
    title: "Property Management",
    description:
      "Ongoing management of your investment property, including tenant sourcing, maintenance, and rent collection.",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Corporate Real Estate",
    description:
      "Sourcing premium office spaces, diplomatic residences, and executive housing for organisations operating in Ghana.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Due Diligence",
    description:
      "Thorough background checks on properties, titles, and sellers to protect you from fraud and encumbrances.",
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
            <p className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A96E] mb-4">
              What We Do
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-white mb-6">
              Our Services
            </h1>
            <p className="font-['Montserrat'] text-base font-light text-white/50 max-w-2xl mx-auto">
              A comprehensive suite of luxury real estate services designed to
              guide you through every stage of property ownership in Ghana.
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
                className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-8 lg:p-10 hover:border-[#C9A96E]/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 bg-[#C9A96E]/10 rounded-full flex items-center justify-center text-[#C9A96E] flex-shrink-0">
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
                      <CheckCircle className="w-4 h-4 text-[#C9A96E] mt-0.5 flex-shrink-0" />
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
                <span className="font-['Cormorant_Garamond'] text-7xl font-light text-[#C9A96E]/15 block mb-2">
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
                className="p-6 bg-[#0F0F0F] border border-white/5 rounded-2xl hover:border-[#C9A96E]/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="w-10 h-10 bg-[#C9A96E]/10 rounded-full flex items-center justify-center text-[#C9A96E] mb-4">
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
                to="/contact"
                className="px-10 py-4 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all inline-flex items-center gap-2 group"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/listings"
                className="px-10 py-4 bg-transparent border border-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-all"
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
