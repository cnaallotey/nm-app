"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing } from "@/lib/types";
import { Navigation } from "../components/Navigation";
import { HeroGallery } from "../components/HeroGallery";
import { PropertyHeader } from "../components/PropertyHeader";
import { CTAButtons } from "../components/CTAButtons";
import { PropertyDescription } from "../components/PropertyDescription";
import { AmenitiesGrid } from "../components/AmenitiesGrid";
import { ContactForm } from "../components/ContactForm";
import { RequestDetailsModal } from "../components/RequestDetailsModal";
import { ScheduleShowingModal } from "../components/ScheduleShowingModal";
import { SocialShare } from "../components/SocialShare";
import { Footer } from "../components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [showingModalOpen, setShowingModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchProperty() {
      try {
        const docRef = doc(db, "listings", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
        } else {
          setListing(null);
        }
      } catch (err) {
        console.error("Error fetching property detail:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white/50 font-['Montserrat']">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm tracking-wider uppercase">Loading Estate Details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white/50 font-['Montserrat']">
        <div className="text-center space-y-6">
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-white font-light">Property Not Found</h2>
          <p className="text-sm text-white/50">The property you are looking for does not exist or has been removed.</p>
          <Link
            href="/listings"
            className="px-8 py-3 bg-[#fbbf24] text-[#1A1A1A] font-semibold rounded-lg text-sm tracking-wide uppercase transition-all inline-block hover:bg-[#D4B87E]"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const propertyStats = [
    { value: String(listing.beds || 0), label: "Beds" },
    { value: String(listing.baths || 0), label: "Baths" },
    { value: listing.sqft || "N/A", label: "SqFt" },
    { value: listing.yearBuilt ? String(listing.yearBuilt) : "2024", label: "Year Built" },
    { value: listing.status === "sold" ? "Sold" : "For Sale", label: "Availability" },
    { value: `#NM${listing.id.substring(0, 5).toUpperCase()}`, label: "MLS ID" },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navigation />
      
      <main className="pt-20">
        {/* Back Button */}
        <div className="bg-[#1A1A1A] py-4 px-6 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <Link
              href="/listings"
              className="inline-flex items-center space-x-2 font-['Montserrat'] text-sm text-white/60 hover:text-[#fbbf24] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Properties</span>
            </Link>
          </div>
        </div>
        
        <HeroGallery images={listing.images} address={listing.location} />
        
        <PropertyHeader
          title={listing.title}
          subtitle={`Luxury Estate • ${listing.location}`}
          price={listing.price}
          priceSubtext={listing.priceSubtext}
          stats={propertyStats}
        />
        
        <CTAButtons
          onRequestDetails={() => setRequestModalOpen(true)}
          onScheduleShowing={() => setShowingModalOpen(true)}
        />
        
        <PropertyDescription description={listing.description} sqft={listing.sqft} />
        
        <AmenitiesGrid amenities={listing.amenities} />
        
        <ContactForm propertyId={listing.id} propertyTitle={listing.title} />
        
        <SocialShare />
      </main>
      
      <Footer />
      
      <RequestDetailsModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        propertyId={listing.id}
        propertyTitle={listing.title}
      />
      
      <ScheduleShowingModal
        isOpen={showingModalOpen}
        onClose={() => setShowingModalOpen(false)}
        propertyId={listing.id}
        propertyTitle={listing.title}
      />
    </div>
  );
}