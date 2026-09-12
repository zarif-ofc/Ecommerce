export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-72 rounded skeleton-shimmer" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-white p-5 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded skeleton-shimmer" />
              <div className="h-9 w-9 rounded-xl skeleton-shimmer" />
            </div>
            <div className="h-7 w-28 rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <div className="h-5 w-32 rounded skeleton-shimmer" />
          <div className="h-4 w-16 rounded skeleton-shimmer" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="h-4 w-24 rounded skeleton-shimmer" />
              <div className="h-4 w-32 rounded skeleton-shimmer" />
              <div className="h-4 w-20 rounded skeleton-shimmer" />
              <div className="h-6 w-16 rounded-full skeleton-shimmer" />
              <div className="h-4 w-20 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
