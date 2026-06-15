"use client";
import React, { useState } from "react";
import ListingForm from "../ListingForm";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const numericPrice = parseFloat(formData.price.replace(/[^\d.]/g, "")) || 0;
      await setDoc(doc(db, "listings", formData.id), {
        ...formData,
        priceValue: numericPrice,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Listing created successfully!");
      router.push("/admin/listings");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Create Listing
          </h1>
          <p className="text-xs text-white/55 font-light mt-1">
            Add a new property to the Nouvelle Maison portfolio.
          </p>
        </div>
      </div>

      <ListingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
