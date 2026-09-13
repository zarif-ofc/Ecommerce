import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { CategoryView } from "@/components/shop/CategoryView";

export const metadata: Metadata = {
  title: "Shop All Jewellery — Rings, Necklaces & Bracelets | Cresol",
  description:
    "Explore Cresol's complete collection of hypoallergenic 925 sterling silver jewelry. Minimalist rings, keepsake lockets, and delicate chain bracelets.",
};

export const dynamic = "force-dynamic";

export default async function ShopAllPage() {
  const products = await getProducts("All");

  return <CategoryView currentCategory="All" products={products} />;
}
