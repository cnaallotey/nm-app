import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

// Load .env.local manually
if (fs.existsSync(".env.local")) {
  const envFile = fs.readFileSync(".env.local", "utf-8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Error: Missing Firebase Admin credentials in .env.local");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  }),
});

const adminDb = getFirestore();

const listings = [
  {
    id: "villa-serena",
    title: "Villa Serena",
    location: "East Legon, Accra",
    price: "GH₵ 12,500,000",
    priceSubtext: "Approx. $980,000 | £780,000",
    beds: 7,
    baths: 9,
    sqft: "27,000",
    images: [
      "https://images.unsplash.com/photo-1758192838598-a1de4da5dcaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yJTIwcG9vbCUyMHN1bnNldHxlbnwxfHx8fDE3NzUyOTkwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1629787302738-2c6e9f3dada1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBtYW5zaW9uJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NTI5OTA2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1613545325268-9265e1609167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NTIwMjExM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1768039049614-f3c2bae3f1db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwa2l0Y2hlbiUyMG1hcmJsZSUyMGNvdW50ZXJ0b3B8ZW58MXx8fHwxNzc1Mjk5MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: `Villa Serena represents the pinnacle of luxury living in one of East Legon's most coveted neighbourhoods. This architectural masterpiece seamlessly blends contemporary design with timeless elegance, offering an unparalleled lifestyle for the most discerning buyers.
    
    Situated on over an acre of meticulously landscaped grounds, the estate features 27,000 square feet of living space across three thoughtfully designed levels. Floor-to-ceiling windows throughout the residence frame breathtaking views of the Accra skyline, while bringing an abundance of natural light into every room.`,
    amenities: ["Bowling Alley", "Putting Range", "Spa & Sauna", "Wine Cellar", "Saltwater Pools", "Private Gym", "Smart Home Tech"],
    category: "Gated Communities",
    status: "published",
    featured: true,
    order: 1,
  },
  {
    id: "modern-estate",
    title: "Modern Architectural Estate",
    location: "Airport Residential, Accra",
    price: "GH₵ 18,750,000",
    priceSubtext: "Approx. $1,470,000 | £1,170,000",
    beds: 8,
    baths: 12,
    sqft: "32,000",
    images: [
      "https://images.unsplash.com/photo-1629787302738-2c6e9f3dada1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBtYW5zaW9uJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NTI5OTA2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "An ultra-modern architectural estate offering the finest finishes, situated in the highly exclusive Airport Residential enclave of Accra.",
    amenities: ["10-Car Garage", "2 Elevators", "Private Gym", "Security System", "Smart Home Tech"],
    category: "Executive Mansions",
    status: "published",
    featured: true,
    order: 2,
  },
  {
    id: "waterfront-penthouse",
    title: "Waterfront Penthouse",
    location: "Cantonments, Accra",
    price: "GH₵ 15,900,000",
    priceSubtext: "Approx. $1,240,000 | £990,000",
    beds: 5,
    baths: 7,
    sqft: "18,500",
    images: [
      "https://images.unsplash.com/photo-1613545325268-9265e1609167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NTIwMjExM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Stunning waterfront duplex penthouse with panoramic views of the city, located in the heart of Cantonments.",
    amenities: ["Spa & Sauna", "2 Elevators", "Security System", "Smart Home Tech", "Landscaped Gardens"],
    category: "Urban Penthouses",
    status: "published",
    featured: true,
    order: 3,
  },
  {
    id: "contemporary-villa",
    title: "Contemporary Villa",
    location: "Trasacco Valley, Accra",
    price: "GH₵ 9,800,000",
    priceSubtext: "Approx. $770,000 | £610,000",
    beds: 6,
    baths: 8,
    sqft: "22,400",
    images: [
      "https://images.unsplash.com/photo-1768039049614-f3c2bae3f1db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwa2l0Y2hlbiUyMG1hcmJsZSUyMGNvdW50ZXJ0b3B8ZW58MXx8fHwxNzc1Mjk5MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Exquisite contemporary villa boasting open-concept living space, state-of-the-art chef's kitchen, and pristine pools, located in the exclusive gated community of Trasacco Valley.",
    amenities: ["Saltwater Pools", "Security System", "Smart Home Tech", "Landscaped Gardens"],
    category: "Gated Communities",
    status: "published",
    featured: true,
    order: 4,
  },
  {
    id: "aburi-retreat",
    title: "Aburi Hills Retreat",
    location: "Aburi, Eastern Region",
    price: "GH₵ 5,200,000",
    priceSubtext: "Approx. $410,000 | £320,000",
    beds: 6,
    baths: 7,
    sqft: "14,200",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "A tranquil private getaway nestled in the cool hills of Aburi, featuring beautifully landscaped gardens and majestic mountain vistas.",
    amenities: ["Spa & Sauna", "94 Solar Panels", "Security System", "Landscaped Gardens"],
    category: "Executive Mansions",
    status: "published",
    featured: false,
    order: 5,
  },
  {
    id: "ridge-penthouse",
    title: "Ridge Triplex Penthouse",
    location: "Ridge, Accra",
    price: "GH₵ 22,000,000",
    priceSubtext: "Approx. $1,720,000 | £1,370,000",
    beds: 6,
    baths: 8,
    sqft: "12,500",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "A spectacular triplex penthouse in Ridge offering expansive private terraces, state-of-the-art automation, and panoramic city views.",
    amenities: ["Spa & Sauna", "Wine Cellar", "2 Elevators", "Private Gym", "Smart Home Tech"],
    category: "Urban Penthouses",
    status: "published",
    featured: false,
    order: 6,
  },
  {
    id: "kumasi-estate",
    title: "Kumasi Royal Estate",
    location: "Nhyiaeso, Kumasi",
    price: "GH₵ 7,500,000",
    priceSubtext: "Approx. $590,000 | £470,000",
    beds: 5,
    baths: 6,
    sqft: "19,800",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Nestled in Nhyiaeso, this estate exhibits premium Asante architecture combined with modern luxury standards.",
    amenities: ["10-Car Garage", "Security System", "Smart Home Tech", "Landscaped Gardens"],
    category: "Executive Mansions",
    status: "published",
    featured: false,
    order: 7,
  },
  {
    id: "ada-beach-estate",
    title: "Ada Beachfront Estate",
    location: "Ada Foah, Greater Accra",
    price: "GH₵ 14,000,000",
    priceSubtext: "Approx. $1,100,000 | £880,000",
    beds: 9,
    baths: 11,
    sqft: "28,000",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Luxurious waterfront beachfront compound in Ada Foah, designed for premium relaxation and private entertainment.",
    amenities: ["Putting Range", "Wine Cellar", "Saltwater Pools", "Smart Home Tech", "Landscaped Gardens"],
    category: "Waterfront Estates",
    status: "published",
    featured: false,
    order: 8,
  },
];

console.log("Seeding listings to Firestore...");
for (const listing of listings) {
  try {
    const docRef = adminDb.collection("listings").doc(listing.id);
    await docRef.set({
      ...listing,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Seeded: ${listing.title}`);
  } catch (err) {
    console.error(`❌ Failed to seed ${listing.title}:`, err);
  }
}
console.log("Seeding complete!");
process.exit(0);
