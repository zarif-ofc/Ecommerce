import { supabase } from "./supabase";

export const STORAGE_BUCKET = "cresol-media";

export interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Clean a file name for storage path: removes special characters, lowercase
 */
function sanitizeFileName(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot !== -1 ? name.substring(0, lastDot) : name;
  const ext = lastDot !== -1 ? name.substring(lastDot + 1) : "jpg";

  const cleanBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 40);

  return `${cleanBase || "image"}.${ext.toLowerCase()}`;
}

/**
 * Upload a single image file to Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: "products" | "carousels" = "products"
): Promise<UploadResult> {
  try {
    if (!file.type.startsWith("image/")) {
      return { url: null, error: "Please upload an image file (JPG, PNG, WebP, GIF, SVG)." };
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return { url: null, error: "Image size must be 10MB or less." };
    }

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 7);
    const fileName = sanitizeFileName(file.name);
    const storagePath = `${folder}/${timestamp}-${randomId}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      // Check for common error scenarios to give helpful feedback
      if (
        uploadError.message?.includes("Bucket not found") ||
        uploadError.message?.includes("not found")
      ) {
        return {
          url: null,
          error:
            "Storage bucket 'cresol-media' was not found. Please run the provided SQL in your Supabase SQL Editor.",
        };
      }
      if (
        uploadError.message?.includes("policy") ||
        uploadError.message?.includes("security") ||
        uploadError.message?.includes("row-level")
      ) {
        return {
          url: null,
          error:
            "Upload denied by storage policy. Please ensure the storage RLS policy has been added in Supabase.",
        };
      }
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return { url: null, error: message };
  }
}

/**
 * Upload multiple image files sequentially, reporting progress
 */
export async function uploadMultipleImages(
  files: File[],
  folder: "products" | "carousels" = "products",
  onProgress?: (completed: number, total: number) => void
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { url, error } = await uploadImage(file, folder);
    if (url) {
      urls.push(url);
    } else if (error) {
      errors.push(`${file.name}: ${error}`);
    }
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return { urls, errors };
}
