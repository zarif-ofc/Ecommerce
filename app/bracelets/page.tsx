import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { CategoryView } from "@/components/shop/CategoryView";

export const metadata: Metadata = {
  title: "Sterling Silver & Beaded Bracelets | Cresol",
  description:
    "Shop elegant four-leaf clover station bracelets and evil eye talisman beaded bracelets by Cresol. Hypoallergenic daily wear.",
};

export const dynamic = "force-dynamic";

export default async function BraceletsPage() {
  const products = await getProducts("Bracelets");

  return <CategoryView currentCategory="Bracelets" products={products} />;
}
