"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Star,
  Plus,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { uploadMultipleImages } from "@/lib/storage";
import { toast } from "sonner";

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: "products" | "carousels";
}

export function MultiImageUpload({
  images,
  onChange,
  folder = "products",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    setError(null);
    setUploading(true);
    setProgress({ current: 0, total: files.length });

    const { urls, errors } = await uploadMultipleImages(
      files,
      folder,
      (completed, total) => {
        setProgress({ current: completed, total });
      }
    );

    setUploading(false);
    setProgress(null);

    if (urls.length > 0) {
      // Append new URLs, filtering out any empty strings
      const currentList = images.filter((img) => img.trim() !== "");
      onChange([...currentList, ...urls]);
      toast.success(`Uploaded ${urls.length} image${urls.length > 1 ? "s" : ""} successfully!`);
    }

    if (errors.length > 0) {
      const errMsg = errors.join("\n");
      setError(errMsg);
      toast.error(`Failed to upload ${errors.length} image(s)`);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
  }

  function setAsMain(index: number) {
    if (index === 0) return;
    const target = images[index];
    const without = images.filter((_, i) => i !== index);
    onChange([target, ...without]);
    toast.info("Main thumbnail updated");
  }

  function move(index: number, direction: "left" | "right") {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const next = [...images];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next);
  }

  function addViaUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    const currentList = images.filter((img) => img.trim() !== "");
    onChange([...currentList, trimmed]);
    setUrlDraft("");
    setShowUrlInput(false);
    toast.success("Image URL added");
  }

  const validImages = images.filter((img) => img.trim() !== "");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-text-secondary">
            Product Images ({validImages.length})
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            The first image is used as the primary catalog thumbnail.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-mint transition-colors"
        >
          <LinkIcon className="h-3 w-3" />
          {showUrlInput ? "Hide URL input" : "Add via URL"}
        </button>
      </div>

      {/* Optional URL Add */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-tertiary border border-border text-xs">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://example.com/product-photo.jpg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addViaUrl();
              }
            }}
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-xs focus:outline-none"
          />
          <button
            type="button"
            onClick={addViaUrl}
            className="rounded-lg bg-mint-light hover:bg-mint hover:text-white text-mint px-3 py-1 text-xs font-semibold transition-colors shadow-2xs"
          >
            Add
          </button>
        </div>
      )}

      {/* Hidden File Input (multiple) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error alert */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1 whitespace-pre-wrap">{error}</div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {validImages.map((url, i) => (
          <div
            key={i}
            className="group relative aspect-square rounded-xl border border-border bg-bg-tertiary overflow-hidden flex flex-col justify-between"
          >
            <img
              src={url}
              alt={`Product image ${i + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Badge for Main photo */}
            {i === 0 ? (
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-mint text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
                <Star className="h-2.5 w-2.5 fill-current" />
                Main
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAsMain(i)}
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 rounded-md bg-black/70 hover:bg-mint hover:text-white text-white/90 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm"
                title="Set as main thumbnail"
              >
                Set as Main
              </button>
            )}

            {/* Delete button */}
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 hover:bg-danger text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-md"
              title="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Reorder controls bar at bottom on hover */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => move(i, "left")}
                disabled={i === 0}
                className="flex h-5 w-5 items-center justify-center rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-20 transition-all"
                title="Move earlier"
              >
                <ArrowLeft className="h-3 w-3" />
              </button>
              <span className="text-[10px] text-white/70 font-mono">#{i + 1}</span>
              <button
                type="button"
                onClick={() => move(i, "right")}
                disabled={i === validImages.length - 1}
                className="flex h-5 w-5 items-center justify-center rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-20 transition-all"
                title="Move later"
              >
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {/* Dropzone Card inside grid */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative aspect-square cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all ${
            dragOver
              ? "border-mint bg-mint-light/40"
              : "border-border hover:border-mint hover:bg-mint-light/20 bg-[#fafcfb]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 p-2">
              <Loader2 className="h-6 w-6 text-mint animate-spin" />
              <p className="text-[11px] font-medium text-text-primary">
                {progress
                  ? `Uploading ${progress.current} of ${progress.total}...`
                  : "Uploading..."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-light text-mint border border-mint-border mb-2">
                <UploadCloud className="h-4 w-4" />
              </div>
              <p className="text-xs font-semibold text-text-primary">
                Add Images
              </p>
              <p className="text-[10px] text-text-muted mt-0.5 leading-tight">
                Click or drop files here (multiple)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
