"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const offices = [
  {
    city: "East Legon, Accra",
    address: "No. 36 Lagos Avenue",
    region: "East Legon, Ghana",
    phone: "+233 (0) 302 523 984",
    email: "info@nouvellemaisonlimited.com",
    image:
      "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
  },
];

const inquiryTypes = [
  "Property Sales",
  "Rentals",
  "Property Advisory",
  "Property Development",
  "Property Management",
  "General Inquiry",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, "submissions"), {
        type: "inquiry",
        firstName: (form.querySelector("#contact-firstName") as HTMLInputElement)?.value || "",
        lastName: (form.querySelector("#contact-lastName") as HTMLInputElement)?.value || "",
        email: (form.querySelector("#contact-email") as HTMLInputElement)?.value || "",
        phone: (form.querySelector("#contact-phone") as HTMLInputElement)?.value || "",
        inquiryType: selectedInquiry || "General Inquiry",
        message: (form.querySelector("#contact-message") as HTMLTextAreaElement)?.value || "",
        consent: true,
        status: "new",
        source: "ContactPage",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (err) {
      console.error("Error submitting contact inquiry:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
              Get in Touch
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl lg:text-7xl font-light text-white mb-6">
              Contact Us
            </h1>
            <p className="font-['Montserrat'] text-base font-light text-white/50 max-w-2xl mx-auto">
              Whether you're looking to buy, sell, or simply explore Ghana's
              luxury real estate market, our team of specialists is here to
              guide you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="px-6 lg:px-12 py-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form Column */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-8 lg:p-12">
                {submitted ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-16 h-16 bg-[#fbbf24]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-[#fbbf24]" />
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl font-light text-white mb-4">
                      Message Sent
                    </h3>
                    <p className="font-['Montserrat'] text-sm text-white/50 max-w-md mx-auto mb-8">
                      Thank you for reaching out. One of our luxury property
                      specialists will be in touch within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-8 py-3 bg-transparent border border-[#fbbf24] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#fbbf24] hover:bg-[#fbbf24]/10 transition-all"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl font-light text-white mb-2">
                      Send Us a Message
                    </h2>
                    <p className="font-['Montserrat'] text-sm text-white/50 mb-10">
                      Fill out the form below and we'll respond promptly.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Inquiry Type */}
                      <div>
                        <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-3">
                          I'm Interested In
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {inquiryTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSelectedInquiry(type)}
                              className={`px-4 py-2 rounded-lg font-['Montserrat'] text-xs transition-all ${
                                selectedInquiry === type
                                  ? "bg-[#fbbf24] text-[#1A1A1A] font-semibold"
                                  : "bg-[#1A1A1A] border border-white/10 text-white/60 hover:border-[#fbbf24]/40"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="contact-firstName"
                            className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="contact-firstName"
                            required
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#fbbf24] focus:outline-none transition-colors"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-lastName"
                            className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="contact-lastName"
                            required
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#fbbf24] focus:outline-none transition-colors"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="contact-email"
                            required
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#fbbf24] focus:outline-none transition-colors"
                            placeholder="john.doe@example.com"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2"
                          >
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="contact-phone"
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#fbbf24] focus:outline-none transition-colors"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2"
                        >
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          rows={5}
                          required
                          className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#fbbf24] focus:outline-none transition-colors resize-none"
                          placeholder="Tell us about what you're looking for..."
                        />
                      </div>

                      {/* Consent */}
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="contact-consent"
                          required
                          className="mt-1 w-4 h-4 rounded border-white/20 bg-[#1A1A1A] text-[#fbbf24] focus:ring-[#fbbf24]"
                        />
                        <label
                          htmlFor="contact-consent"
                          className="font-['Montserrat'] text-xs text-white/40 leading-relaxed"
                        >
                          I agree to be contacted by Nouvelle Maison Ltd. and
                          understand I can opt out at any time. View our{" "}
                          <a
                            href="#"
                            className="text-[#fbbf24] hover:underline"
                          >
                            Privacy Policy
                          </a>
                          .
                        </label>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full md:w-auto px-12 py-4 bg-[#fbbf24] disabled:bg-[#fbbf24]/50 disabled:cursor-not-allowed rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all hover:shadow-lg hover:shadow-[#fbbf24]/20 inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>

                  </>
                )}
              </div>
            </motion.div>

            {/* Sidebar Info */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Quick Contact */}
              <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-8">
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-6">
                  Quick Contact
                </h3>
                <div className="space-y-5">
                  <a
                    href="tel:+233302523984"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 bg-[#fbbf24]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#fbbf24]/20 transition-colors">
                      <Phone className="w-4 h-4 text-[#fbbf24]" />
                    </div>
                    <div>
                      <p className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.1em] text-white/40 mb-0.5">
                        Call Us
                      </p>
                      <p className="font-['Montserrat'] text-sm text-white/80 group-hover:text-[#fbbf24] transition-colors">
                        +233 (0) 302 523 984
                      </p>
                    </div>
                  </a>
                  <a
                    href="mailto:info@nouvellemaisonlimited.com"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 bg-[#fbbf24]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#fbbf24]/20 transition-colors">
                      <Mail className="w-4 h-4 text-[#fbbf24]" />
                    </div>
                    <div>
                      <p className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.1em] text-white/40 mb-0.5">
                        Email
                      </p>
                      <p className="font-['Montserrat'] text-sm text-white/80 group-hover:text-[#fbbf24] transition-colors">
                        info@nouvellemaisonlimited.com
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#fbbf24]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-[#fbbf24]" />
                    </div>
                    <div>
                      <p className="font-['Montserrat'] text-[10px] font-medium uppercase tracking-[0.1em] text-white/40 mb-0.5">
                        Office Hours
                      </p>
                      <p className="font-['Montserrat'] text-sm text-white/80">
                        Mon – Sat: 9AM – 7PM
                      </p>
                      <p className="font-['Montserrat'] text-xs text-white/40">
                        Sun: By appointment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Notice */}
              <div className="bg-gradient-to-br from-[#fbbf24]/10 to-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-2xl p-8">
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-3">
                  Priority Access
                </h3>
                <p className="font-['Montserrat'] text-sm text-white/50 leading-relaxed">
                  Looking for off-market or pre-listing properties? Our
                  concierge team provides exclusive access to luxury listings
                  across Ghana before they hit the market. Reach out to learn
                  more about our private collection.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
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
              Our Offices
            </h2>
            <p className="font-['Montserrat'] text-sm text-white/50 max-w-xl mx-auto">
              Visit us at one of our flagship locations across Ghana
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative h-56 overflow-hidden rounded-2xl mb-6">
                  <img
                    src={office.image}
                    alt={office.city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <h3 className="font-['Cormorant_Garamond'] text-3xl font-light text-white">
                      {office.city}
                    </h3>
                  </div>
                </div>
                <div className="space-y-3 px-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#fbbf24] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-['Montserrat'] text-sm text-white/70">
                        {office.address}
                      </p>
                      <p className="font-['Montserrat'] text-sm text-white/40">
                        {office.region}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                    <a
                      href={`tel:${office.phone.replace(/\s/g, "")}`}
                      className="font-['Montserrat'] text-sm text-white/70 hover:text-[#fbbf24] transition-colors"
                    >
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                    <a
                      href={`mailto:${office.email}`}
                      className="font-['Montserrat'] text-sm text-white/70 hover:text-[#fbbf24] transition-colors"
                    >
                      {office.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
