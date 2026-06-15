"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing } from "@/lib/types";
import Link from "next/link";
import { toast } from "sonner";
import { Home, Plus, Edit, Trash2 } from "lucide-react";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "listings"), (snap) => {
      const list: Listing[] = [];
      snap.forEach((doc) => {
        list.push({ ...doc.data() } as Listing);
      });
      // Sort by order manually if exists, else by title
      list.sort((a, b) => {
        const orderA = a.order ?? 99;
        const orderB = b.order ?? 99;
        return orderA - orderB;
      });
      setListings(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "listings", id));
        toast.success(`"${title}" deleted successfully!`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete listing.");
      }
    }
  };

  return (
    <div className="space-y-8 font-['Montserrat']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white mb-2">
            Manage Listings
          </h1>
          <p className="text-sm text-white/55 font-light">
            Create, update, publish, or remove properties from Nouvelle Maison.
          </p>
        </div>
        <Link
          href="/admin/listings/new"
          className="px-6 py-3.5 bg-[#fbbf24] hover:bg-[#D4B87E] text-[#1A1A1A] rounded-lg font-semibold uppercase tracking-[0.1em] text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#fbbf24]/10 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </Link>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-white/55">
            Loading listings...
          </div>
        ) : listings.length === 0 ? (
          <div className="py-20 text-center text-white/45 space-y-4">
            <Home className="w-12 h-12 text-[#fbbf24]/30 mx-auto" />
            <p className="text-sm">No listings found in Firestore.</p>
            <Link
              href="/admin/listings/new"
              className="text-xs font-semibold text-[#fbbf24] hover:underline uppercase tracking-wider block"
            >
              Create your first listing now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-[10px] font-bold uppercase tracking-[0.15em] bg-black/10">
                  <th className="py-4 px-6 w-20">Preview</th>
                  <th className="py-4 px-6">Property Title</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Thumbnail */}
                    <td className="py-4 px-6">
                      <div className="w-14 h-10 rounded overflow-hidden border border-white/10 bg-white/5">
                        {listing.images?.[0] ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-4 px-6 font-medium text-white">
                      {listing.title}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-white/75">
                      {listing.location}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 text-[#fbbf24] font-medium">
                      {listing.price}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-white/65 text-xs">
                      {listing.category}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded ${
                          listing.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : listing.status === "sold"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="py-4 px-6 text-xs text-white/65">
                      {listing.featured ? (
                        <span className="text-[#fbbf24] font-medium">★ Yes</span>
                      ) : (
                        <span>No</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/listings/${listing.id}`}
                          className="p-2 rounded bg-white/5 hover:bg-[#fbbf24]/20 hover:text-[#fbbf24] text-white/70 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(listing.id, listing.title)}
                          className="p-2 rounded bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/70 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
