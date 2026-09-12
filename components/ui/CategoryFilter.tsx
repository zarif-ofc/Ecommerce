"use client";

import type { ProductCategory } from "@/types/database";

interface CategoryFilterProps {
  activeCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
}

const categories: ProductCategory[] = [
  "All",
  "Rings",
  "Necklaces",
  "Bracelets",
];

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0 overflow-hidden">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              id={`filter-${category.toLowerCase()}`}
              onClick={() => onCategoryChange(category)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 touch-press ${
                isActive
                  ? "bg-midnight text-white shadow-sm ring-2 ring-midnight/10 scale-100"
                  : "bg-bone text-slate-muted hover:bg-sand hover:text-midnight active:bg-sand"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
