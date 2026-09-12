"use client";

import Link from "next/link";
import { ChevronLeft, Sparkles, ShieldCheck, Truck } from "lucide-react";
import type { Product, ProductCategory } from "@/types/database";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORY_DETAILS } from "@/lib/products";

interface CategoryViewProps {
  currentCategory: ProductCategory | "All";
  products: Product[];
}

const CATEGORY_TABS = [
  { key: "All", name: "Shop All", href: "/shop" },
  { key: "Rings", name: "Rings", href: "/rings" },
  { key: "Necklaces", name: "Necklaces", href: "/necklaces" },
  { key: "Bracelets", name: "Bracelets", href: "/bracelets" },
] as const;

export function CategoryView({ currentCategory, products }: CategoryViewProps) {
  const details = CATEGORY_DETAILS[currentCategory];

  return (
    <div className="pt-16 lg:pt-[72px] min-h-screen bg-white">
      {/* Top Banner / Collection Header */}
      <div className="border-b border-border/70 bg-alabaster/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-muted">
              <li>
                <Link
                  href="/"
                  className="hover:text-midnight transition-colors inline-flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Home
                </Link>
              </li>
              <li className="text-slate-muted/50">/</li>
              <li>
                <Link href="/shop" className="hover:text-midnight transition-colors">
                  Collection
                </Link>
              </li>
              {currentCategory !== "All" && (
                <>
                  <li className="text-slate-muted/50">/</li>
                  <li className="text-midnight font-medium">{details.name}</li>
                </>
              )}
            </ol>
          </nav>

          {/* Title & Description */}
          <div className="max-w-2xl">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              {details.subtitle}
            </span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-midnight">
              {details.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-muted">
              {details.description}
            </p>
          </div>

          {/* Category Tabs Pill Switcher */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const isActive = currentCategory === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`flex-shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-midnight text-white shadow-sm ring-2 ring-midnight/10 scale-100"
                      : "bg-white border border-border text-slate-muted hover:bg-bone hover:text-midnight active:bg-sand"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-6 sm:pb-10">
        {/* Count and Filters bar */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50 text-xs sm:text-sm text-slate-muted">
          <span>
            Showing <strong className="text-midnight font-semibold">{products.length}</strong>{" "}
            {products.length === 1 ? "piece" : "pieces"}
          </span>
          <span className="text-champagne font-medium">925 Sterling Silver</span>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-base text-slate-muted">No pieces found in this category currently.</p>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-midnight px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-midnight/90"
            >
              View All Pieces
            </Link>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-16 sm:mt-24 rounded-2xl border border-border/80 bg-alabaster p-6 sm:p-10">
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-champagne/10 p-2.5 text-champagne-dark">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-midnight">925 Sterling Silver</h4>
                <p className="mt-1 text-xs text-slate-muted">
                  Hypoallergenic, nickel-free, and crafted for lasting daily wear.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-champagne/10 p-2.5 text-champagne-dark">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-midnight">Nationwide Delivery</h4>
                <p className="mt-1 text-xs text-slate-muted">
                  Cash on delivery across all 64 districts in Bangladesh.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-champagne/10 p-2.5 text-champagne-dark">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-midnight">Signature Gift Packaging</h4>
                <p className="mt-1 text-xs text-slate-muted">
                  Every order arrives in our branded keepsake jewelry box.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
