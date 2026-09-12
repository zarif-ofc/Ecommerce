"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-header ${
        scrolled ? "shadow-[0_1px_0_0_var(--color-border)]" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-[72px]">
          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-midnight transition-colors hover:bg-bone lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            id="brand-logo"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            <span className="font-serif text-2xl font-semibold tracking-wider text-midnight lg:text-[28px]">
              CRESOL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="text-sm font-medium tracking-wide text-slate-muted transition-colors hover:text-midnight"
            >
              Shop All
            </Link>
            <Link
              href="/?category=Rings"
              className="text-sm font-medium tracking-wide text-slate-muted transition-colors hover:text-midnight"
            >
              Rings
            </Link>
            <Link
              href="/?category=Necklaces"
              className="text-sm font-medium tracking-wide text-slate-muted transition-colors hover:text-midnight"
            >
              Necklaces
            </Link>
            <Link
              href="/?category=Bracelets"
              className="text-sm font-medium tracking-wide text-slate-muted transition-colors hover:text-midnight"
            >
              Bracelets
            </Link>
          </nav>

          {/* Cart Button */}
          <button
            id="cart-toggle"
            onClick={openCart}
            className="relative inline-flex items-center justify-center rounded-md p-2 text-midnight transition-colors hover:bg-bone"
            aria-label={`Shopping bag with ${mounted ? itemCount : 0} items`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-midnight px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-Over */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-midnight/40 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-r border-border animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-slate-muted hover:bg-bone hover:text-midnight"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col mt-4 gap-1.5" aria-label="Mobile navigation">
                {[
                  { name: "Shop All", href: "/" },
                  { name: "Rings", href: "/?category=Rings" },
                  { name: "Necklaces", href: "/?category=Necklaces" },
                  { name: "Bracelets", href: "/?category=Bracelets" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-midnight transition-colors hover:bg-bone active:bg-bone"
                  >
                    <span>{item.name}</span>
                    <span className="text-slate-muted/60 text-xs">→</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Drawer Bottom Info */}
            <div className="pt-6 border-t border-border space-y-4">
              <div className="rounded-xl bg-champagne/10 p-3.5 text-xs text-champagne-dark">
                <p className="font-semibold">Nationwide Delivery</p>
                <p className="mt-0.5 text-slate-muted">Cash on delivery across all 64 districts in Bangladesh.</p>
              </div>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold shadow-sm"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
