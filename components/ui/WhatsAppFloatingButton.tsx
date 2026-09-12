"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const isCartOpen = useCartStore((s) => s.isOpen);

  // Hide floating button on checkout page, product pages (has sticky bar), or when cart drawer is open
  const isProductPage = pathname.startsWith("/product/");
  if (pathname === "/checkout" || isCartOpen) {
    return null;
  }

  const phoneNumber = "8801700000000";
  const defaultMessage = encodeURIComponent(
    "Hi Cresol! I'm browsing your jewellery collection and have a quick question."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  // On product pages, raise the button above the mobile sticky bar
  const bottomClass = isProductPage
    ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6"
    : "bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-6";

  return (
    <aside
      aria-label="WhatsApp customer support"
      className={`fixed ${bottomClass} right-4 z-40 sm:right-6 animate-fade-in`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_18px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_22px_rgba(37,211,102,0.5)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Chat with Cresol on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 fill-white/20" strokeWidth={2} />
        
        {/* Subtle Online Status Pip */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
        </span>

        {/* Desktop Tooltip Label */}
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-midnight px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 lg:block">
          Chat with Concierge
        </span>
      </a>
    </aside>
  );
}
