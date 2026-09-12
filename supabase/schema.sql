-- =============================================================
-- Cresol E-Commerce Database Schema
-- Run this SQL in your Supabase SQL Editor
-- =============================================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----- PRODUCTS TABLE -----
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL CHECK (category IN ('Rings', 'Necklaces', 'Bracelets')),
  images TEXT[] NOT NULL DEFAULT '{}',
  material_specs TEXT NOT NULL DEFAULT '',
  care_instructions TEXT NOT NULL DEFAULT '',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----- ORDERS TABLE -----
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('Inside Dhaka', 'Outside Dhaka')),
  delivery_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----- ROW LEVEL SECURITY -----

-- Enable RLS on both tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous public read access to products
CREATE POLICY "Public can view products"
  ON products
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous public insert access to orders (for checkout)
CREATE POLICY "Public can create orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous read access on orders (to view confirmation by ID)
CREATE POLICY "Public can view own orders"
  ON orders
  FOR SELECT
  TO anon
  USING (true);

-- ----- SEED DATA -----

INSERT INTO products (title, slug, description, price, original_price, category, images, material_specs, care_instructions, sizes, in_stock)
VALUES
  (
    'Blue Moonstone Ring',
    'blue-moonstone-ring',
    'A captivating oval-cut blue moonstone set in a delicately hammered sterling silver band. The stone displays an ethereal blue adularescence that shifts with light — a timeless statement of understated elegance. Each moonstone is hand-selected for its clarity and luminous glow.',
    580,
    1160,
    'Rings',
    ARRAY['/images/blue-moonstone-ring.jpg'],
    'Sterling Silver 925 band with natural Blue Moonstone cabochon. Rhodium-plated finish for lasting shine. Stone dimensions: 8×6mm oval.',
    'Avoid contact with perfumes, lotions, and harsh chemicals. Store separately in a soft pouch. Clean gently with a microfiber cloth. Remove before swimming or bathing.',
    ARRAY['7', '8', '9', 'Adjustable'],
    true
  ),
  (
    'Adant Silver Locket',
    'adant-silver-locket',
    'A heart-shaped sterling silver locket with intricate engraved floral motifs and a sapphire-blue centre stone. This classic keepsake opens to hold a cherished photograph — blending vintage romanticism with modern craftsmanship.',
    420,
    NULL,
    'Necklaces',
    ARRAY['/images/adant-silver-locket.jpg'],
    '925 Sterling Silver locket pendant on an 18-inch cable chain. Spring-ring clasp. Interior photo compartment fits two 12mm photos. Blue cubic zirconia accent.',
    'Wipe with a silver polishing cloth periodically. Store in an airtight bag to prevent tarnishing. Avoid exposing to water or humidity.',
    ARRAY[]::TEXT[],
    true
  ),
  (
    'Roman Numeral Band Ring',
    'roman-numeral-band-ring',
    'A sleek, minimalist band ring engraved with Roman numerals around the circumference. Crafted from polished stainless steel with a satin finish interior for all-day comfort. A modern classic that pairs effortlessly with any ensemble.',
    490,
    NULL,
    'Rings',
    ARRAY['/images/roman-numeral-band-ring.jpg'],
    '316L Stainless Steel with mirror-polish exterior and brushed interior. Width: 4mm. Hypoallergenic and tarnish-resistant. Weight: approximately 3.2g.',
    'Clean with warm soapy water and a soft brush. Dry immediately with a lint-free cloth. Stainless steel is highly durable but avoid abrasive materials.',
    ARRAY['8', '9', '10'],
    true
  ),
  (
    'Clover Station Bracelet',
    'clover-station-bracelet',
    'A dainty chain bracelet adorned with evenly-spaced four-leaf clover charms in polished sterling silver. Symbolic of luck and prosperity, this piece adds a refined touch to both casual and formal looks.',
    520,
    NULL,
    'Bracelets',
    ARRAY['/images/clover-station-bracelet.jpg'],
    '925 Sterling Silver cable chain with 6 four-leaf clover stations. Lobster claw clasp with 2-inch extension chain. Total length: 6.5–8.5 inches. Rhodium-plated.',
    'Store flat in a jewelry box to prevent tangling. Avoid pulling or stretching the chain. Remove before exercising. Polish with a silver cloth monthly.',
    ARRAY[]::TEXT[],
    true
  ),
  (
    'Silver Figaro Ring',
    'silver-figaro-ring',
    'Inspired by the iconic Figaro chain pattern, this open-link ring brings an edgy, contemporary vibe to classic silver jewelry. The alternating link pattern creates visual rhythm and texture that catches light beautifully.',
    380,
    NULL,
    'Rings',
    ARRAY['/images/silver-figaro-ring.jpg'],
    '925 Sterling Silver with Figaro chain-link design. Width: 5mm. Comfort-fit inner band. Rhodium-plated for tarnish resistance. Weight: approximately 4.1g.',
    'Use a soft toothbrush to clean between links. Avoid chemical cleaners. Store in a dry environment. Re-polish with a silver cloth if dulled.',
    ARRAY['7', '8', '9'],
    true
  ),
  (
    'Evil Eye Beaded Bracelet',
    'evil-eye-beaded-bracelet',
    'A protective talisman bracelet featuring a central evil eye charm surrounded by deep cobalt blue and crisp white glass beads, accented with silver-tone spacers. A culturally rich accessory that blends spiritual symbolism with contemporary design.',
    350,
    NULL,
    'Bracelets',
    ARRAY['/images/evil-eye-beaded-bracelet.jpg'],
    'Glass beads with zinc alloy evil eye charm. Silver-plated spacer beads. Elastic stretch band — one size fits most (16–19cm wrist). Charm diameter: 15mm.',
    'Avoid submerging in water. Do not stretch excessively when wearing. Store in a soft fabric pouch. Wipe beads with a damp cloth if needed.',
    ARRAY[]::TEXT[],
    true
  );
