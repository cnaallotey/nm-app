import { useState } from "react";
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
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function PropertyDetailPage() {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [showingModalOpen, setShowingModalOpen] = useState(false);

  const propertyImages = [
    "https://images.unsplash.com/photo-1758192838598-a1de4da5dcaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yJTIwcG9vbCUyMHN1bnNldHxlbnwxfHx8fDE3NzUyOTkwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1629787302738-2c6e9f3dada1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBtYW5zaW9uJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NTI5OTA2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1613545325268-9265e1609167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NTIwMjExM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1768039049614-f3c2bae3f1db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwa2l0Y2hlbiUyMG1hcmJsZSUyMGNvdW50ZXJ0b3B8ZW58MXx8fHwxNzc1Mjk5MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const propertyStats = [
    { value: "7", label: "Beds" },
    { value: "9", label: "Baths" },
    { value: "1.2 AC", label: "Lot Size" },
    { value: "27,000", label: "AC SqFt" },
    { value: "32,500", label: "Total SqFt" },
    { value: "#A11527482", label: "MLS" },
  ];

  const description = `Villa Serena represents the pinnacle of luxury living in one of East Legon's most coveted neighbourhoods. This architectural masterpiece seamlessly blends contemporary design with timeless elegance, offering an unparalleled lifestyle for the most discerning buyers.

Situated on over an acre of meticulously landscaped grounds, the estate features 27,000 square feet of living space across three thoughtfully designed levels. Floor-to-ceiling windows throughout the residence frame breathtaking views of the Accra skyline, while bringing an abundance of natural light into every room.

The main level showcases an impressive great room with soaring 24-foot ceilings, a formal dining room that seats 20, and a gourmet chef's kitchen equipped with top-of-the-line Miele and Sub-Zero appliances. The master suite occupies the entire east wing, featuring dual bathrooms finished in Italian marble, custom walk-in closets, and a private terrace overlooking the gardens.

Beyond the main residence, Villa Serena offers an extraordinary array of amenities including a private cinema, professional putting green, wine cellar for 2,000 bottles, home theater, spa with sauna and steam room, and a climate-controlled 10-car garage. The resort-style grounds feature two saltwater pools, outdoor summer kitchen, boys' quarters, and lush tropical gardens designed by a leading Ghanaian landscape architect.`;

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <Navigation />
      
      <main className="pt-20">
        {/* Back Button */}
        <div className="bg-[#1A1A1A] py-4 px-6 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <Link
              to="/listings"
              className="inline-flex items-center space-x-2 font-['Montserrat'] text-sm text-white/60 hover:text-[#C9A96E] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Properties</span>
            </Link>
          </div>
        </div>
        
        <HeroGallery images={propertyImages} />
        
        <PropertyHeader
          title="Villa Serena"
          subtitle="Luxury Estate • East Legon, Accra"
          price="GH₵ 12,500,000"
          priceSubtext="Approx. $980,000 | £780,000"
          stats={propertyStats}
        />
        
        <CTAButtons
          onRequestDetails={() => setRequestModalOpen(true)}
          onScheduleShowing={() => setShowingModalOpen(true)}
        />
        
        <PropertyDescription description={description} />
        
        <AmenitiesGrid />
        
        <ContactForm />
        
        <SocialShare />
      </main>
      
      <Footer />
      
      <RequestDetailsModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
      
      <ScheduleShowingModal
        isOpen={showingModalOpen}
        onClose={() => setShowingModalOpen(false)}
      />
    </div>
  );
}