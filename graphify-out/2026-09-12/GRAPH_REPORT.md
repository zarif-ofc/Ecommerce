# Graph Report - Cresol  (2026-09-12)

## Corpus Check
- 33 files · ~165,916 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 149 nodes · 252 edges · 16 communities (9 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- checkout/page.tsx
- compilerOptions
- package.json
- [slug]/page.tsx
- database.ts
- README.md
- layout.tsx
- devDependencies
- dependencies
- eslint.config.mjs
- postcss.config.mjs
- This is NOT the Next.js you know
- rules/graphify.md
- workflows/graphify.md
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `useCartStore` - 13 edges
3. `formatPrice()` - 11 edges
4. `lucide-react` - 11 edges
5. `Product` - 10 edges
6. `react` - 8 edges
7. `ProductCard()` - 6 edges
8. `sonner` - 6 edges
9. `ProductDetail()` - 5 edges
10. `isSupabaseConfigured` - 5 edges

## Surprising Connections (you probably didn't know these)
- `HomeContentProps` --references--> `Product`  [EXTRACTED]
  app/HomeContent.tsx → types/database.ts
- `OrderConfirmationPage()` --calls--> `formatPrice()`  [EXTRACTED]
  app/order-confirmation/[id]/page.tsx → lib/utils.ts
- `ProductDetailProps` --references--> `Product`  [EXTRACTED]
  app/product/[slug]/ProductDetail.tsx → types/database.ts
- `ProductCardProps` --references--> `Product`  [EXTRACTED]
  components/ui/ProductCard.tsx → types/database.ts
- `CheckoutPage()` --calls--> `useCartStore`  [EXTRACTED]
  app/checkout/page.tsx → lib/store.ts

## Import Cycles
- None detected.

## Communities (16 total, 6 thin omitted)

### Community 0 - "checkout/page.tsx"
Cohesion: 0.21
Nodes (16): CheckoutPage(), DeliveryZone, FormData, ProductDetail(), CartDrawer(), Header(), ProductCard(), WhatsAppFloatingButton() (+8 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (18): name, private, scripts, build, dev, lint, start, version (+10 more)

### Community 3 - "[slug]/page.tsx"
Cohesion: 0.18
Nodes (14): ConfirmationPageProps, getOrder(), OrderConfirmationPage(), generateMetadata(), getProduct(), getRelatedProducts(), ProductPage(), ProductPageProps (+6 more)

### Community 4 - "database.ts"
Cohesion: 0.17
Nodes (14): HomeContent(), HomeContentProps, getProducts(), HomePage(), ProductDetailProps, categories, CategoryFilter(), CategoryFilterProps (+6 more)

### Community 5 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 6 - "layout.tsx"
Cohesion: 0.17
Nodes (7): cormorant, inter, metadata, viewport, Footer(), nextConfig, next

### Community 7 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 8 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, lucide-react, next, react, react-dom, sonner, @supabase/supabase-js, zustand

## Knowledge Gaps
- **68 isolated node(s):** `DeliveryZone`, `FormData`, `cormorant`, `inter`, `viewport` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 80 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `checkout/page.tsx` to `package.json`, `[slug]/page.tsx`, `database.ts`, `layout.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `DeliveryZone`, `FormData`, `cormorant` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._