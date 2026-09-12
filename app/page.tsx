import { Suspense } from "react";
import { HomeContent } from "./HomeContent";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockProducts } from "@/lib/mock-data";
import type { Product, Carousel } from "@/types/database";
import { HeroSkeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";

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
    <div className="pt-16 lg:pt-[72px] min-h-screen bg-white">
      {/* Hero skeleton */}
      <HeroSkeleton />
      {/* Grid skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

