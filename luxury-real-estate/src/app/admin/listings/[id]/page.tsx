"use client";
import React, { useEffect, useState } from "react";
import ListingForm from "../ListingForm";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing } from "@/lib/types";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const snap = await getDoc(doc(db, "listings", id));
        if (snap.exists()) {
          setListing(snap.data() as Listing);
        } else {
          toast.error("Listing not found.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load listing details.");
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const numericPrice = parseFloat(formData.price.replace(/[^\d.]/g, "")) || 0;
      await updateDoc(doc(db, "listings", id), {
        ...formData,
        priceValue: numericPrice,
        updatedAt: serverTimestamp(),
      });
      toast.success("Listing updated successfully!");
      router.push("/admin/listings");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white/55">
        <Loader2 className="w-8 h-8 animate-spin text-[#fbbf24] mb-4" />
        <span>Loading listing data...</span>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20 text-white/45">
        <p className="text-lg">Listing not found.</p>
        <Link href="/admin/listings" className="text-xs text-[#fbbf24] uppercase tracking-wider hover:underline mt-4 block">
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-['Montserrat']">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/listings"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-['Cormorant_Garamond'] text-4xl font-light text-white">
            Edit Listing
          </h1>
          <p className="text-xs text-white/55 font-light mt-1">
            Modify details for: <span className="text-white font-medium">{listing.title}</span>
          </p>
        </div>
      </div>

      <ListingForm initialData={listing} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
