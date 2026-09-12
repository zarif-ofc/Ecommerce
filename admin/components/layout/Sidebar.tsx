"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Images,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Carousels", href: "/carousels", icon: Images },
];

export function Sidebar({
  mobileOpen = false,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function handleNavClick() {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden animate-fade-in transition-opacity"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`glass-sidebar fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border shadow-[1px_0_24px_rgba(18,34,26,0.04)] transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[68px]" : "w-[260px] lg:w-[240px]"}`}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {(!collapsed || mobileOpen) ? (
            <>
              <Link href="/" onClick={handleNavClick} className="flex items-center gap-2.5 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-mint to-mint-dark shadow-sm">
                  <span className="text-sm font-bold text-white tracking-wider">C</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary tracking-tight">Cresol</span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-mint -mt-0.5">Admin Panel</span>
                </div>
              </Link>

              {/* Close Button on Mobile */}
              <button
                onClick={onCloseMobile}
                className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-hover hover:text-text-primary transition-all"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-mint to-mint-dark shadow-sm">
              <span className="text-sm font-bold text-white tracking-wider">C</span>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={handleNavClick}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-mint-light text-mint font-semibold shadow-2xs"
                    : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                }`}
                title={collapsed && !mobileOpen ? label : undefined}
              >
                <Icon
                  className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                    isActive ? "text-mint" : "text-text-muted group-hover:text-text-secondary"
                  }`}
                />
                {(!collapsed || mobileOpen) && <span>{label}</span>}
                {(!collapsed || mobileOpen) && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mint" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-border p-3 space-y-1 bg-white/50">
          {/* Collapse Button (Desktop Only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-text-muted hover:bg-bg-hover hover:text-text-primary transition-all"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 mx-auto text-text-muted" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Menu</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-danger hover:bg-rose-50 transition-all"
          >
            <LogOut className={`h-4 w-4 ${collapsed && !mobileOpen ? "mx-auto" : ""}`} />
            {(!collapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
