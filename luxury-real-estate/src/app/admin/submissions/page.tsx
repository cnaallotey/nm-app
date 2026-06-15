"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Submission } from "@/lib/types";
import Link from "next/link";
import { toast } from "sonner";
import { Inbox, Eye, CheckCircle2, Archive, PhoneCall } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: Submission[] = [];
      snap.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as Submission);
      });
      setSubmissions(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "submissions", id), {
        status: newStatus,
      });
      toast.success(`Status updated to "${newStatus}"!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesType = typeFilter === "all" || sub.type === typeFilter;
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8 font-['Montserrat']">
      <div>
        <h1 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-2">
          Submissions Inbox
        </h1>
        <p className="text-sm text-white/55 font-light">
          Review inquiries, detail requests, and showings submitted by clients.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {["all", "inquiry", "showing", "details"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.05em] transition-all cursor-pointer ${
                typeFilter === type
                  ? "bg-[#fbbf24] text-[#1A1A1A]"
                  : "bg-white/5 border border-white/5 text-white/70 hover:text-white"
              }`}
            >
              {type === "all" ? "All Types" : type}
            </button>
          ))}
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">
            Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#fbbf24]"
          >
            <option value="all">All Statuses</option>
            <option value="new">New / Unread</option>
            <option value="read">Read</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-white/55">
            Loading inbox...
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-20 text-center text-white/45 space-y-4">
            <Inbox className="w-12 h-12 text-[#fbbf24]/30 mx-auto" />
            <p className="text-sm">No submissions matching these filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-[10px] font-bold uppercase tracking-[0.15em] bg-black/10">
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6">Regarding</th>
                  <th className="py-4 px-6">Submitted</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Quick Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className={`hover:bg-white/[0.01] transition-colors ${
                      sub.status === "new" ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    {/* Name */}
                    <td className="py-4 px-6">
                      <Link href={`/admin/submissions/${sub.id}`} className="group block">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium group-hover:text-[#fbbf24] transition-colors ${sub.status === "new" ? "text-white font-semibold" : "text-white/80"}`}>
                            {sub.firstName} {sub.lastName}
                          </span>
                          {sub.status === "new" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>
                      </Link>
                    </td>

                    {/* Type Tag */}
                    <td className="py-4 px-6">
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
                    </td>

                    {/* Email/Phone */}
                    <td className="py-4 px-6 text-xs space-y-1">
                      <div className="text-white/85">{sub.email}</div>
                      <div className="text-white/55">{sub.phone}</div>
                    </td>

                    {/* Regarding */}
                    <td className="py-4 px-6 text-white/75">
                      {sub.propertyTitle || "General Inquiry"}
                    </td>

                    {/* Submitted Time */}
                    <td className="py-4 px-6 text-white/55 text-xs">
                      {formatDistanceToNow(sub.createdAt, { addSuffix: true })}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded ${
                          sub.status === "new"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : sub.status === "read"
                            ? "bg-white/10 text-white/60"
                            : sub.status === "contacted"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          href={`/admin/submissions/${sub.id}`}
                          className="p-1.5 rounded hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {sub.status !== "contacted" && (
                          <button
                            onClick={() => handleUpdateStatus(sub.id, "contacted")}
                            className="p-1.5 rounded hover:bg-white/5 text-white/60 hover:text-blue-400 transition-colors cursor-pointer"
                            title="Mark Contacted"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>
                        )}
                        {sub.status !== "archived" && (
                          <button
                            onClick={() => handleUpdateStatus(sub.id, "archived")}
                            className="p-1.5 rounded hover:bg-white/5 text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        {sub.status === "new" && (
                          <button
                            onClick={() => handleUpdateStatus(sub.id, "read")}
                            className="p-1.5 rounded hover:bg-white/5 text-white/60 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Mark Read"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
