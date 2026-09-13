"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product, ProductCategory, Carousel } from "@/types/database";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";

interface HomeContentProps {
  products: Product[];
  carousels?: Carousel[];
}

const defaultSlide: Carousel = {
  id: "default-slide",
  title: "Timeless Modern Jewellery",
  subtitle:
    "Minimalist silver pieces crafted for everyday elegance. Hypoallergenic, enduring, and designed to tell your story.",
  image_url: "/images/hero-banner.jpg",
  mobile_image_url: "",
  link_url: "/shop",
  sort_order: 0,
  is_active: true,
  created_at: new Date().toISOString(),
};

export function HomeContent({ products, carousels }: HomeContentProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("All");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const slides = carousels && carousels.length > 0 ? carousels : [defaultSlide];
  const currentSlide = slides[currentSlideIndex] || slides[0] || defaultSlide;

  // Auto-advance slides every 6 seconds unless user is hovering/interacting
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      // Swiped left -> next slide
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    } else if (diff < -50) {
      // Swiped right -> prev slide
      setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setTouchStart(null);
  };

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-16 lg:pt-[72px]">
      {/* ======== HERO SECTION ======== */}
      <section
        className="relative overflow-hidden"
        id="hero"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[500px] xs:h-[540px] sm:h-[580px] lg:h-[640px]">
          {/* PC / Desktop Background Image (Hidden on mobile screens < 640px) */}
          <Image
            key={`desktop-${currentSlide.id}-${currentSlide.image_url}`}
            src={currentSlide.image_url || "/images/hero-banner.jpg"}
            alt={currentSlide.title || "Cresol — Timeless Modern Jewellery"}
            fill
            className="hidden sm:block object-cover object-center transition-all duration-700"
            priority
            sizes="100vw"
          />

          {/* Mobile Background Image (Visible on mobile screens < 640px, falls back to desktop image) */}
          <Image
            key={`mobile-${currentSlide.id}-${currentSlide.mobile_image_url || currentSlide.image_url}`}
            src={
              currentSlide.mobile_image_url && currentSlide.mobile_image_url.trim() !== ""
                ? currentSlide.mobile_image_url
                : currentSlide.image_url || "/images/hero-banner.jpg"
            }
            alt={currentSlide.title || "Cresol — Timeless Modern Jewellery"}
            fill
            className="block sm:hidden object-cover object-center transition-all duration-700"
            priority
            sizes="100vw"
          />

          {/* Gradient Overlay (Mobile vertical gradient reduced by 20%, desktop soft horizontal wash reduced by 20%) */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/75 via-white/55 to-white/20 sm:bg-gradient-to-r sm:from-white/70 sm:via-white/45 sm:to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end pb-8 sm:items-center sm:pb-0 z-10">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg">
                <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-[1.15] tracking-tight text-midnight">
                  {currentSlide.title ? (
                    currentSlide.title
                  ) : (
                    <>
                      Timeless Modern
                      <br />
                      <span className="text-champagne">Jewellery</span>
                    </>
                  )}
                </h1>
                <p className="mt-2.5 sm:mt-4 max-w-md text-xs xs:text-sm sm:text-base leading-relaxed text-slate-muted">
                  {currentSlide.subtitle ||
                    "Minimalist silver pieces crafted for everyday elegance. Hypoallergenic, enduring, and designed to tell your story."}
                </p>
                <div className="mt-5 sm:mt-7 flex items-center gap-3">
                  <Link
                    href={
                      currentSlide.link_url && currentSlide.link_url !== "#collection"
                        ? currentSlide.link_url
                        : "/shop"
                    }
                    id="hero-cta"
                    className="btn-luxury inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-midnight px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white transition-all hover:bg-midnight/90 active:scale-95 shadow-lg shadow-midnight/10"
                  >
                    Explore Collection
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Slide Navigation Controls */}
          {slides.length > 1 && (
            <>
              {/* Pagination Dots */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 flex items-center gap-2 z-20">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlideIndex === i
                        ? "w-6 bg-champagne"
                        : "w-2 bg-midnight/30 hover:bg-midnight/60"
                    }`}
                    aria-label={`View slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Desktop Next/Prev Arrow Buttons */}
              <div className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-2 z-20">
                <button
                  onClick={() =>
                    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-midnight shadow-md backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-midnight shadow-md backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ======== PRODUCT COLLECTION ======== */}
      <section
        className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
        id="collection"
      >
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight lg:text-4xl">
                Our Collection
              </h2>
              <span className="text-xs text-slate-muted sm:hidden">
                {filteredProducts.length} pieces
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-muted">
              Carefully curated pieces for every occasion.
            </p>
          </div>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Product Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-serif text-lg sm:text-xl text-midnight">
              No pieces found
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-muted">
              Try selecting a different category.
            </p>
          </div>
        )}
      </section>

      {/* ======== EDITORIAL BANNER ======== */}
      <section className="bg-sand py-16 lg:py-20" id="editorial">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
            The Cresol Promise
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-medium leading-snug text-midnight lg:text-4xl">
            Every piece is a conversation between heritage craft and modern
            minimalism.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-muted">
            We believe jewelry should be effortless — timeless enough to wear
            every day, yet distinctive enough to make a statement.
          </p>
        </div>
      </section>
    </div>
  );
}
