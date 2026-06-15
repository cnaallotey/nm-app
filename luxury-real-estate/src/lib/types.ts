import { Timestamp } from "firebase/firestore";

export interface Listing {
  id: string;                 // slug, e.g. "villa-serena" — used in /property/[id]
  title: string;              // "Villa Serena"
  location: string;           // "East Legon, Accra"
  price: string;              // "GH₵ 12,500,000" (kept as display string)
  priceSubtext?: string;      // "Approx. $980,000 | £780,000"
  beds: number;               // 7
  baths: number;              // 9
  sqft: string;               // "27,000"
  description: string;        // long multi-paragraph text
  images: string[];           // Storage download URLs; images[0] = cover
  amenities?: string[];       // optional, drives AmenitiesGrid
  yearBuilt?: number;
  status: "published" | "draft" | "sold";
  featured: boolean;          // show in FeaturedProperties on the landing page
  category: string;           // e.g. "Gated Communities"
  order?: number;             // manual sort
  createdAt: any;
  updatedAt: any;
}

export type SubmissionType = "inquiry" | "showing" | "details";

export interface Submission {
  id: string;
  type: SubmissionType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
  preferredDate?: string;    // showing-date
  preferredTime?: string;    // showing-time
  propertyId?: string;       // which listing the form was about
  propertyTitle?: string;    // e.g. "Villa Serena" (denormalized)
  consent: boolean;
  status: "new" | "read" | "contacted" | "archived";
  source: string;            // page/component the form lived on
  createdAt: any;
}
