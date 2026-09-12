import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { CategoryView } from "@/components/shop/CategoryView";

export const metadata: Metadata = {
  title: "Sterling Silver Necklaces & Lockets | Cresol",
  description:
    "Explore delicate sterling silver necklaces, vintage-inspired keepsake lockets, and refined pendants crafted with enduring quality.",
};

export default async function NecklacesPage() {
  const products = await getProducts("Necklaces");

  return <CategoryView currentCategory="Necklaces" products={products} />;
}
