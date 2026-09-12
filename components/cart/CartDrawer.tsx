"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const total = getTotal();

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className="absolute inset-0 cart-overlay animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-midnight" strokeWidth={1.5} />
            <h2 className="font-serif text-xl font-semibold text-midnight">
              Your Bag
            </h2>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-bone px-2 text-xs font-medium text-slate-muted">
              {items.length}
            </span>
          </div>
          <button
            id="cart-close"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-bone"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bone">
                <ShoppingBag
                  className="h-8 w-8 text-slate-muted"
                  strokeWidth={1}
                />
              </div>
              <div>
                <p className="font-serif text-lg font-medium text-midnight">
                  Your bag is empty
                </p>
                <p className="mt-1 text-sm text-slate-muted">
                  Explore our collection and find something you love.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 rounded-full bg-midnight px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-midnight/90"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border-light">
              {items.map((item) => (
                <li
                  key={`${item.product_id}-${item.size}`}
                  className="flex gap-4 py-4 animate-fade-in"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-[88px] w-[72px] flex-shrink-0 overflow-hidden rounded-lg bg-bone"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-midnight transition-colors hover:text-champagne line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      {item.size && (
                        <p className="mt-0.5 text-xs text-slate-muted">
                          Size: {item.size}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center rounded-full border border-border bg-bone/50 shadow-2xs">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-muted transition-colors hover:text-midnight active:bg-bone"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[26px] text-center text-xs font-semibold text-midnight">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-muted transition-colors hover:text-midnight active:bg-bone"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-midnight">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() =>
                            removeItem(item.product_id, item.size)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-muted transition-colors hover:bg-red-50 hover:text-red-500 active:scale-90"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 sm:px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] space-y-3.5 bg-white">
            {/* Value Perk Bar */}
            <div className="rounded-xl bg-champagne/10 px-3.5 py-2 flex items-center justify-between text-xs text-champagne-dark">
              <span className="font-medium">✨ Luxury Gift Box</span>
              <span className="font-semibold text-emerald-600">FREE Included</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-muted">Subtotal</span>
              <span className="text-lg font-bold text-midnight">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-[11px] text-slate-muted">
              Delivery fee (৳70 Dhaka / ৳130 Nationwide) calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              id="checkout-btn"
              className="btn-luxury flex w-full items-center justify-center rounded-full bg-midnight py-4 text-sm font-semibold tracking-wide text-white transition-all hover:bg-midnight/90 active:scale-98 shadow-md"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
