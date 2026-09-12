"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/database";
import { formatPrice, calculateDiscount } from "@/lib/utils";

import { Plus, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const discount = calculateDiscount(product.price, product.original_price);
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      product_id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price,
      image: product.images[0],
      size: product.sizes[0] || "",
      quantity: 1,
      category: product.category,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      id={`product-card-${product.slug}`}
      className="product-card group block touch-press"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-bone">
        {/* Shimmer skeleton placeholder */}
        <div
          className={`absolute inset-0 skeleton-shimmer transition-opacity duration-500 z-0 ${
            imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className={`product-card-image object-cover transition-opacity duration-500 z-0 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 4}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 rounded-full bg-champagne px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold tracking-wide text-white shadow-sm">
            {discount}% OFF
          </div>
        )}

        {/* Quick Add Button for Mobile & Desktop */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-10 active:scale-95 ${
            isAdded
              ? "bg-midnight text-white px-2.5 py-1.5 h-8 sm:h-9 gap-1.5 ring-1 ring-white/20"
              : "bg-white/95 text-midnight hover:bg-midnight hover:text-white h-8 w-8 sm:h-9 sm:w-9"
          }`}
          aria-label={isAdded ? `${product.title} added to bag` : `Quick add ${product.title} to bag`}
        >
          {isAdded ? (
            <>
              <Check className="h-3.5 w-3.5 text-champagne shrink-0" strokeWidth={2.5} />
              <span className="text-[11px] font-medium tracking-tight pr-0.5 whitespace-nowrap">
                Added
              </span>
            </>
          ) : (
            <Plus className="h-4 w-4" strokeWidth={2} />
          )}
        </button>

        {/* Quick View Overlay (Desktop hover) */}
        <div className="absolute inset-0 hidden sm:flex items-end justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-wide text-midnight shadow-lg backdrop-blur-sm">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2.5 sm:mt-3.5 px-0.5">
        <h3 className="text-xs sm:text-sm font-medium text-midnight transition-colors group-hover:text-champagne line-clamp-1">
          {product.title}
        </h3>
        <div className="mt-0.5 sm:mt-1 flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm font-semibold text-midnight">
            {formatPrice(product.price)}
          </span>
          {product.original_price && (
            <span className="text-[11px] sm:text-xs text-slate-muted line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
