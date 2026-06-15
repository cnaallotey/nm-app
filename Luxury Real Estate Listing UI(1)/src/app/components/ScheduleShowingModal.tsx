"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface ScheduleShowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyTitle?: string;
}

export function ScheduleShowingModal({ isOpen, onClose, propertyId = "", propertyTitle = "Villa Serena" }: ScheduleShowingModalProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (!fd.get("consent")) {
      return toast.error("Please accept the consent checkbox to continue.");
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "submissions"), {
        type: "showing",
        firstName: String(fd.get("firstName") ?? ""),
        lastName: String(fd.get("lastName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        preferredDate: String(fd.get("preferredDate") ?? ""),
        preferredTime: String(fd.get("preferredTime") ?? ""),
        message: String(fd.get("message") ?? ""),
        propertyId,
        propertyTitle,
        consent: true,
        status: "new",
        source: "ScheduleShowingModal",
        createdAt: serverTimestamp(),
      });
      toast.success("Showing requested. Our coordinator will contact you shortly.");
      form.reset();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to schedule showing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative bg-[#0F0F0F] border border-[#fbbf24]/30 rounded-2xl p-8 lg:p-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/60 hover:text-[#fbbf24] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-4">
              Schedule A Showing
            </h2>
            <p className="font-['Montserrat'] text-sm text-white/60 mb-8">
              Let us arrange a private tour of {propertyTitle} at your convenience. Our property specialists will coordinate with you to find the perfect time.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="showing-firstName" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="showing-firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="showing-lastName" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="showing-lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="showing-email" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="showing-email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="showing-phone" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="showing-phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="showing-date" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="showing-date"
                    name="preferredDate"
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="showing-time" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    id="showing-time"
                    name="preferredTime"
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white focus:border-[#fbbf24] focus:outline-none transition-colors"
                  >
                    <option value="">Select a time</option>
                    <option value="morning">Morning (9AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="showing-notes" className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/70 mb-2">
                  Special Requests or Notes
                </label>
                <textarea
                  id="showing-notes"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none transition-colors resize-none"
                  placeholder="Any specific areas you'd like to see or questions to address during the tour..."
                />
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="showing-consent"
                  name="consent"
                  value="true"
                  defaultChecked
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-[#1A1A1A] text-[#fbbf24] focus:ring-[#fbbf24]"
                />
                <label htmlFor="showing-consent" className="font-['Montserrat'] text-xs text-white/50 leading-relaxed">
                  I agree to be contacted to confirm showing availability and receive property updates.
                </label>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-8 py-4 bg-[#fbbf24] hover:bg-[#D4B87E] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all cursor-pointer"
                >
                  {submitting ? "Requesting..." : "Request Showing"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-8 py-4 bg-transparent border border-white/20 rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
