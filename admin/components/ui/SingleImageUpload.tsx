"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon, Link as LinkIcon, RefreshCw, AlertCircle } from "lucide-react";
import { uploadImage } from "@/lib/storage";
import { toast } from "sonner";

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "products" | "carousels";
  label?: string;
  helperText?: string;
  required?: boolean;
}

export function SingleImageUpload({
  value,
  onChange,
  folder = "carousels",
  label = "Banner Image",
  helperText = "Recommended: 1920x800 or high-res widescreen (max 10MB)",
  required = false,
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(file: File) {
    if (!file) return;
    setError(null);
    setUploading(true);

    const { url, error: uploadErr } = await uploadImage(file, folder);
    setUploading(false);

    if (uploadErr) {
      setError(uploadErr);
      toast.error(uploadErr);
    } else if (url) {
      onChange(url);
      setUrlDraft(url);
      toast.success("Image uploaded successfully!");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset file input value so selecting the same file again triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleClear() {
    onChange("");
    setUrlDraft("");
    setError(null);
  }

  function applyUrl() {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setShowUrlInput(false);
      setError(null);
      toast.success("Image URL applied");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-text-secondary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-mint transition-colors"
        >
          <LinkIcon className="h-3 w-3" />
          {showUrlInput ? "Hide URL input" : "Or enter URL"}
        </button>
      </div>

      {/* Optional URL fallback input */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-tertiary border border-border text-xs">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-xs focus:outline-none"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="rounded-lg bg-mint-light hover:bg-mint hover:text-white text-mint px-2.5 py-1 text-xs font-semibold transition-colors shadow-2xs"
          >
            Apply
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {value ? (
        /* Image Preview with Controls */
        <div className="relative group rounded-xl border border-border bg-[#fafcfb] overflow-hidden shadow-xs">
          <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full overflow-hidden bg-black/40">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay with actions on hover / mobile */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white transition-all shadow-lg"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Change Image
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-danger/80 hover:bg-danger px-3 py-1.5 text-xs font-medium text-white transition-all shadow-lg"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-white text-[11px] text-text-muted gap-2">
            <span className="truncate flex-1 font-mono text-[10px] text-text-muted">{value}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1 rounded-md bg-bg-hover hover:bg-mint-light hover:text-mint px-2 py-1 text-[11px] font-medium text-text-secondary transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={uploading}
                className="inline-flex items-center gap-1 rounded-md bg-rose-50 hover:bg-rose-100 px-2 py-1 text-[11px] font-medium text-rose-600 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-all text-center flex flex-col items-center justify-center gap-3 ${
            dragOver
              ? "border-mint bg-mint-light/40"
              : "border-border hover:border-mint hover:bg-mint-light/20 bg-[#fafcfb]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="h-8 w-8 text-mint animate-spin" />
              <p className="text-xs font-medium text-text-primary">Uploading image to Supabase...</p>
              <p className="text-[11px] text-text-muted">Please wait a moment</p>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint-light border border-mint-border text-mint">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-text-primary">
                  <span className="text-mint hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">{helperText}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
