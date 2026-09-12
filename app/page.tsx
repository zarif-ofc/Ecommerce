import { Suspense } from "react";
import { HomeContent } from "./HomeContent";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockProducts } from "@/lib/mock-data";
import type { Product, Carousel } from "@/types/database";

async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return mockProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error);
    return mockProducts;
  }

  return (data as Product[]) ?? mockProducts;
}

async function getCarousels(): Promise<Carousel[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("carousels")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("Could not fetch carousels, falling back to default:", error.message);
      return [];
    }

    return (data as Carousel[]) ?? [];
  } catch (err) {
    console.warn("Exception fetching carousels:", err);
    return [];
  }
}

export default async function HomePage() {
  const [products, carousels] = await Promise.all([
    getProducts(),
    getCarousels(),
  ]);

  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent products={products} carousels={carousels} />
    </Suspense>
  );
}

function HomeLoading() {
  return (
    <div className="pt-16 lg:pt-[72px]">
      {/* Hero skeleton */}
      <div className="relative h-[520px] bg-bone animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-bone via-white to-bone" />
      {/* Grid skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square rounded-xl bg-bone animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-bone via-white to-bone" />
              <div className="mt-3 h-4 w-3/4 rounded bg-bone" />
              <div className="mt-2 h-4 w-1/2 rounded bg-bone" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
