import { motion } from "motion/react";
import { Link } from "react-router";
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
    bio: "With over 20 years in Ghana's real estate industry, Nana Ama founded  NOUVELLE MAISON to bring world-class service to the Ghanaian luxury market.",
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
  { year: "2005", event: " NOUVELLE MAISON founded in Cantonments, Accra" },
  { year: "2009", event: "Expanded to Kumasi with our Ashanti Region office" },
  {
    year: "2013",
    event: "Crossed GH₵ 500M in total sales volume",
  },
  {
    year: "2016",
    event: "Launched our Diaspora Investor Programme",
  },
  {
    year: "2019",
    event: "Opened Takoradi office to serve the Western Region",
  },
  {
    year: "2022",
    event: "Surpassed GH₵ 2B in cumulative transactions",
  },
  {
    year: "2025",
    event: "Named Ghana's Most Trusted Luxury Real Estate Agency",
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
            <p className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A96E] mb-4">
              Our Story
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-white mb-6">
              About  NOUVELLE MAISON
            </h1>
            <p className="font-['Montserrat'] text-base font-light text-white/50 max-w-2xl mx-auto">
              For two decades, we have been Ghana's most trusted name in luxury
              real estate — connecting discerning clients with exceptional
              properties across the nation.
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
                Redefining Luxury
                <br />
                in Ghana
              </h2>
              <div className="space-y-5">
                <p className="font-['Montserrat'] text-base font-light text-white/60 leading-relaxed">
                  Founded in 2005 in the heart of Accra,  NOUVELLE MAISON was
                  born from a simple belief: that Ghana's luxury property market
                  deserved a brokerage that matched the calibre of the homes it
                  represented.
                </p>
                <p className="font-['Montserrat'] text-base font-light text-white/60 leading-relaxed">
                  From our first office in Cantonments, we set out to bring
                  international standards of professionalism, discretion, and
                  client care to the Ghanaian market. Today, with offices in
                  Accra, Kumasi, and Takoradi, we serve clients across all
                  regions of Ghana and a growing diaspora community worldwide.
                </p>
                <p className="font-['Montserrat'] text-base font-light text-white/60 leading-relaxed">
                  Our team of specialists combines deep local knowledge with a
                  global perspective, ensuring every client — whether buying
                  their dream home, making a strategic investment, or selling a
                  treasured estate — receives guidance that is both expert and
                  deeply personal.
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
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#C9A96E]/10 rounded-full text-[#C9A96E] mb-4">
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
                className="p-8 bg-[#0F0F0F] border border-white/5 rounded-2xl hover:border-[#C9A96E]/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-[#C9A96E]/10 rounded-full flex items-center justify-center text-[#C9A96E] mb-5">
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
                  <div className="w-3 h-3 bg-[#C9A96E] rounded-full flex-shrink-0" />
                  {index < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 mt-2" />
                  )}
                </div>
                <div className="pb-10 last:pb-0">
                  <span className="font-['Cormorant_Garamond'] text-3xl font-light text-[#C9A96E]">
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
                <p className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9A96E] mb-3">
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
                to="/listings"
                className="px-10 py-4 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all inline-flex items-center gap-2 group"
              >
                <span>Browse Properties</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 bg-transparent border border-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-all"
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
