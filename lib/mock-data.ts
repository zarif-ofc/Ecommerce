import type { Product } from "@/types/database";

export const mockProducts: Product[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Blue Moonstone Ring",
    slug: "blue-moonstone-ring",
    description:
      "A captivating oval-cut blue moonstone set in a delicately hammered sterling silver band. The stone displays an ethereal blue adularescence that shifts with light — a timeless statement of understated elegance. Each moonstone is hand-selected for its clarity and luminous glow.",
    price: 580,
    original_price: 1160,
    category: "Rings",
    images: ["/images/blue-moonstone-ring.jpg"],
    material_specs:
      "Sterling Silver 925 band with natural Blue Moonstone cabochon. Rhodium-plated finish for lasting shine. Stone dimensions: 8×6mm oval.",
    care_instructions:
      "Avoid contact with perfumes, lotions, and harsh chemicals. Store separately in a soft pouch. Clean gently with a microfiber cloth. Remove before swimming or bathing.",
    sizes: ["7", "8", "9", "Adjustable"],
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    title: "Adant Silver Locket",
    slug: "adant-silver-locket",
    description:
      "A heart-shaped sterling silver locket with intricate engraved floral motifs and a sapphire-blue centre stone. This classic keepsake opens to hold a cherished photograph — blending vintage romanticism with modern craftsmanship.",
    price: 420,
    original_price: null,
    category: "Necklaces",
    images: ["/images/adant-silver-locket.jpg"],
    material_specs:
      "925 Sterling Silver locket pendant on an 18-inch cable chain. Spring-ring clasp. Interior photo compartment fits two 12mm photos. Blue cubic zirconia accent.",
    care_instructions:
      "Wipe with a silver polishing cloth periodically. Store in an airtight bag to prevent tarnishing. Avoid exposing to water or humidity.",
    sizes: [],
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    title: "Roman Numeral Band Ring",
    slug: "roman-numeral-band-ring",
    description:
      "A sleek, minimalist band ring engraved with Roman numerals around the circumference. Crafted from polished stainless steel with a satin finish interior for all-day comfort. A modern classic that pairs effortlessly with any ensemble.",
    price: 490,
    original_price: null,
    category: "Rings",
    images: ["/images/roman-numeral-band-ring.jpg"],
    material_specs:
      "316L Stainless Steel with mirror-polish exterior and brushed interior. Width: 4mm. Hypoallergenic and tarnish-resistant. Weight: approximately 3.2g.",
    care_instructions:
      "Clean with warm soapy water and a soft brush. Dry immediately with a lint-free cloth. Stainless steel is highly durable but avoid abrasive materials.",
    sizes: ["8", "9", "10"],
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    title: "Clover Station Bracelet",
    slug: "clover-station-bracelet",
    description:
      "A dainty chain bracelet adorned with evenly-spaced four-leaf clover charms in polished sterling silver. Symbolic of luck and prosperity, this piece adds a refined touch to both casual and formal looks.",
    price: 520,
    original_price: null,
    category: "Bracelets",
    images: ["/images/clover-station-bracelet.jpg"],
    material_specs:
      "925 Sterling Silver cable chain with 6 four-leaf clover stations. Lobster claw clasp with 2-inch extension chain. Total length: 6.5–8.5 inches. Rhodium-plated.",
    care_instructions:
      "Store flat in a jewelry box to prevent tangling. Avoid pulling or stretching the chain. Remove before exercising. Polish with a silver cloth monthly.",
    sizes: [],
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    title: "Silver Figaro Ring",
    slug: "silver-figaro-ring",
    description:
      "Inspired by the iconic Figaro chain pattern, this open-link ring brings an edgy, contemporary vibe to classic silver jewelry. The alternating link pattern creates visual rhythm and texture that catches light beautifully.",
    price: 380,
    original_price: null,
    category: "Rings",
    images: ["/images/silver-figaro-ring.jpg"],
    material_specs:
      "925 Sterling Silver with Figaro chain-link design. Width: 5mm. Comfort-fit inner band. Rhodium-plated for tarnish resistance. Weight: approximately 4.1g.",
    care_instructions:
      "Use a soft toothbrush to clean between links. Avoid chemical cleaners. Store in a dry environment. Re-polish with a silver cloth if dulled.",
    sizes: ["7", "8", "9"],
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "f6a7b8c9-d0e1-2345-fabc-456789012345",
    title: "Evil Eye Beaded Bracelet",
    slug: "evil-eye-beaded-bracelet",
    description:
      "A protective talisman bracelet featuring a central evil eye charm surrounded by deep cobalt blue and crisp white glass beads, accented with silver-tone spacers. A culturally rich accessory that blends spiritual symbolism with contemporary design.",
    price: 350,
    original_price: null,
    category: "Bracelets",
    images: ["/images/evil-eye-beaded-bracelet.jpg"],
    material_specs:
      "Glass beads with zinc alloy evil eye charm. Silver-plated spacer beads. Elastic stretch band — one size fits most (16–19cm wrist). Charm diameter: 15mm.",
    care_instructions:
      "Avoid submerging in water. Do not stretch excessively when wearing. Store in a soft fabric pouch. Wipe beads with a damp cloth if needed.",
    sizes: [],
    in_stock: true,
    created_at: new Date().toISOString(),
  },
];
