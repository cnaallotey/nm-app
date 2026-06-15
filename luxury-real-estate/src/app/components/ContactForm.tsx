"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

export function ContactForm({ propertyId, propertyTitle = "Villa Serena" }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    
    if (!fd.get("consent")) {
      return toast.error("Please accept the consent notice to proceed.");
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "submissions"), {
        type: "inquiry",
        firstName: String(fd.get("firstName") ?? ""),
        lastName: String(fd.get("lastName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        message: String(fd.get("message") ?? ""),
        propertyId: propertyId || "",
        propertyTitle,
        consent: true,
        status: "new",
        source: "ContactForm",
        createdAt: serverTimestamp(),
      });
      toast.success("Inquiry sent. We'll be in touch within 24 hours.");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#1A1A1A] py-16 px-6 lg:px-12">
      <motion.div
        className="max-w-[1440px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#0F0F0F] border-l-4 border-[#fbbf24] rounded-2xl p-8 lg:p-12">
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-4">
            Interested in {propertyTitle}?
          </h2>
          <p className="font-['Montserrat'] text-sm text-white/60 mb-10">
            Fill out the form below and one of our property specialists will be in touch within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  placeholder="Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  placeholder="+233 (0) 555-000-000"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors resize-none"
                placeholder="I'm interested in learning more about this property..."
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                value="true"
                defaultChecked
                className="mt-1 w-4 h-4 rounded border-white/20 bg-[#1A1A1A] text-[#fbbf24] focus:ring-[#fbbf24]"
              />
              <label htmlFor="consent" className="font-['Montserrat'] text-xs text-white/50 leading-relaxed">
                By submitting this form, I agree to be contacted by Nouvelle Maison Ltd. regarding this property and other listings. I understand I can opt out at any time.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full lg:w-auto px-12 py-4 bg-[#fbbf24] hover:bg-[#D4B87E] disabled:opacity-50 disabled:cursor-not-allowed text-[#1A1A1A] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] transition-all hover:shadow-lg hover:shadow-[#fbbf24]/20 cursor-pointer"
            >
              {submitting ? "Submitting Inquiry..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
