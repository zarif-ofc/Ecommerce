import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base atomic Skeleton component with luxury shimmer effect
 */
export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer rounded-md ${className}`}
      {...props}
    />
  );
}

/**
 * Product Card Skeleton — matches ProductCard.tsx
 */
export function ProductCardSkeleton() {
  return (
    <div className="product-card block">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl skeleton-shimmer">
        {/* Quick add placeholder */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/70" />
      </div>

      {/* Info */}
      <div className="mt-2.5 sm:mt-3.5 px-0.5 space-y-2">
        <div className="h-3.5 sm:h-4 w-3/4 rounded-md skeleton-shimmer" />
        <div className="h-3 sm:h-3.5 w-1/3 rounded-md skeleton-shimmer" />
      </div>
    </div>
  );
}

/**
 * Product Grid Skeleton
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Hero Banner Skeleton — matches HomeContent.tsx hero
 */
export function HeroSkeleton() {
  return (
    <div className="relative h-[500px] xs:h-[540px] sm:h-[580px] lg:h-[640px] skeleton-shimmer overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/70 to-white/25 sm:bg-gradient-to-r sm:from-white/90 sm:via-white/60 sm:to-transparent" />
      <div className="absolute inset-0 flex items-end pb-8 sm:items-center sm:pb-0 z-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg space-y-4">
            <div className="h-10 sm:h-14 w-3/4 rounded-xl skeleton-shimmer" />
            <div className="h-4 sm:h-5 w-full rounded-md skeleton-shimmer" />
            <div className="h-4 sm:h-5 w-2/3 rounded-md skeleton-shimmer" />
            <div className="pt-2 flex gap-3">
              <div className="h-12 w-36 rounded-full skeleton-shimmer" />
              <div className="h-12 w-32 rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Category View Skeleton — matches CategoryView.tsx (/shop, /rings, /necklaces, /bracelets)
 */
export function CategoryViewSkeleton() {
  return (
    <div className="pt-16 lg:pt-[72px] min-h-screen bg-white">
      {/* Top Banner */}
      <div className="border-b border-border/70 bg-alabaster/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Breadcrumbs */}
          <div className="mb-4 sm:mb-6 flex items-center gap-2">
            <div className="h-3.5 w-12 rounded skeleton-shimmer" />
            <span className="text-slate-muted/40">/</span>
            <div className="h-3.5 w-16 rounded skeleton-shimmer" />
            <span className="text-slate-muted/40">/</span>
            <div className="h-3.5 w-20 rounded skeleton-shimmer" />
          </div>

          {/* Title & Description */}
          <div className="max-w-2xl space-y-3">
            <div className="h-3 w-28 rounded skeleton-shimmer" />
            <div className="h-8 sm:h-10 lg:h-12 w-64 rounded-lg skeleton-shimmer" />
            <div className="h-4 w-full max-w-md rounded skeleton-shimmer" />
            <div className="h-4 w-3/4 max-w-sm rounded skeleton-shimmer" />
          </div>

          {/* Category Tabs Pill Switcher */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 sm:w-28 flex-shrink-0 rounded-full skeleton-shimmer"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-6 sm:pb-10">
        {/* Count and Filters bar */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50">
          <div className="h-4 w-36 rounded skeleton-shimmer" />
          <div className="h-4 w-28 rounded skeleton-shimmer" />
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 sm:mt-10">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}

/**
 * Product Detail Skeleton — matches ProductDetail.tsx (/product/[slug])
 */
export function ProductDetailSkeleton() {
  return (
    <div className="pt-16 lg:pt-[72px] min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2">
          <div className="h-3.5 w-12 rounded skeleton-shimmer" />
          <span className="text-slate-muted/40">/</span>
          <div className="h-3.5 w-16 rounded skeleton-shimmer" />
          <span className="text-slate-muted/40">/</span>
          <div className="h-3.5 w-32 rounded skeleton-shimmer" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery Skeleton */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="aspect-square w-full rounded-2xl skeleton-shimmer" />
            {/* Thumbnails */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl skeleton-shimmer"
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6 lg:py-4">
            {/* Category */}
            <div className="h-3 w-20 rounded skeleton-shimmer" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 sm:h-10 w-3/4 rounded-lg skeleton-shimmer" />
              <div className="h-8 sm:h-10 w-1/2 rounded-lg skeleton-shimmer" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <div className="h-7 w-28 rounded-md skeleton-shimmer" />
              <div className="h-5 w-20 rounded-md skeleton-shimmer" />
            </div>

            {/* Trust badge */}
            <div className="h-11 w-full rounded-xl skeleton-shimmer" />

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-20 rounded skeleton-shimmer" />
                <div className="h-4 w-24 rounded skeleton-shimmer" />
              </div>
              <div className="flex gap-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-14 rounded-xl skeleton-shimmer"
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-5">
              <div className="h-4 w-16 rounded skeleton-shimmer" />
              <div className="h-12 w-36 rounded-xl skeleton-shimmer" />
            </div>

            {/* Add to Bag */}
            <div className="h-14 w-full rounded-full skeleton-shimmer" />

            {/* Accordion list */}
            <div className="space-y-4 pt-4 border-t border-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full rounded-lg skeleton-shimmer"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Checkout Skeleton — matches /checkout
 */
export function CheckoutSkeleton() {
  return (
    <div className="pt-16 lg:pt-[72px] min-h-screen bg-alabaster/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-24 rounded skeleton-shimmer" />
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Form Left Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 space-y-6">
              <div className="h-6 w-48 rounded-md skeleton-shimmer" />
              <div className="space-y-4">
                <div className="h-12 w-full rounded-xl skeleton-shimmer" />
                <div className="h-12 w-full rounded-xl skeleton-shimmer" />
                <div className="h-20 w-full rounded-xl skeleton-shimmer" />
              </div>
              <div className="h-5 w-36 rounded-md skeleton-shimmer" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 rounded-xl skeleton-shimmer" />
                <div className="h-16 rounded-xl skeleton-shimmer" />
              </div>
            </div>
          </div>

          {/* Summary Right Side */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 space-y-6">
              <div className="h-6 w-36 rounded-md skeleton-shimmer" />
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-16 w-16 rounded-xl skeleton-shimmer flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                      <div className="h-4 w-1/3 rounded skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <div className="h-4 w-16 rounded skeleton-shimmer" />
                  <div className="h-4 w-20 rounded skeleton-shimmer" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded skeleton-shimmer" />
                  <div className="h-4 w-16 rounded skeleton-shimmer" />
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <div className="h-5 w-24 rounded skeleton-shimmer" />
                  <div className="h-5 w-24 rounded skeleton-shimmer" />
                </div>
              </div>
              <div className="h-14 w-full rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Order Confirmation Skeleton — matches /order-confirmation/[id]
 */
export function OrderConfirmationSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center px-3.5 sm:px-6 pt-16 pb-20 lg:pt-[72px] bg-white">
      <div className="w-full max-w-lg text-center space-y-4">
        {/* Icon */}
        <div className="mx-auto h-20 w-20 rounded-full skeleton-shimmer" />
        {/* Heading */}
        <div className="h-8 sm:h-10 w-48 mx-auto rounded-lg skeleton-shimmer" />
        <div className="h-4 w-72 mx-auto rounded skeleton-shimmer" />
        {/* Order Card */}
        <div className="mt-8 rounded-2xl border border-border bg-alabaster p-6 text-left space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-24 rounded skeleton-shimmer" />
            <div className="h-4 w-20 rounded skeleton-shimmer" />
          </div>
          <div className="h-16 w-full rounded-xl skeleton-shimmer" />
          <div className="h-14 w-full rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
