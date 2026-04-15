"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  ImageIcon,
  UploadCloud,
  Loader2,
} from "lucide-react";

interface MenuItem {
  id: number;
  title: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  badge?: string | null;
  calories?: number | null;
  protein?: string | null;
  carbs?: string | null;
  rating?: number | null;
  reviews?: number | null;
  tagline?: string | null;
}

const CATEGORIES = [
  "recommended",
  "fried-rice-noodles",
  "sandwiches",
  "snacks",
  "maggi",
  "breads",
  "healthy-breakfast",
  "vrat-special",
  "diet-dial",
  "rice",
  "south-indian",
  "burgers",
  "bhajiye",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  recommended: "Recommended",
  "fried-rice-noodles": "Fried Rice & Noodles",
  sandwiches: "Sandwiches",
  snacks: "Snacks",
  maggi: "Maggi",
  breads: "Breads",
  "healthy-breakfast": "Healthy Breakfast",
  "vrat-special": "Vrat Special",
  "diet-dial": "Diet Dial",
  rice: "Rice",
  "south-indian": "South Indian",
  burgers: "Burgers",
  bhajiye: "Bhajiye",
};

const emptyForm = {
  title: "",
  price: "",
  description: "",
  image_url: "",
  category: "recommended",
  badge: "",
  calories: "",
  protein: "",
  carbs: "",
  rating: "4.5",
  reviews: "0",
  tagline: "",
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // File Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setLocalPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, image_url: "" }));
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      price: String(item.price),
      description: item.description,
      image_url: item.image_url,
      category: item.category,
      badge: item.badge || "",
      calories: String(item.calories || ""),
      protein: item.protein || "",
      carbs: item.carbs || "",
      rating: String(item.rating || "4.5"),
      reviews: String(item.reviews || "0"),
      tagline: item.tagline || "",
    });
    setImageFile(null);
    setLocalPreview(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setImageFile(null);
    setLocalPreview(null);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.description) return;
    setSaving(true);

    let finalImageUrl = form.image_url;

    // Step 1: Upload to Cloudinary if a new file is selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          finalImageUrl = uploadData.url;
        } else {
          alert("Cloudinary Upload Failed");
          setSaving(false);
          return;
        }
      } catch (err) {
        setSaving(false);
        return;
      }
    }

    if (!finalImageUrl) {
      alert("Please upload an image.");
      setSaving(false);
      return;
    }

    // Step 2: Save to Prisma via your existing API
    const payload = {
      ...form,
      price: Number(form.price),
      image_url: finalImageUrl,
      calories: form.calories ? Number(form.calories) : null,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
    };

    try {
      const url = editingId ? `/api/menu/${editingId}` : "/api/menu";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchItems();
        handleCancel();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems =
    filterCategory === "all"
      ? items
      : items.filter((i) => i.category === filterCategory);

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" />
      </div>
    );

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-4xl text-neutral-900">
            Bites of Bliss Menu
          </h1>
          <p className="text-neutral-500 text-sm">
            Manage items and cloud-hosted assets.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add New Item
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0  bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="font-display font-bold text-2xl">
                {editingId ? "Edit Item" : "Create Item"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              {/* Image Section */}
              <div className="flex gap-6 items-center bg-neutral-50 p-6 rounded-3xl border border-dashed border-neutral-200">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-inner border border-neutral-100 flex items-center justify-center shrink-0">
                  {localPreview || form.image_url ? (
                    <img
                      src={localPreview || form.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-neutral-300" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 rounded-2xl cursor-pointer hover:border-brand-primary/50 hover:bg-white transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-6 h-6 text-neutral-400 mb-2" />
                      <p className="text-sm font-bold text-neutral-600">
                        {imageFile ? imageFile.name : "Upload from Local"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Item Name"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                />
                <input
                  placeholder="Price (₹)"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                />
              </div>

              <textarea
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium resize-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Badge (e.g. Popular)"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                />
              </div>

              {/* --- PASTE THIS MISSING NUTRITION & METADATA SECTION BACK IN --- */}
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2 block">
                  Nutrition (Optional)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Calories"
                    value={form.calories}
                    onChange={(e) =>
                      setForm({ ...form, calories: e.target.value })
                    }
                    className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                  />
                  <input
                    placeholder="Protein (e.g. 34g)"
                    value={form.protein}
                    onChange={(e) =>
                      setForm({ ...form, protein: e.target.value })
                    }
                    className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                  />
                  <input
                    placeholder="Carbs (e.g. 18g)"
                    value={form.carbs}
                    onChange={(e) =>
                      setForm({ ...form, carbs: e.target.value })
                    }
                    className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: e.target.value })
                    }
                    className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                    Reviews
                  </label>
                  <input
                    type="number"
                    value={form.reviews}
                    onChange={(e) =>
                      setForm({ ...form, reviews: e.target.value })
                    }
                    className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                    Tagline
                  </label>
                  <input
                    placeholder="Farm Fresh"
                    value={form.tagline}
                    onChange={(e) =>
                      setForm({ ...form, tagline: e.target.value })
                    }
                    className="bg-neutral-50 p-4 rounded-xl outline-none border focus:border-brand-primary transition-all font-medium"
                  />
                </div>
              </div>
              {/* -------------------------------------------------------------- */}
            </div>

            {/* This is your existing footer */}
            <div className="p-8 border-t bg-neutral-50 flex gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 py-4 font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? "Processing..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-brand-primary shadow-sm">
                ₹{item.price}
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-neutral-500 text-sm line-clamp-2 mb-6">
                {item.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-neutral-100 hover:bg-blue-100 text-neutral-700 hover:text-blue-600 p-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(item.id)}
                  className="w-12 bg-neutral-100 hover:bg-red-100 text-neutral-700 hover:text-red-600 rounded-xl transition-all flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
