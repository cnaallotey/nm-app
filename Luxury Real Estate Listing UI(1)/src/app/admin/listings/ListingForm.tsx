"use client";
import React, { useState } from "react";
import { Listing } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, X, Link2 } from "lucide-react";

// Convert a Google Drive "share" link into a directly embeddable image URL.
// A normal share link (drive.google.com/file/d/ID/view) returns an HTML page,
// not the image bytes, so it can't be used as an <img src>. The lh3 endpoint
// serves the raw file. Any non-Drive URL is returned unchanged.
function normalizeImageUrl(raw: string): string {
  const url = raw.trim();
  const match = url.match(
    /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/(?:open|uc)\?(?:export=\w+&)?id=|drive\.google\.com\/.*[?&]id=)([\w-]{20,})/
  );
  if (match) {
    return `https://lh3.googleusercontent.com/d/${match[1]}=w1600`;
  }
  return url;
}

interface ListingFormProps {
  initialData?: Listing;
  onSubmit: (data: Omit<Listing, "createdAt" | "updatedAt">) => Promise<void>;
  isSubmitting: boolean;
}

const categories = [
  "Waterfront Estates",
  "Urban Penthouses",
  "Gated Communities",
  "Executive Mansions",
];

const availableAmenities = [
  "Bowling Alley",
  "Putting Range",
  "Spa & Sauna",
  "Wine Cellar",
  "94 Solar Panels",
  "10-Car Garage",
  "Saltwater Pools",
  "2 Elevators",
  "Private Gym",
  "Security System",
  "Smart Home Tech",
  "Landscaped Gardens",
];

export default function ListingForm({ initialData, onSubmit, isSubmitting }: ListingFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [id, setId] = useState(initialData?.id || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [price, setPrice] = useState(initialData?.price || "GH₵ ");
  const [priceSubtext, setPriceSubtext] = useState(initialData?.priceSubtext || "");
  const [beds, setBeds] = useState(initialData?.beds || 0);
  const [baths, setBaths] = useState(initialData?.baths || 0);
  const [sqft, setSqft] = useState(initialData?.sqft || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [category, setCategory] = useState(initialData?.category || categories[0]);
  const [status, setStatus] = useState<"published" | "draft" | "sold">(initialData?.status || "draft");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Generate slug automatically for new listings
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setId(slug);
    }
  };

  const addImageUrl = () => {
    const url = normalizeImageUrl(imageUrlInput);
    if (!url) {
      toast.error("Please paste an image URL first.");
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      toast.error("Enter a valid URL starting with http:// or https://");
      return;
    }
    if (images.includes(url)) {
      toast.error("That image has already been added.");
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageUrlInput("");
  };

  const handleImageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addImageUrl();
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title || !location || !price || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please add at least one property image URL.");
      return;
    }

    onSubmit({
      id,
      title,
      location,
      price,
      priceSubtext,
      beds,
      baths,
      sqft,
      description,
      images,
      category,
      status,
      featured,
      amenities: selectedAmenities,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-['Montserrat']">
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white border-b border-white/5 pb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              Property Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Villa Serena"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
              required
            />
          </div>

          {/* ID slug */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              URL ID Slug (System Slug) *
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
              placeholder="e.g. villa-serena"
              disabled={!!initialData}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. East Legon, Accra"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing and Size */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white border-b border-white/5 pb-4">
          Price, Dimensions & Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              Display Price *
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. GH₵ 12,500,000"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
              required
            />
          </div>

          {/* Price Subtext */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              Price Subtext (Optional)
            </label>
            <input
              type="text"
              value={priceSubtext}
              onChange={(e) => setPriceSubtext(e.target.value)}
              placeholder="e.g. Approx. $980,000 | £780,000"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
            />
          </div>

          {/* Beds / Baths */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
                Beds
              </label>
              <input
                type="number"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                min={0}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
                Baths
              </label>
              <input
                type="number"
                value={baths}
                onChange={(e) => setBaths(Number(e.target.value))}
                min={0}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
              />
            </div>
          </div>

          {/* SqFt */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
              Area (SqFt)
            </label>
            <input
              type="text"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              placeholder="e.g. 27,000"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the property's features, landscape, quarters..."
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors resize-none"
            required
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white border-b border-white/5 pb-4">
          Amenities Selection
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {availableAmenities.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <button
                type="button"
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`p-3 rounded-lg border text-xs font-medium tracking-wide transition-all text-center cursor-pointer ${
                  isSelected
                    ? "bg-[#fbbf24]/20 border-[#fbbf24] text-[#fbbf24]"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white border-b border-white/5 pb-4">
          Property Images
        </h3>

        {/* Image URL input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
            Image URL
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              inputMode="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={handleImageInputKeyDown}
              placeholder="Paste an image link, then press Enter or Add"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-5 py-3 bg-white/5 hover:bg-[#fbbf24] hover:text-[#1A1A1A] border border-white/10 hover:border-[#fbbf24] rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Google Drive helper */}
          <div className="flex items-start gap-2 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/20 p-3">
            <Link2 className="w-4 h-4 text-[#fbbf24] mt-0.5 shrink-0" />
            <div className="text-xs text-white/65 leading-relaxed space-y-1">
              <p>
                <span className="text-[#fbbf24] font-semibold">Using Google Drive?</span>{" "}
                Upload the image to Drive, right-click it → <em>Share</em> → set access to{" "}
                <span className="text-white/85 font-medium">&ldquo;Anyone with the link&rdquo;</span>, then{" "}
                <em>Copy link</em> and paste it here. We&rsquo;ll convert it to a direct image link automatically.
              </p>
              <p className="text-white/45">
                Any direct image URL also works (Unsplash, ImgBB, Cloudinary, etc.). The first image is used as the cover.
              </p>
            </div>
          </div>
        </div>

        {/* Images Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative h-28 rounded-lg overflow-hidden border border-white/10 group"
              >
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 text-center text-[9px] text-[#fbbf24] uppercase tracking-wide font-bold">
                    Cover Image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Listing Status and Publishing */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white border-b border-white/5 pb-4">
          Publishing Controls
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Status Dropdown */}
          <div className="space-y-2 w-full sm:w-auto">
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75 block">
              Listing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbbf24] transition-colors"
            >
              <option value="draft">Draft (Admin Only)</option>
              <option value="published">Published (Public)</option>
              <option value="sold">Sold (Marked Sold)</option>
            </select>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center space-x-3 pt-6 sm:pt-0">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#fbbf24] rounded"
            />
            <label htmlFor="featured" className="text-sm text-white font-medium select-none cursor-pointer">
              Feature this listing on landing page portfolio
            </label>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push("/admin/listings")}
          className="px-6 py-3 border border-white/10 hover:bg-white/5 rounded-lg text-sm text-white transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#fbbf24] hover:bg-[#D4B87E] disabled:bg-[#fbbf24]/50 text-[#1A1A1A] font-semibold rounded-lg text-sm transition-all flex items-center space-x-2 shadow cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Listing</span>
          )}
        </button>
      </div>
    </form>
  );
}
