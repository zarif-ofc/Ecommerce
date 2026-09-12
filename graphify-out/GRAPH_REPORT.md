# Graph Report - Cresol  (2026-09-12)

## Corpus Check
- 69 files · ~176,587 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 337 nodes · 475 edges · 31 communities (13 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `359f66c0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/layout.tsx
- compilerOptions
- package.json
- orders/page.tsx
- types/database.ts
- README.md
- next.config.ts
- devDependencies
- admin/package.json
- eslint.config.mjs
- postcss.config.mjs
- This is NOT the Next.js you know
- rules/graphify.md
- workflows/graphify.md
- GEMINI.md
- MultiImageUpload
- compilerOptions
- (dashboard)/layout.tsx
- CarouselsPage
- admin/app/layout.tsx
- admin/README.md
- LoginPage
- proxy.ts
- admin/AGENTS.md
- admin/eslint.config.mjs
- admin/next.config.ts
- admin/postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `compilerOptions` - 16 edges
3. `useCartStore` - 13 edges
4. `formatPrice()` - 11 edges
5. `Product` - 10 edges
6. `MultiImageUpload()` - 9 edges
7. `CarouselsPage()` - 8 edges
8. `supabase` - 8 edges
9. `ProductForm()` - 7 edges
10. `PageHeader()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `OrderConfirmationPage()` --calls--> `formatPrice()`  [EXTRACTED]
  app/order-confirmation/[id]/page.tsx → lib/utils.ts
- `ProductDetailProps` --references--> `Product`  [EXTRACTED]
  app/product/[slug]/ProductDetail.tsx → types/database.ts
- `ProductCardProps` --references--> `Product`  [EXTRACTED]
  components/ui/ProductCard.tsx → types/database.ts
- `HomeContentProps` --references--> `Carousel`  [EXTRACTED]
  app/HomeContent.tsx → types/database.ts
- `HomeContentProps` --references--> `Product`  [EXTRACTED]
  app/HomeContent.tsx → types/database.ts

## Import Cycles
- None detected.

## Communities (31 total, 14 thin omitted)

### Community 0 - "app/layout.tsx"
Cohesion: 0.15
Nodes (16): CheckoutPage(), cormorant, inter, metadata, viewport, ProductDetail(), CartDrawer(), Footer() (+8 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "package.json"
Cohesion: 0.06
Nodes (31): dependencies, lucide-react, next, react, react-dom, sonner, @supabase/supabase-js, zustand (+23 more)

### Community 3 - "orders/page.tsx"
Cohesion: 0.07
Nodes (32): allStatuses, OrdersPage(), statusVariant, dynamic, statusVariant, EditProductPageProps, ProductsPage(), ProductForm() (+24 more)

### Community 4 - "types/database.ts"
Cohesion: 0.09
Nodes (32): DeliveryZone, FormData, defaultSlide, HomeContent(), HomeContentProps, ConfirmationPageProps, getOrder(), OrderConfirmationPage() (+24 more)

### Community 5 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 7 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 8 - "admin/package.json"
Cohesion: 0.05
Nodes (38): dependencies, lucide-react, next, react, react-dom, sonner, @supabase/supabase-js, devDependencies (+30 more)

### Community 16 - "MultiImageUpload"
Cohesion: 0.12
Nodes (15): MultiImageUpload(), handleDrop(), handleFileChange(), handleFiles(), MultiImageUploadProps, SingleImageUpload(), handleDrop(), handleFileChange() (+7 more)

### Community 17 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 18 - "(dashboard)/layout.tsx"
Cohesion: 0.19
Nodes (6): DashboardLayout(), AdminShell(), navItems, Sidebar(), SidebarProps, isAuthenticated()

### Community 19 - "CarouselsPage"
Cohesion: 0.32
Nodes (4): CarouselsPage(), fetchSlides(), handleSave(), moveSlide()

### Community 21 - "admin/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **156 isolated node(s):** `allStatuses`, `statusVariant`, `statusVariant`, `dynamic`, `EditProductPageProps` (+151 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 205 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `zustand` connect `package.json` to `app/layout.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `allStatuses`, `statusVariant`, `statusVariant` to the rest of the system?**
  _156 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1477832512315271 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `orders/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0726764500349406 - nodes in this community are weakly interconnected._