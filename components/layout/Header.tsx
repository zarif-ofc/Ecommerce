"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const currentPathRef = useRef(pathname);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());

  // Close mobile menu and reset header scrolled state whenever navigating to any page
  useEffect(() => {
    currentPathRef.current = pathname;
    setMobileMenuOpen(false);
    setScrolled(false);
  }, [pathname]);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      const savedPath = currentPathRef.current;
      const scrollY = window.scrollY;
      document.body.classList.add("no-scroll");
      document.body.style.top = `-${scrollY}px`;
      return () => {
        document.body.classList.remove("no-scroll");
        document.body.style.top = "";
        // Only restore previous scroll position if the user closed the menu without navigating to a new page
        if (currentPathRef.current === savedPath) {
          window.scrollTo(0, scrollY);
        } else {
          window.scrollTo(0, 0);
        }
      };
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // 1. If user is at or near the top of the page, ALWAYS be full-width solid white!
      if (window.scrollY <= 20) {
        setScrolled(false);
        return;
      }

      // 2. If hero carousel exists and is rendered, transition only after scrolling past it
      const hero = document.getElementById("hero");
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        // Only evaluate if hero is rendered with a realistic height
        if (heroRect.height > 100) {
          // Bottom of hero has scrolled above the header line
          setScrolled((prev) => {
            if (!prev && heroRect.bottom <= 70) return true;
            if (prev && heroRect.bottom > 130) return false;
            return prev;
          });
          return;
        }
      }

      // 3. Fallback for pages without hero carousel
      setScrolled((prev) => {
        if (!prev && window.scrollY > 80) return true;
        if (prev && window.scrollY <= 40) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Enable transitions after initial mount to prevent reload animation flicker
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 glass-header-container ${!mounted ? "no-transition" : ""
        } ${scrolled
          ? "glass-header-container-scrolled"
          : "glass-header-container-top pointer-events-auto"
        }`}
    >
      <div
        className={`w-full glass-navbar pointer-events-auto ${scrolled
            ? "glass-navbar-scrolled"
            : "glass-navbar-top"
          }`}
      >
        <div className="relative mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-full p-2 text-midnight transition-all hover:bg-white/60 active:scale-95 border border-transparent hover:border-white/80 lg:hidden"
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
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 group"
          >
            <span className="font-serif text-2xl font-semibold tracking-wider text-midnight lg:text-[28px] transition-transform group-hover:scale-[1.02]">
              CRESOL
            </span>
          </Link>

          {/* Desktop Navigation - Centered as in reference picture */}
          <nav
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 xl:gap-2"
            aria-label="Main navigation"
          >
            {[
              { name: "Shop All", href: "/shop" },
              { name: "Rings", href: "/rings" },
              { name: "Necklaces", href: "/necklaces" },
              { name: "Bracelets", href: "/bracelets" },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm tracking-wide transition-all px-4 py-2 rounded-full ${isActive
                      ? "bg-white/90 text-midnight font-semibold shadow-xs border border-white/80 scale-100"
                      : "text-slate-muted hover:text-midnight hover:bg-white/60 font-medium active:scale-95"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Cart Button */}
          <button
            id="cart-toggle"
            onClick={openCart}
            className="relative inline-flex items-center justify-center rounded-full p-2.5 text-midnight transition-all hover:bg-white/60 hover:shadow-xs border border-transparent hover:border-white/80 active:scale-95"
            aria-label={`Shopping bag with ${mounted ? itemCount : 0} items`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-midnight px-1 text-[10px] font-semibold text-white shadow-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-Over */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-midnight/40 backdrop-blur-sm lg:hidden animate-fade-in pointer-events-auto"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-xs glass-drawer h-full shadow-2xl p-6 flex flex-col justify-between border-r border-white/60 animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-slate-muted hover:bg-white/60 hover:text-midnight transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col mt-4 gap-1.5" aria-label="Mobile navigation">
                {[
                  { name: "Shop All", href: "/shop" },
                  { name: "Rings", href: "/rings" },
                  { name: "Necklaces", href: "/necklaces" },
                  { name: "Bracelets", href: "/bracelets" },
                ].map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${isActive
                          ? "bg-midnight text-white shadow-xs"
                          : "text-midnight hover:bg-white/60 active:bg-white/80"
                        }`}
                    >
                      <span>{item.name}</span>
                      <span className={`text-xs ${isActive ? "text-white/80" : "text-slate-muted/60"}`}>→</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Drawer Bottom Info */}
            <div className="pt-6 border-t border-border/60 space-y-4">
              <div className="rounded-xl bg-champagne/10 p-3.5 text-xs text-champagne-dark border border-champagne/20">
                <p className="font-semibold">Nationwide Delivery</p>
                <p className="mt-0.5 text-slate-muted">Cash on delivery across all 64 districts in Bangladesh.</p>
              </div>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold shadow-sm hover:brightness-105 active:scale-95 transition-all"
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
