import Link from "next/link";
import { Mail } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-alabaster">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-wider text-midnight">
                CRESOL
              </span>
            </Link>
            <p className="mt-2.5 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-muted">
              Timeless modern jewellery crafted for the discerning individual.
              Hypoallergenic, minimalist, and designed to last.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="mb-3 sm:mb-4 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-midnight">
              Shop
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link
                  href="/shop"
                  className="text-xs sm:text-sm text-slate-muted transition-colors hover:text-midnight"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/rings"
                  className="text-xs sm:text-sm text-slate-muted transition-colors hover:text-midnight"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  href="/necklaces"
                  className="text-xs sm:text-sm text-slate-muted transition-colors hover:text-midnight"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  href="/bracelets"
                  className="text-xs sm:text-sm text-slate-muted transition-colors hover:text-midnight"
                >
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="col-span-1">
            <h3 className="mb-3 sm:mb-4 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-midnight">
              Information
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <span className="text-xs sm:text-sm text-slate-muted transition-colors hover:text-midnight cursor-default">
                  Shipping &amp; Delivery
                </span>
              </li>
              <li>
                <span className="text-xs sm:text-sm text-slate-muted transition-colors hover:text-midnight cursor-default">
                  Return Policy
                </span>
              </li>
              <li>
                <span className="text-xs sm:text-sm text-slate-muted transition-colors hover:text-midnight cursor-default">
                  Care Guide
                </span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 pt-4 sm:pt-6 lg:pt-0 border-t border-border/60 lg:border-0">
            <div className="flex items-center justify-between sm:justify-start sm:gap-8 lg:block">
              <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-midnight lg:mb-4">
                Connect
              </h3>
              <div className="flex gap-2.5 sm:gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-white/70 text-slate-muted transition-all hover:border-champagne hover:text-champagne hover:bg-white active:scale-95 shadow-xs"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-white/70 text-slate-muted transition-all hover:border-champagne hover:text-champagne hover:bg-white active:scale-95 shadow-xs"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href="mailto:hello@cresol.co"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-white/70 text-slate-muted transition-all hover:border-champagne hover:text-champagne hover:bg-white active:scale-95 shadow-xs"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 border-t border-border/60 pt-5 sm:pt-6">
          <p className="text-center text-[11px] sm:text-xs text-slate-muted">
            &copy; {new Date().getFullYear()} Cresol. All rights reserved. Handcrafted with care in Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
}
