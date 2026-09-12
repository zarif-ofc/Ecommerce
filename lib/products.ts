import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockProducts } from "@/lib/mock-data";
import type { Product, ProductCategory } from "@/types/database";

export async function getProducts(category?: ProductCategory | "All"): Promise<Product[]> {
  let products: Product[] = [];

  if (!isSupabaseConfigured) {
    products = mockProducts;
  } else {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (error || !data) {
        console.error("Failed to fetch products from Supabase:", error);
        products = mockProducts;
      } else {
        products = data as Product[];
      }
    } catch (err) {
      console.error("Exception fetching products:", err);
      products = mockProducts;
    }
  }

  if (category && category !== "All") {
    return products.filter((p) => p.category === category);
  }

  return products;
}

export const CATEGORY_DETAILS = {
  All: {
    slug: "shop",
    name: "Shop All",
    title: "All Jewellery",
    subtitle: "Timeless Minimalist Essentials",
    description:
      "Explore our full collection of hypoallergenic, handcrafted 925 sterling silver jewelry. Thoughtfully designed for modern individuality and everyday elegance.",
  },
  Rings: {
    slug: "rings",
    name: "Rings",
    title: "Rings Collection",
    subtitle: "Bands, Signets & Gemstones",
    description:
      "From hammered minimalist bands to captivating blue moonstone centerpieces, explore rings crafted for comfort and enduring shine.",
  },
  Necklaces: {
    slug: "necklaces",
    name: "Necklaces",
    title: "Necklaces Collection",
    subtitle: "Chains & Keepsake Lockets",
    description:
      "Delicate sterling silver chains, floral engraved lockets, and timeless pendants designed to sit gracefully on your collarbone.",
  },
  Bracelets: {
    slug: "bracelets",
    name: "Bracelets",
    title: "Bracelets Collection",
    subtitle: "Chains & Talisman Beads",
    description:
      "Dainty four-leaf clover station chains and cultural evil eye beaded bracelets designed for effortless stacking or a standalone statement.",
  },
} as const;
