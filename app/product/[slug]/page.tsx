import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types/database";
import { ProductDetail } from "./ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    return mockProducts.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    const fallback = mockProducts.find((p) => p.slug === slug);
    return fallback ?? null;
  }

  return data as Product;
}

async function getRelatedProducts(
  category: string,
  excludeSlug: string
): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return mockProducts
      .filter((p) => p.category === category && p.slug !== excludeSlug)
      .slice(0, 4);
  }

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("slug", excludeSlug)
    .eq("in_stock", true)
    .limit(4);

  if (!data || data.length === 0) {
    return mockProducts
      .filter((p) => p.category === category && p.slug !== excludeSlug)
      .slice(0, 4);
  }

  return data as Product[];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found — Cresol" };
  }

  return {
    title: `${product.title} — Cresol`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} — Cresol`,
      description: product.description.slice(0, 160),
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.category,
    product.slug
  );

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
