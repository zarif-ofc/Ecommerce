import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "champagne" | "mint" | "success" | "warning" | "danger" | "info";
}

const colorMap = {
  champagne: "bg-mint-light/80 border-mint-border text-mint",
  mint: "bg-mint-light/80 border-mint-border text-mint",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  danger: "bg-rose-50 border-rose-200 text-rose-700",
  info: "bg-sky-50 border-sky-200 text-sky-700",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "mint",
}: StatsCardProps) {
  const activeColor = color === "champagne" ? "mint" : color;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 transition-all duration-200 hover:border-mint-border hover:shadow-[0_8px_24px_-8px_rgba(37,114,85,0.12)] shadow-xs animate-fade-in group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-text-primary tracking-tight">
            {value}
          </p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trendUp ? "text-success" : "text-danger"}`}>
              {trend}
            </p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border shadow-xs transition-transform group-hover:scale-105 ${colorMap[activeColor]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
