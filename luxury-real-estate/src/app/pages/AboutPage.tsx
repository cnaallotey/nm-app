import { motion } from "motion/react";
import Link from "next/link";
import {
  TrendingUp,
  Home,
  Users,
  Globe,
  Award,
  Shield,
  Heart,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { Footer } from "../components/Footer";

const stats = [
  {
    icon: <TrendingUp className="w-7 h-7" />,
    value: "GH₵ 2.4B+",
    label: "Total Sales Volume",
  },
  {
    icon: <Home className="w-7 h-7" />,
    value: "1,200+",
    label: "Properties Sold",
  },
  {
    icon: <Users className="w-7 h-7" />,
    value: "950+",
    label: "Satisfied Clients",
  },
  {
    icon: <Globe className="w-7 h-7" />,
    value: "12",
    label: "Regions Covered",
  },
];

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Integrity",
    description:
      "Every transaction is built on trust, transparency, and honest counsel. We protect our clients' interests as if they were our own.",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Discretion",
    description:
      "We understand that privacy is paramount. Our clients' personal and financial details are handled with the utmost confidentiality.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Excellence",
    description:
      "From property selection to closing, we hold ourselves to the highest standard in every detail of the experience we deliver.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Commitment",
    description:
      "Our relationship with clients extends far beyond the transaction. We are long-term partners in building lasting legacies.",
  },
];

const team = [
  {
    name: "Nana Ama Owusu",
    role: "Founder & Managing Director",
    bio: "A visionary leader who founded Nouvelle Maison to bring digital-driven, professional real estate solutions to the Ghanaian market.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
  },
  {
    name: "Kwadwo Mensah",
    role: "Head of Sales & Acquisitions",
    bio: "A seasoned negotiator with deep connections across Accra's premium neighbourhoods, Kwadwo has closed over GH₵ 800M in luxury transactions.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
  },
  {
    name: "Efua Asante",
    role: "Director of Client Relations",
    bio: "Efua ensures every client receives a bespoke, white-glove experience from first consultation through to handover and beyond.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
  },
  {
    name: "Yaw Boateng",
    role: "Head of Property Valuation",
    bio: "A chartered surveyor and valuation expert, Yaw brings rigorous market analysis to every investment decision our clients make.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
  },
];

const milestones = [
  { year: "2022", event: "Nouvelle Maison founded in East Legon, Accra" },
  {
    year: "2023",
    event: "Launched digital property sales and rental platform",
  },
  {
    year: "2024",
    event: "Expanded services to include property advisory and development",
  },
  {
    year: "2025",
    event: "Growing portfolio of property management and AirBnB solutions",
  },
];

export default function AboutPage() {
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
              Our Story
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-white mb-6">
              About Nouvelle Maison
            </h1>
            <p className="font-['Montserrat'] text-base font-light text-white/50 max-w-2xl mx-auto">
              A digital-driven realty solutions provider offering intelligent
              solutions that empower homeowners, property investors and real
              estate agents in Ghana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-6">
                Digital-Driven
                <br />
                Realty Solutions
              </h2>
              <div className="space-y-5">
                <p className="font-['Montserrat'] text-base font-light text-white/60 leading-relaxed">
                  Nouvelle Maison is a digital-driven realty solutions provider.
                  We offer intelligent solutions that empower homeowners,
                  property investors and real estate agents.
                </p>
                <p className="font-['Montserrat'] text-base font-light text-white/60 leading-relaxed">
                  Founded in 2022 with the vision of providing real-time real
                  estate solutions backed by digital technology, we are able to
                  bring professionalism into real estate by providing scientific
                  but flexible service delivery that gives power to the buyer.
                </p>
                <p className="font-['Montserrat'] text-base font-light text-white/60 leading-relaxed">
                  Our mission is to offer all-in-one property solutions backed
                  by digital technologies that simplify and enhance the living
                  experience of our clients. Our vision is to become the
                  foremost digital-driven property solutions firm in Africa by
                  2030.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[550px] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1629787302738-2c6e9f3dada1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBtYW5zaW9uJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NTI5OTA2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Luxury Estate in Ghana"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0F0F0F] border-y border-white/5 py-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#fbbf24]/10 rounded-full text-[#fbbf24] mb-4">
                  {stat.icon}
                </div>
                <div className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-1">
                  {stat.value}
                </div>
                <div className="font-['Montserrat'] text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
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
              Our Values
            </h2>
            <p className="font-['Montserrat'] text-sm text-white/50 max-w-xl mx-auto">
              The principles that guide every relationship and transaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="p-8 bg-[#0F0F0F] border border-white/5 rounded-2xl hover:border-[#fbbf24]/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-[#fbbf24]/10 rounded-full flex items-center justify-center text-[#fbbf24] mb-5">
                  {value.icon}
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-3">
                  {value.title}
                </h3>
                <p className="font-['Montserrat'] text-sm text-white/50 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
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
              Our Journey
            </h2>
            <p className="font-['Montserrat'] text-sm text-white/50 max-w-xl mx-auto">
              Two decades of milestones in Ghana's luxury property market
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="flex gap-6 lg:gap-10 mb-10 last:mb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#fbbf24] rounded-full flex-shrink-0" />
                  {index < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 mt-2" />
                  )}
                </div>
                <div className="pb-10 last:pb-0">
                  <span className="font-['Cormorant_Garamond'] text-3xl font-light text-[#fbbf24]">
                    {milestone.year}
                  </span>
                  <p className="font-['Montserrat'] text-sm text-white/60 mt-1">
                    {milestone.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
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
              Meet Our Team
            </h2>
            <p className="font-['Montserrat'] text-sm text-white/50 max-w-xl mx-auto">
              Experienced professionals dedicated to exceptional service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative h-80 rounded-2xl overflow-hidden mb-5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-1">
                  {member.name}
                </h3>
                <p className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#fbbf24] mb-3">
                  {member.role}
                </p>
                <p className="font-['Montserrat'] text-sm text-white/50 leading-relaxed">
                  {member.bio}
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
              Ready to Find Your Dream Home?
            </h2>
            <p className="font-['Montserrat'] text-base font-light text-white/50 max-w-2xl mx-auto mb-10">
              Whether you're buying, selling, or investing, our team is ready to
              provide the guidance and expertise you deserve.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/listings"
                className="px-10 py-4 bg-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all inline-flex items-center gap-2 group"
              >
                <span>Browse Properties</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 bg-transparent border border-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
