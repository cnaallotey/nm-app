"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing, Submission } from "@/lib/types";
import Link from "next/link";
import { Home, FileText, Activity, ArrowRight, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to listings
    const unsubListings = onSnapshot(collection(db, "listings"), (snap) => {
      const list: Listing[] = [];
      snap.forEach((doc) => list.push({ ...doc.data() } as Listing));
      setListings(list);
    });

    // Listen to submissions
    const unsubSubmissions = onSnapshot(
      query(collection(db, "submissions"), orderBy("createdAt", "desc")),
      (snap) => {
        const subs: Submission[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          subs.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          } as Submission);
        });
        setSubmissions(subs);
        setLoading(false);
      }
    );

    return () => {
      unsubListings();
      unsubSubmissions();
    };
  }, []);

  const newSubmissionsCount = submissions.filter((s) => s.status === "new").length;
  const publishedListingsCount = listings.filter((l) => l.status === "published").length;
  const recentSubmissions = submissions.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/55">
        Loading dashboard metrics...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="font-['Montserrat'] text-sm text-white/55 font-light">
          Welcome to Nouvelle Maison's admin portal. Monitor your listings and client inquiries in real-time.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Listings Stats */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40">
              Total Listings
            </span>
            <h3 className="text-3xl font-light text-white">
              {listings.length}
            </h3>
            <p className="text-xs text-white/55">
              {publishedListingsCount} Published • {listings.length - publishedListingsCount} Drafts
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
            <Home className="w-6 h-6" />
          </div>
        </div>

        {/* Submissions Stats */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40">
              Inquiries & Forms
            </span>
            <h3 className="text-3xl font-light text-white">
              {submissions.length}
            </h3>
            <p className="text-xs text-white/55">
              {newSubmissionsCount} Unread Submissions
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Dynamic Activity */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40">
              System Activity
            </span>
            <h3 className="text-3xl font-light text-[#fbbf24] flex items-center">
              Active
            </h3>
            <p className="text-xs text-white/55">
              Firebase client SDK listening
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Submissions / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white">
              Recent Submissions
            </h3>
            <Link
              href="/admin/submissions"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-[#fbbf24] hover:text-[#D4B87E] transition-colors flex items-center space-x-1"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {recentSubmissions.length === 0 ? (
              <div className="py-8 text-center text-white/40 text-sm">
                No submissions received yet.
              </div>
            ) : (
              recentSubmissions.map((sub) => (
                <div key={sub.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">
                        {sub.firstName} {sub.lastName}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded ${
                          sub.type === "showing"
                            ? "bg-blue-500/10 text-blue-400"
                            : sub.type === "details"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-[#fbbf24]/10 text-[#fbbf24]"
                        }`}
                      >
                        {sub.type}
                      </span>
                      {sub.status === "new" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-white/55 max-w-md truncate">
                      {sub.message || `No message. Form source: ${sub.source}`}
                    </p>
                    {sub.propertyTitle && (
                      <span className="block text-[10px] text-white/45 font-light">
                        Regarding: {sub.propertyTitle}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-white/45 flex items-center space-x-1 whitespace-nowrap">
                    <Clock className="w-3 h-3 text-[#fbbf24]" />
                    <span>{formatDistanceToNow(sub.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white">
              Quick Actions
            </h3>
            <p className="text-xs text-white/55 leading-relaxed">
              Use these shortcuts to perform common management tasks immediately.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/listings/new"
              className="w-full py-3.5 bg-[#fbbf24] hover:bg-[#D4B87E] text-[#1A1A1A] rounded-lg font-semibold uppercase tracking-[0.1em] text-xs text-center block transition-all shadow-md shadow-[#fbbf24]/10"
            >
              Add New Listing
            </Link>
            <Link
              href="/admin/submissions"
              className="w-full py-3.5 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-lg font-semibold uppercase tracking-[0.1em] text-xs text-center block transition-all"
            >
              Manage Submissions
            </Link>
            <Link
              href="/"
              target="_blank"
              className="w-full py-3.5 bg-transparent border border-white/10 hover:bg-white/5 text-white/70 rounded-lg font-semibold uppercase tracking-[0.1em] text-xs text-center block transition-all"
            >
              View Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
