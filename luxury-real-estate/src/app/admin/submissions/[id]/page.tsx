"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Submission } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Calendar, Clock, User, Mail, Phone, MessageSquare, Building2, CheckCircle2, Archive, PhoneCall, History } from "lucide-react";
import Link from "next/link";

export default function SubmissionDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmission() {
      try {
        const snap = await getDoc(doc(db, "submissions", id));
        if (snap.exists()) {
          const data = snap.data();
          setSubmission({
            id: snap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          } as Submission);
          
          // Auto-mark as read if it was new
          if (data.status === "new") {
            await updateDoc(doc(db, "submissions", id), {
              status: "read",
            });
          }
        } else {
          toast.error("Submission not found.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load submission details.");
      } finally {
        setLoading(false);
      }
    }
    fetchSubmission();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!submission) return;
    try {
      await updateDoc(doc(db, "submissions", id), {
        status: newStatus,
      });
      setSubmission((prev) => prev ? { ...prev, status: newStatus as any } : null);
      toast.success(`Status updated to "${newStatus}"!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white/55">
        <Loader2 className="w-8 h-8 animate-spin text-[#fbbf24] mb-4" />
        <span>Loading submission details...</span>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-20 text-white/45 font-['Montserrat']">
        <p className="text-lg">Submission not found.</p>
        <Link href="/admin/submissions" className="text-xs text-[#fbbf24] uppercase tracking-wider hover:underline mt-4 block">
          Back to Inbox
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-['Montserrat']">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/submissions"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-white">
            Submission Details
          </h1>
          <p className="text-xs text-white/55 font-light mt-1">
            Form inbox item ID: <span className="text-white/70">{id}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact/Message Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white">
                Client Information
              </h3>
              <span
                className={`text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded ${
                  submission.type === "showing"
                    ? "bg-blue-500/10 text-blue-400"
                    : submission.type === "details"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-[#fbbf24]/10 text-[#fbbf24]"
                }`}
              >
                {submission.type} Request
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs text-white/40 font-semibold uppercase tracking-wider block">
                    Full Name
                  </span>
                  <span className="text-white font-medium">
                    {submission.firstName} {submission.lastName}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs text-white/40 font-semibold uppercase tracking-wider block">
                    Email Address
                  </span>
                  <a href={`mailto:${submission.email}`} className="text-white hover:text-[#fbbf24] transition-colors font-medium break-all">
                    {submission.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs text-white/40 font-semibold uppercase tracking-wider block">
                    Phone Number
                  </span>
                  <a href={`tel:${submission.phone}`} className="text-white hover:text-[#fbbf24] transition-colors font-medium">
                    {submission.phone}
                  </a>
                </div>
              </div>

              {/* Submitted At */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs text-white/40 font-semibold uppercase tracking-wider block">
                    Submitted At
                  </span>
                  <span className="text-white font-medium">
                    {submission.createdAt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Showing details */}
            {submission.type === "showing" && (
              <div className="bg-[#0F0F0F] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-white/5">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Preferred Date</span>
                    <span className="text-sm font-medium text-white">{submission.preferredDate || "Not specified"}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Preferred Time</span>
                    <span className="text-sm font-medium text-white">{submission.preferredTime || "Not specified"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2 pt-4 border-t border-white/5">
              <div className="flex items-center space-x-2 text-white/40">
                <MessageSquare className="w-4 h-4 text-[#fbbf24]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Client Message / Notes</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-4 border border-white/5">
                {submission.message || "No message provided by client."}
              </p>
            </div>
          </div>
        </div>

        {/* Action / Context panel */}
        <div className="space-y-6">
          {/* Regarding Property */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white border-b border-white/5 pb-3">
              Context
            </h3>
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs text-white/40 font-semibold uppercase tracking-wider block">
                  Related Property
                </span>
                {submission.propertyId ? (
                  <Link
                    href={`/admin/listings/${submission.propertyId}`}
                    className="text-[#fbbf24] hover:underline font-medium block text-sm"
                  >
                    {submission.propertyTitle || submission.propertyId}
                  </Link>
                ) : (
                  <span className="text-white/60 text-sm font-medium">General (No property related)</span>
                )}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider block">Form Source</span>
              <span className="text-xs text-white/70 block mt-1">{submission.source || "Unknown"}</span>
            </div>
            <div className="pt-2">
              <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider block">Consent Granted</span>
              <span className="text-xs text-emerald-400 font-semibold block mt-1">Yes (Accepted Terms)</span>
            </div>
          </div>

          {/* Workflow Status Controls */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white">
                Workflow Status
              </h3>
              <p className="text-[10px] text-white/40">
                Current: <span className="text-white/80 font-bold uppercase tracking-wider">{submission.status}</span>
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/5">
              <button
                onClick={() => handleUpdateStatus("contacted")}
                disabled={submission.status === "contacted"}
                className="w-full py-3 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold uppercase tracking-[0.1em] text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Mark Contacted</span>
              </button>

              <button
                onClick={() => handleUpdateStatus("archived")}
                disabled={submission.status === "archived"}
                className="w-full py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold uppercase tracking-[0.1em] text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Archive className="w-4 h-4" />
                <span>Archive Inquiry</span>
              </button>

              <button
                onClick={() => handleUpdateStatus("read")}
                disabled={submission.status === "read"}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold uppercase tracking-[0.1em] text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Read</span>
              </button>

              <button
                onClick={() => handleUpdateStatus("new")}
                disabled={submission.status === "new"}
                className="w-full py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold uppercase tracking-[0.1em] text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <History className="w-4 h-4" />
                <span>Reset to New</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
