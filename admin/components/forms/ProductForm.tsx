"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
import type { Product, ProductCategory } from "@/types/database";

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [sizeInput, setSizeInput] = useState("");

  const [form, setForm] = useState({
    title: product?.title ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    original_price: product?.original_price?.toString() ?? "",
    category: (product?.category ?? "Rings") as ProductCategory,
    images: product?.images ?? [],
    material_specs: product?.material_specs ?? "",
    care_instructions: product?.care_instructions ?? "",
    sizes: product?.sizes ?? [],
    in_stock: product?.in_stock ?? true,
  });

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "title" && mode === "create") {
      setForm((prev) => ({ ...prev, slug: slugify(value as string) }));
    }
  }

  function addSize() {
    const trimmed = sizeInput.trim();
    if (trimmed && !form.sizes.includes(trimmed)) {
      updateField("sizes", [...form.sizes, trimmed]);
    }
    setSizeInput("");
  }

  function removeSize(size: string) {
    updateField("sizes", form.sizes.filter((s) => s !== size));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validImages = form.images.filter((img) => img.trim() !== "");
    if (validImages.length === 0) {
      toast.error("Please upload at least one image for the product.");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      category: form.category,
      images: validImages,
      material_specs: form.material_specs,
      care_instructions: form.care_instructions,
      sizes: form.sizes,
      in_stock: form.in_stock,
    };

    if (mode === "create") {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast.error("Failed to create product: " + error.message);
        setSaving(false);
        return;
      }
      toast.success("Product created!");
    } else {
      const { error } = await supabase.from("products").update(payload).eq("id", product!.id);
      if (error) {
        toast.error("Failed to update product: " + error.message);
        setSaving(false);
        return;
      }
      toast.success("Product updated!");
    }

    router.push("/products");
    router.refresh();
  }

  const inputClass =
    "w-full rounded-xl bg-[#fafcfb] border border-border px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white focus:border-mint focus:ring-2 focus:ring-mint/15 shadow-2xs transition-all";
  const labelClass = "block text-xs font-medium text-text-secondary mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-white shadow-xs p-6 space-y-5">
        <h3 className="text-sm font-semibold text-text-primary">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className={inputClass}
              placeholder="e.g. Silver Moonstone Ring"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className={inputClass}
              placeholder="auto-generated-from-title"
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={`${inputClass} min-h-[100px] resize-y`}
            placeholder="Write a detailed product description..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Price (৳) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className={inputClass}
              placeholder="580"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Original Price (৳)</label>
            <input
              type="number"
              value={form.original_price}
              onChange={(e) => updateField("original_price", e.target.value)}
              className={inputClass}
              placeholder="1160 (optional)"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value as ProductCategory)}
              className={inputClass}
            >
              <option value="Rings">Rings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Bracelets">Bracelets</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) => updateField("in_stock", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-bg-hover rounded-full peer peer-checked:bg-mint transition-all after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
          </label>
          <span className="text-sm text-text-secondary">In Stock</span>
        </div>
      </div>

      {/* Direct Image Upload */}
      <div className="rounded-2xl border border-border bg-white shadow-xs p-6">
        <MultiImageUpload
          images={form.images}
          onChange={(newImages) => updateField("images", newImages)}
          folder="products"
        />
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-border bg-white shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Details</h3>
        <div>
          <label className={labelClass}>Material &amp; Specs</label>
          <textarea
            value={form.material_specs}
            onChange={(e) => updateField("material_specs", e.target.value)}
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Sterling Silver 925..."
          />
        </div>
        <div>
          <label className={labelClass}>Care Instructions</label>
          <textarea
            value={form.care_instructions}
            onChange={(e) => updateField("care_instructions", e.target.value)}
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Avoid contact with water and perfume..."
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="rounded-2xl border border-border bg-white shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Sizes</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSize();
              }
            }}
            className={`${inputClass} flex-1`}
            placeholder="Type a size (e.g. 7 or One Size) and press Enter"
          />
          <button
            type="button"
            onClick={addSize}
            className="rounded-xl bg-mint-light hover:bg-mint hover:text-white text-mint font-semibold px-4 py-2.5 text-sm transition-all shadow-2xs"
          >
            Add
          </button>
        </div>
        {form.sizes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.sizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 rounded-lg bg-mint-light border border-mint-border px-2.5 py-1 text-xs font-semibold text-mint"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="text-text-muted hover:text-danger transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-6 py-3 sm:py-2.5 text-sm font-semibold text-white hover:bg-mint-dark disabled:opacity-50 transition-all shadow-xs"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="rounded-xl bg-bg-hover px-6 py-3 sm:py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-all text-center"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
