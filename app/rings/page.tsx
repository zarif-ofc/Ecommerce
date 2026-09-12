import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { CategoryView } from "@/components/shop/CategoryView";

export const metadata: Metadata = {
  title: "Sterling Silver Rings Collection | Cresol",
  description:
    "Discover handcrafted sterling silver rings, minimalist bands, and natural blue moonstone statement pieces by Cresol. Designed for all-day comfort.",
};

export default async function RingsPage() {
  const products = await getProducts("Rings");

  return <CategoryView currentCategory="Rings" products={products} />;
}
