import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Save,
  X,
  Loader2,
  Star,
  AlertCircle,
  CheckCircle,
  ImageIcon,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { fetchProperties, saveProperties } from "./githubApi";
import type { Property } from "@/data/types";
import { CATEGORIES } from "@/data/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyProperty: Property = {
  id: "",
  title: "",
  location: "",
  price: "",
  priceValue: 0,
  beds: 0,
  baths: 0,
  sqft: "",
  image: "",
  category: CATEGORIES[0],
  featured: false,
};

export default function AdminPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [form, setForm] = useState<Property>(emptyProperty);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchProperties(token);
      setProperties(data.properties);
      setSha(data.sha);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load properties");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const openAdd = () => {
    setEditingProperty(null);
    setForm(emptyProperty);
    setModalOpen(true);
  };

  const openEdit = (p: Property) => {
    setEditingProperty(p);
    setForm({ ...p });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProperty(null);
  };

  const updateField = <K extends keyof Property>(key: K, value: Property[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !editingProperty) {
        next.id = slugify(value as string);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!token || !form.title || !form.id) return;
    setSaving(true);
    setError("");
    try {
      let updated: Property[];
      let message: string;

      if (editingProperty) {
        updated = properties.map((p) => (p.id === editingProperty.id ? form : p));
        message = `Update property: ${form.title}`;
      } else {
        updated = [...properties, form];
        message = `Add property: ${form.title}`;
      }

      const newSha = await saveProperties(token, updated, sha, message);
      setSha(newSha);
      setProperties(updated);
      setSuccess(editingProperty ? "Property updated" : "Property added");
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!token || !deleteId) return;
    setSaving(true);
    setError("");
    try {
      const prop = properties.find((p) => p.id === deleteId);
      const updated = properties.filter((p) => p.id !== deleteId);
      const newSha = await saveProperties(
        token,
        updated,
        sha,
        `Delete property: ${prop?.title || deleteId}`
      );
      setSha(newSha);
      setProperties(updated);
      setSuccess("Property deleted");
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <div className="bg-[#0F0F0F] border-b border-white/5 px-6 lg:px-12 py-5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-2xl lg:text-3xl font-light text-white">
              Property Management
            </h1>
            <p className="font-['Montserrat'] text-xs text-white/40 mt-1">
              {properties.length} properties &middot; Git CMS
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAdd}
              className="px-5 py-2.5 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Property</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 border border-white/10 rounded-lg text-white/50 hover:text-white hover:border-white/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="bg-green-500/10 border-b border-green-500/20 px-6 py-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="max-w-[1440px] mx-auto flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="font-['Montserrat'] text-sm text-green-400">{success}</span>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            className="bg-red-500/10 border-b border-red-500/20 px-6 py-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="max-w-[1440px] mx-auto flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="font-['Montserrat'] text-sm text-red-400">{error}</span>
              <button onClick={() => setError("")} className="ml-auto text-red-400/60 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="px-6 lg:px-12 py-8">
        <div className="max-w-[1440px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-['Cormorant_Garamond'] text-3xl text-white/30 mb-4">No properties yet</p>
              <button
                onClick={openAdd}
                className="px-8 py-3 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-sm font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all"
              >
                Add Your First Property
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  className="flex items-center gap-4 p-4 bg-[#0F0F0F] border border-white/5 rounded-xl hover:border-white/10 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    {property.image ? (
                      <img src={property.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-['Montserrat'] text-sm font-medium text-white truncate">
                        {property.title}
                      </h3>
                      {property.featured && (
                        <Star className="w-3.5 h-3.5 text-[#C9A96E] flex-shrink-0 fill-[#C9A96E]" />
                      )}
                    </div>
                    <p className="font-['Montserrat'] text-xs text-white/40 truncate">
                      {property.location}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="hidden md:block">
                    <span className="font-['Montserrat'] text-sm text-[#C9A96E]">
                      {property.price}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="hidden lg:block">
                    <span className="px-2.5 py-1 bg-white/5 rounded-full font-['Montserrat'] text-[10px] text-white/50 uppercase tracking-wider">
                      {property.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => openEdit(property)}
                      className="p-2 rounded-lg text-white/40 hover:text-[#C9A96E] hover:bg-white/5 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(property.id)}
                      className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 lg:p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Cormorant_Garamond'] text-2xl font-light text-white">
                  {editingProperty ? "Edit Property" : "Add Property"}
                </h2>
                <button onClick={closeModal} className="p-2 text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                    Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                    placeholder="e.g. Luxury Villa in East Legon"
                  />
                </div>

                {/* ID */}
                <div>
                  <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                    ID (slug)
                  </label>
                  <input
                    value={form.id}
                    onChange={(e) => updateField("id", e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white/60 placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                    placeholder="auto-generated-from-title"
                  />
                </div>

                {/* Location & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                      Location
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                      placeholder="East Legon, Accra"
                    />
                  </div>
                  <div>
                    <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white focus:border-[#C9A96E] focus:outline-none transition-colors"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                      Price (display)
                    </label>
                    <input
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                      placeholder="GH₵ 12,500,000"
                    />
                  </div>
                  <div>
                    <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                      Price Value (numeric)
                    </label>
                    <input
                      type="number"
                      value={form.priceValue || ""}
                      onChange={(e) => updateField("priceValue", Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                      placeholder="12500000"
                    />
                  </div>
                </div>

                {/* Beds, Baths, SqFt */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                      Beds
                    </label>
                    <input
                      type="number"
                      value={form.beds || ""}
                      onChange={(e) => updateField("beds", Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                      Baths
                    </label>
                    <input
                      type="number"
                      value={form.baths || ""}
                      onChange={(e) => updateField("baths", Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                      SqFt
                    </label>
                    <input
                      value={form.sqft}
                      onChange={(e) => updateField("sqft", e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                      placeholder="27,000"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block font-['Montserrat'] text-xs font-medium uppercase tracking-[0.1em] text-white/60 mb-1.5">
                    Image URL
                  </label>
                  <input
                    value={form.image}
                    onChange={(e) => updateField("image", e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg font-['Montserrat'] text-sm text-white placeholder:text-white/30 focus:border-[#C9A96E] focus:outline-none transition-colors"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {form.image && (
                    <div className="mt-2 h-32 rounded-lg overflow-hidden bg-white/5">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Featured Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                      form.featured ? "bg-[#C9A96E]" : "bg-white/10"
                    }`}
                    onClick={() => updateField("featured", !form.featured)}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${
                        form.featured ? "translate-x-4" : ""
                      }`}
                    />
                  </div>
                  <span className="font-['Montserrat'] text-sm text-white/70">
                    Featured on homepage
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-white/10 rounded-lg font-['Montserrat'] text-xs font-medium text-white/60 hover:text-white hover:border-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.id}
                  className="px-6 py-2.5 bg-[#C9A96E] rounded-lg font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] hover:bg-[#D4B87E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save & Commit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div
              className="relative w-full max-w-sm bg-[#0F0F0F] border border-white/10 rounded-2xl p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-light text-white mb-2">
                Delete Property
              </h3>
              <p className="font-['Montserrat'] text-sm text-white/50 mb-6">
                Are you sure you want to delete{" "}
                <span className="text-white">
                  {properties.find((p) => p.id === deleteId)?.title}
                </span>
                ? This will commit the change to the repository.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-5 py-2.5 border border-white/10 rounded-lg font-['Montserrat'] text-xs font-medium text-white/60 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-5 py-2.5 bg-red-500 rounded-lg font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {saving ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
