import { HeroSkeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="pt-16 lg:pt-[72px] min-h-screen bg-white">
      {/* Hero Banner Skeleton */}
      <HeroSkeleton />

      {/* Featured Collection Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <div className="h-3 w-28 rounded skeleton-shimmer" />
          <div className="h-8 sm:h-10 w-64 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-80 max-w-md rounded skeleton-shimmer" />
          {/* Filter Pills Skeleton */}
          <div className="pt-4 flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 rounded-full skeleton-shimmer flex-shrink-0"
              />
            ))}
          </div>
        </div>

        <ProductGridSkeleton count={8} />
      </section>
    </div>
  );
}
