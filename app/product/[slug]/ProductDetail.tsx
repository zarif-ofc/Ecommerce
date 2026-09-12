"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ShoppingBag,
  Minus,
  Plus,
  Sparkles,
  Droplets,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/database";
import { useCartStore } from "@/lib/store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.length > 0 ? product.sizes[0] : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    "materials"
  );

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const discount = calculateDiscount(product.price, product.original_price);

  // Mobile Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Minimum swipe threshold: 50px
    if (diff > 50 && activeImage < product.images.length - 1) {
      setActiveImage((prev) => prev + 1);
    } else if (diff < -50 && activeImage > 0) {
      setActiveImage((prev) => prev - 1);
    }
    setTouchStart(null);
  };

  const handleAddToBag = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      product_id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price,
      image: product.images[0],
      size: selectedSize,
      quantity,
      category: product.category,
    });

    toast.success(`${product.title} added to bag`, {
      description: selectedSize ? `Size ${selectedSize} × ${quantity}` : `× ${quantity}`,
      action: {
        label: "View Bag",
        onClick: () => openCart(),
      },
    });
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const accordionItems = [
    {
      key: "materials",
      title: "Materials & Craftsmanship",
      icon: Sparkles,
      content: product.material_specs,
    },
    {
      key: "care",
      title: "Care Guide",
      icon: Droplets,
      content: product.care_instructions,
    },
    {
      key: "shipping",
      title: "Shipping & Delivery",
      icon: Truck,
      content:
        "We deliver nationwide across Bangladesh. Inside Dhaka: ৳70 (2-3 business days). Outside Dhaka: ৳130 (3-5 business days). All orders are carefully packaged in our signature gift box.",
    },
  ];

  return (
    <div className="pt-16 lg:pt-[72px]">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-muted transition-colors hover:text-midnight py-1.5 touch-press"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Collection
        </Link>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-14">
          {/* ======== IMAGE GALLERY ======== */}
          <div className="space-y-3 animate-fade-in">
            {/* Main Image with Touch Swipe */}
            <div 
              className="relative aspect-square overflow-hidden rounded-2xl bg-bone touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={product.images[activeImage]}
                alt={product.title}
                fill
                className="object-cover transition-all duration-300 select-none"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discount && (
                <div className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full bg-champagne px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide text-white shadow-sm">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Mobile gallery dots */}
            {product.images.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 sm:hidden py-1">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`gallery-dot rounded-full transition-all duration-300 ${
                      activeImage === i
                        ? "h-2 w-6 bg-champagne"
                        : "h-2 w-2 bg-border"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === i
                        ? "border-champagne ring-2 ring-champagne/20"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ======== PRODUCT INFO ======== */}
          <div className="animate-slide-up lg:py-4">
            {/* Category */}
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="mt-2 font-serif text-3xl font-semibold text-midnight lg:text-4xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-midnight">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg text-slate-muted line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="rounded-full bg-champagne/15 px-3 py-0.5 text-xs font-semibold text-champagne-dark">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-slate-muted">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mt-6 sm:mt-7">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-midnight">
                    Select Size
                  </label>
                  <span className="text-xs text-champagne-dark font-medium cursor-pointer">
                    Ring Size Guide
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      id={`size-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-12 min-w-[52px] items-center justify-center rounded-xl border px-4 text-sm font-medium transition-all touch-press ${
                        selectedSize === size
                          ? "border-champagne bg-champagne/10 text-champagne-dark font-semibold shadow-xs ring-1 ring-champagne/20"
                          : "border-border text-midnight hover:border-champagne/50 active:bg-bone"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label className="text-xs sm:text-sm font-semibold text-midnight">
                Quantity
              </label>
              <div className="mt-3 inline-flex items-center rounded-xl border border-border bg-white shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-12 w-12 items-center justify-center text-slate-muted transition-colors hover:text-midnight active:bg-bone rounded-l-xl"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-12 items-center justify-center border-x border-border text-sm font-semibold text-midnight">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-12 w-12 items-center justify-center text-slate-muted transition-colors hover:text-midnight active:bg-bone rounded-r-xl"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Bag — Desktop */}
            <div className="mt-8 hidden lg:block">
              <button
                id="add-to-bag-desktop"
                onClick={handleAddToBag}
                className="btn-luxury flex w-full items-center justify-center gap-2.5 rounded-full bg-midnight py-4 text-sm font-semibold tracking-wide text-white transition-all hover:bg-midnight/90 shadow-lg shadow-midnight/10 active:scale-[0.99]"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                Add to Bag — {formatPrice(product.price * quantity)}
              </button>
            </div>

            {/* Accordion */}
            <div className="mt-8 divide-y divide-border border-t border-border">
              {accordionItems.map(({ key, title, icon: Icon, content }) => (
                <div key={key}>
                  <button
                    id={`accordion-${key}`}
                    onClick={() => toggleAccordion(key)}
                    className="flex w-full items-center justify-between py-4 text-left touch-press"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className="h-4 w-4 text-champagne"
                        strokeWidth={1.5}
                      />
                      <span className="text-sm font-semibold text-midnight">
                        {title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-muted transition-transform duration-300 ${
                        openAccordion === key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className="accordion-content"
                    data-open={openAccordion === key}
                  >
                    <div>
                      <p className="pb-4 text-xs sm:text-sm leading-relaxed text-slate-muted">
                        {content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======== RELATED PRODUCTS ======== */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16 border-t border-border pt-8 sm:pt-12 lg:mt-20 lg:pt-16">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-midnight lg:text-3xl">
              You May Also Like
            </h2>
            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ======== MOBILE STICKY ADD TO BAG DUAL BAR ======== */}
      <aside
        aria-label="Mobile sticky purchase bar"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {/* Price & Size Info */}
          <div className="flex flex-col min-w-0 flex-shrink-0">
            <span className="text-xs text-slate-muted font-medium">
              {selectedSize ? `Size: ${selectedSize}` : "Price"}
            </span>
            <span className="text-lg font-bold text-midnight tracking-tight leading-tight">
              {formatPrice(product.price * quantity)}
            </span>
          </div>

          {/* Action Button */}
          <button
            id="add-to-bag-mobile"
            onClick={handleAddToBag}
            className="btn-luxury flex-1 flex items-center justify-center gap-2 rounded-full bg-midnight py-3.5 px-6 text-sm font-semibold tracking-wide text-white shadow-md active:scale-98 transition-transform"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            Add to Bag
          </button>
        </div>
      </aside>

      {/* Spacer for mobile sticky bar */}
      <div className="h-[calc(86px+env(safe-area-inset-bottom,0px))] lg:hidden" />
    </div>
  );
}
