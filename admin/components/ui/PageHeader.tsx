import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
}

export function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="mb-6 animate-fade-in">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-2.5">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3 text-text-muted/60" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-mint transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-text-secondary font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
        </div>
        {action &&
          (action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-mint-dark transition-all duration-200"
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-mint-dark transition-all duration-200"
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </button>
          ))}
      </div>
    </div>
  );
}
