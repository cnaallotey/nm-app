export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  category: string;
  featured?: boolean;
}

export const CATEGORIES = [
  "Waterfront Estates",
  "Urban Penthouses",
  "Gated Communities",
  "Executive Mansions",
] as const;
