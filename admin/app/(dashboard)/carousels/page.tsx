"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { SingleImageUpload } from "@/components/ui/SingleImageUpload";
import type { Carousel } from "@/types/database";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  ArrowUp,
  ArrowDown,
  Images,
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  Smartphone,
} from "lucide-react";

export default function CarouselsPage() {
  const [slides, setSlides] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Carousel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Carousel | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    mobile_image_url: "",
    link_url: "/shop",
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    setLoading(true);
    const { data, error } = await supabase
      .from("carousels")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast.error("Failed to load carousels");
    } else {
      setSlides(data as Carousel[]);
    }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      subtitle: "",
      image_url: "",
      mobile_image_url: "",
      link_url: "/shop",
    });
    setFormOpen(true);
  }

  function openEdit(slide: Carousel) {
    setEditing(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.image_url,
      mobile_image_url: slide.mobile_image_url || "",
      link_url: slide.link_url,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!form.image_url.trim()) {
      toast.error("Please upload the PC / Desktop banner image.");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      image_url: form.image_url,
      mobile_image_url: form.mobile_image_url || "",
      link_url: form.link_url,
    };

    if (editing) {
      const { error } = await supabase
        .from("carousels")
        .update(payload)
        .eq("id", editing.id);

      if (error) {
        if (error.message?.includes("mobile_image_url")) {
          toast.error(
            "Column 'mobile_image_url' not found in Supabase. Please run: ALTER TABLE carousels ADD COLUMN IF NOT EXISTS mobile_image_url TEXT DEFAULT ''; in Supabase SQL Editor."
          );
        } else {
          toast.error("Failed to update slide: " + error.message);
        }
      } else {
        toast.success("Slide updated successfully!");
        fetchSlides();
        setFormOpen(false);
      }
    } else {
      const newSortOrder = slides.length;
      const { error } = await supabase
        .from("carousels")
        .insert({ ...payload, sort_order: newSortOrder, is_active: true });

      if (error) {
        if (error.message?.includes("mobile_image_url")) {
          toast.error(
            "Column 'mobile_image_url' not found in Supabase. Please run: ALTER TABLE carousels ADD COLUMN IF NOT EXISTS mobile_image_url TEXT DEFAULT ''; in Supabase SQL Editor."
          );
        } else {
          toast.error("Failed to create slide: " + error.message);
        }
      } else {
        toast.success("Slide created successfully!");
        fetchSlides();
        setFormOpen(false);
      }
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("carousels").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("Failed to delete slide: " + error.message);
    } else {
      toast.success("Slide deleted");
      setSlides((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
    setDeleting(false);
  }

  async function toggleActive(slide: Carousel) {
    const { error } = await supabase
      .from("carousels")
      .update({ is_active: !slide.is_active })
      .eq("id", slide.id);
    if (error) {
      toast.error("Failed to toggle visibility: " + error.message);
    } else {
      toast.success(slide.is_active ? "Slide hidden" : "Slide visible");
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, is_active: !s.is_active } : s))
      );
    }
  }

  async function moveSlide(slide: Carousel, direction: "up" | "down") {
    const currentIndex = slides.findIndex((s) => s.id === slide.id);
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= slides.length) return;

    const other = slides[swapIndex];
    await Promise.all([
      supabase.from("carousels").update({ sort_order: other.sort_order }).eq("id", slide.id),
      supabase.from("carousels").update({ sort_order: slide.sort_order }).eq("id", other.id),
    ]);

    fetchSlides();
  }

  const inputClass =
    "w-full rounded-xl bg-[#fafcfb] border border-border px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white focus:border-mint focus:ring-2 focus:ring-mint/15 shadow-2xs transition-all";

  return (
    <>
      <PageHeader
        title="Hero Carousels"
        description="Manage responsive hero banner slides for desktop and mobile storefronts"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Carousels" }]}
        action={{ label: "Add Slide", onClick: openCreate, icon: Plus }}
      />

      {/* Slides List */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-border bg-white px-5 py-16 text-center text-sm text-text-muted shadow-xs">
            Loading carousel slides...
          </div>
        ) : slides.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white flex flex-col items-center justify-center py-16 text-center shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-light text-mint mb-3">
              <Images className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-text-primary">No carousel slides yet</p>
            <p className="text-xs text-text-muted mt-1 max-w-sm">
              Create responsive hero banners with dedicated PC and mobile images.
            </p>
            <button
              onClick={openCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-mint px-4 py-2 text-xs font-semibold text-white hover:bg-mint-dark transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add your first slide
            </button>
          </div>
        ) : (
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`rounded-2xl border bg-white shadow-xs overflow-hidden transition-all duration-200 hover:border-mint-border ${
                slide.is_active ? "border-border" : "border-border opacity-65 bg-bg-primary/50"
              }`}
            >
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
                {/* Visual Previews: Desktop + Mobile */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {/* PC / Desktop Preview */}
                  <div className="relative h-18 w-32 rounded-xl bg-bg-tertiary overflow-hidden border border-border group" title="PC / Desktop Banner">
                    {slide.image_url ? (
                      <img
                        src={slide.image_url}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-text-muted text-[10px]">
                        No PC Image
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1 inline-flex items-center gap-1 rounded bg-black/60 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-semibold text-white">
                      <Monitor className="h-2.5 w-2.5" /> PC
                    </span>
                  </div>

                  {/* Mobile Preview */}
                  <div className="relative h-18 w-14 rounded-xl bg-bg-tertiary overflow-hidden border border-border group" title="Mobile Banner">
                    {slide.mobile_image_url ? (
                      <img
                        src={slide.mobile_image_url}
                        alt="Mobile banner"
                        className="h-full w-full object-cover"
                      />
                    ) : slide.image_url ? (
                      <img
                        src={slide.image_url}
                        alt="Fallback banner"
                        className="h-full w-full object-cover opacity-60"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-text-muted text-[9px]">
                        None
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1 inline-flex items-center gap-0.5 rounded bg-black/60 backdrop-blur-xs px-1 py-0.5 text-[9px] font-semibold text-white">
                      <Smartphone className="h-2.5 w-2.5" /> M
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-text-primary truncate">
                      {slide.title || "(Untitled Slide)"}
                    </h3>
                    <Badge variant={slide.is_active ? "success" : "default"}>
                      {slide.is_active ? "Active" : "Hidden"}
                    </Badge>
                    {slide.mobile_image_url ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-mint bg-mint-light border border-mint-border px-2 py-0.5 rounded-full">
                        <Smartphone className="h-3 w-3" /> Custom Mobile Image
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-text-muted bg-bg-tertiary px-2 py-0.5 rounded-full">
                        Using PC Fallback on Mobile
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-1">
                    {slide.subtitle || "(No subtitle provided)"}
                  </p>
                  <p className="text-[11px] text-text-muted font-mono mt-0.5 truncate">
                    Destination: <span className="text-text-secondary">{slide.link_url}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-1 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
                  <button
                    onClick={() => moveSlide(slide, "up")}
                    disabled={index === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-bg-hover hover:text-text-primary disabled:opacity-25 transition-all"
                    title="Move earlier"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveSlide(slide, "down")}
                    disabled={index === slides.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-bg-hover hover:text-text-primary disabled:opacity-25 transition-all"
                    title="Move later"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(slide)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-mint-light hover:text-mint transition-all"
                    title={slide.is_active ? "Hide slide" : "Show slide"}
                  >
                    {slide.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(slide)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-mint-light hover:text-mint transition-all"
                    title="Edit slide"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(slide)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-rose-50 hover:text-danger transition-all"
                    title="Delete slide"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal with Dual Image Upload */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Hero Carousel Slide" : "Create Hero Carousel Slide"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Title / Headline
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="e.g. Timeless Modern Jewellery"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Link URL / Target
              </label>
              <input
                type="text"
                value={form.link_url}
                onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                className={inputClass}
                placeholder="/shop or /product/slug"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Subtitle / Description
            </label>
            <textarea
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className={`${inputClass} min-h-[60px] resize-y`}
              placeholder="e.g. Minimalist silver pieces crafted for everyday elegance..."
            />
          </div>

          {/* DUAL IMAGE UPLOAD SECTION */}
          <div className="border-t border-border pt-4 space-y-4">
            <div className="rounded-2xl border border-mint-border/80 bg-mint-light/30 p-3 text-xs text-mint flex items-start gap-2">
              <Monitor className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Dual Device Support:</span> You can upload separate banners tailored for PC screens and mobile phone screens.
              </div>
            </div>

            {/* 1. PC / Desktop Image */}
            <div className="rounded-2xl border border-border bg-[#fcfdfc] p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-mint text-white text-xs">
                  <Monitor className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-text-primary">1. PC / Desktop Banner</span>
                <span className="text-[11px] text-danger font-semibold">*Required</span>
              </div>
              <SingleImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="carousels"
                label="Desktop Image (Widescreen)"
                helperText="Recommended: 1920×800 or 16:9 widescreen (max 10MB)"
                required
              />
            </div>

            {/* 2. Mobile Image */}
            <div className="rounded-2xl border border-border bg-[#fcfdfc] p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-mint-light text-mint border border-mint-border text-xs">
                  <Smartphone className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-text-primary">2. Mobile Phone Banner</span>
                <span className="text-[11px] text-text-muted font-normal">(Optional — defaults to PC banner if empty)</span>
              </div>
              <SingleImageUpload
                value={form.mobile_image_url}
                onChange={(url) => setForm({ ...form, mobile_image_url: url })}
                folder="carousels"
                label="Mobile Image (Portrait / Tall)"
                helperText="Recommended: 800×1000 or 4:5 / 9:16 portrait (max 10MB)"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-xl bg-bg-hover px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-all text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-6 py-2.5 text-sm font-semibold text-white hover:bg-mint-dark disabled:opacity-50 transition-all shadow-xs"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Save Slide Changes" : "Create Slide"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Carousel Slide"
      >
        <p className="text-sm text-text-secondary mb-5">
          Are you sure you want to delete this carousel slide? This will remove it from the storefront banner.
        </p>
        <div className="flex justify-end gap-2.5">
          <button
            onClick={() => setDeleteTarget(null)}
            className="rounded-xl bg-bg-hover px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger/90 disabled:opacity-50 transition-all shadow-xs"
          >
            {deleting ? "Deleting..." : "Delete Slide"}
          </button>
        </div>
      </Modal>
    </>
  );
}
