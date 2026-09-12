type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "mint";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantMap: Record<BadgeVariant, string> = {
  default: "bg-bg-tertiary text-text-secondary border-border",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  warning: "bg-amber-50 text-amber-800 border-amber-200/80",
  danger: "bg-rose-50 text-rose-800 border-rose-200/80",
  info: "bg-sky-50 text-sky-800 border-sky-200/80",
  mint: "bg-mint-light text-mint border-mint-border",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${variantMap[variant]}`}
    >
      {children}
    </span>
  );
}
