"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  FileText,
  Banknote,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import type { OrderItem } from "@/types/database";

type DeliveryZone = "Inside Dhaka" | "Outside Dhaka";

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: DeliveryZone;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    city: "Inside Dhaka",
    notes: "",
  });

  const subtotal = getTotal();
  const deliveryFee = form.city === "Inside Dhaka" ? 70 : 130;
  const grandTotal = subtotal + deliveryFee;

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!/^01\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      toast.error("Please enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX)");
      return;
    }

    setIsSubmitting(true);

    const orderItems: OrderItem[] = items.map((item) => ({
      product_id: item.product_id,
      title: item.title,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from("orders")
          .insert({
            customer_name: form.name.trim(),
            customer_phone: form.phone.trim(),
            delivery_address: form.address.trim(),
            city: form.city,
            delivery_notes: form.notes.trim() || null,
            items: orderItems,
            total_amount: grandTotal,
            delivery_fee: deliveryFee,
            payment_method: "Cash on Delivery" as const,
            status: "Pending" as const,
          })
          .select("id")
          .single();

        if (error) throw error;
        clearCart();
        router.push(`/order-confirmation/${data.id}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockId = crypto.randomUUID();
        clearCart();
        router.push(`/order-confirmation/${mockId}`);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      toast.error("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-16 lg:pt-[72px]">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bone mb-4">
            <ShoppingBag className="h-8 w-8 text-slate-muted" strokeWidth={1} />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-midnight">
            Your bag is empty
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-muted">
            Add some timeless pieces before checking out.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-midnight px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-midnight/90 active:scale-95 shadow-md"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-[72px]">
      <div className="mx-auto max-w-6xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="mb-4 sm:mb-8 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-muted transition-colors hover:text-midnight py-1 touch-press"
        >
          <ChevronLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-midnight">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          {/* ======== MOBILE COLLAPSIBLE ORDER SUMMARY (Shopify style) ======== */}
          <div className="lg:hidden mt-4 mb-6 rounded-2xl border border-border bg-alabaster overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors active:bg-sand/50"
              aria-expanded={mobileSummaryOpen}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-champagne" strokeWidth={1.5} />
                <span className="text-xs font-semibold uppercase tracking-wider text-midnight">
                  {mobileSummaryOpen ? "Hide Order Summary" : "Show Order Summary"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-muted transition-transform duration-200 ${
                    mobileSummaryOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              <span className="text-sm font-bold text-midnight">
                {formatPrice(grandTotal)}
              </span>
            </button>

            {mobileSummaryOpen && (
              <div className="px-4 pb-4 pt-2 border-t border-border/60 animate-fade-in space-y-3">
                <ul className="divide-y divide-border-light">
                  {items.map((item) => (
                    <li
                      key={`${item.product_id}-${item.size}`}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-bone">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-midnight truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-muted">
                          {item.size ? `Size: ${item.size} · ` : ""}Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-midnight">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-muted">
                    <span>Subtotal</span>
                    <span className="text-midnight font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-muted">
                    <span>Delivery ({form.city})</span>
                    <span className="text-midnight font-medium">{formatPrice(deliveryFee)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-8 grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
            {/* ======== LEFT: FORM ======== */}
            <div className="space-y-6 sm:space-y-8">
              {/* Customer Information */}
              <fieldset className="space-y-4 sm:space-y-5">
                <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-midnight">
                  Customer Information
                </legend>

                {/* Name */}
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="mb-1.5 flex items-center gap-2 text-xs sm:text-sm font-medium text-midnight"
                  >
                    <User className="h-3.5 w-3.5 text-champagne" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. Ayesha Rahman"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-base text-midnight outline-none transition-all placeholder:text-slate-muted/60 focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="mb-1.5 flex items-center gap-2 text-xs sm:text-sm font-medium text-midnight"
                  >
                    <Phone className="h-3.5 w-3.5 text-champagne" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-base text-midnight outline-none transition-all placeholder:text-slate-muted/60 focus:border-champagne focus:ring-2 focus:ring-champagne/10 font-mono tracking-wide"
                  />
                  <p className="mt-1 text-[11px] text-slate-muted">
                    We will call to confirm your delivery address before dispatch.
                  </p>
                </div>
              </fieldset>

              {/* Delivery Information */}
              <fieldset className="space-y-4 sm:space-y-5">
                <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-midnight">
                  Delivery Details
                </legend>

                {/* Address */}
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="mb-1.5 flex items-center gap-2 text-xs sm:text-sm font-medium text-midnight"
                  >
                    <MapPin className="h-3.5 w-3.5 text-champagne" />
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="checkout-address"
                    required
                    autoComplete="street-address"
                    rows={3}
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="House, Road, Area, Thana, District"
                    className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-base text-midnight outline-none transition-all placeholder:text-slate-muted/60 focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                  />
                </div>

                {/* Delivery Zone Selection */}
                <div>
                  <span className="mb-2.5 block text-xs sm:text-sm font-medium text-midnight">
                    Delivery Zone <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        { zone: "Inside Dhaka" as const, fee: 70, time: "2-3 business days" },
                        { zone: "Outside Dhaka" as const, fee: 130, time: "3-5 business days" },
                      ] as const
                    ).map(({ zone, fee, time }) => (
                      <label
                        key={zone}
                        htmlFor={`zone-${zone}`}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all touch-press ${
                          form.city === zone
                            ? "border-champagne bg-champagne/10 ring-1 ring-champagne/30 shadow-xs"
                            : "border-border bg-white hover:border-champagne/50 active:bg-bone"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id={`zone-${zone}`}
                            name="delivery-zone"
                            checked={form.city === zone}
                            onChange={() => updateField("city", zone)}
                            className="h-4 w-4 accent-[#c5a880]"
                          />
                          <div>
                            <span className="text-sm font-semibold text-midnight block">
                              {zone}
                            </span>
                            <span className="text-[11px] text-slate-muted">
                              {time}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-champagne-dark">
                          ৳{fee}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="checkout-notes"
                    className="mb-1.5 flex items-center gap-2 text-xs sm:text-sm font-medium text-midnight"
                  >
                    <FileText className="h-3.5 w-3.5 text-champagne" />
                    Special Instructions
                    <span className="text-[11px] text-slate-muted">(optional)</span>
                  </label>
                  <textarea
                    id="checkout-notes"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="e.g. Leave with building security / Ring doorbell"
                    className="w-full resize-none rounded-xl border border-border bg-white px-4 py-2.5 text-base text-midnight outline-none transition-all placeholder:text-slate-muted/60 focus:border-champagne focus:ring-2 focus:ring-champagne/10"
                  />
                </div>
              </fieldset>

              {/* Payment Method */}
              <fieldset>
                <legend className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-midnight">
                  Payment Method
                </legend>
                <div className="flex items-center gap-3.5 rounded-xl border border-champagne bg-champagne/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark flex-shrink-0">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-midnight">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-slate-muted">
                      Pay safely in cash when your jewellery package arrives at your doorstep.
                    </p>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* ======== RIGHT: ORDER SUMMARY (Desktop sticky) ======== */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-alabaster p-6 animate-scale-in">
                <h2 className="font-serif text-lg font-semibold text-midnight">
                  Order Summary
                </h2>

                {/* Items */}
                <ul className="mt-5 divide-y divide-border-light">
                  {items.map((item) => (
                    <li
                      key={`${item.product_id}-${item.size}`}
                      className="flex gap-3 py-3"
                    >
                      <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-bone">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-midnight line-clamp-1">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-muted">
                          {item.size ? `Size ${item.size} · ` : ""}Qty{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-midnight">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="mt-4 space-y-2.5 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-muted">Subtotal</span>
                    <span className="font-medium text-midnight">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-muted">Delivery ({form.city})</span>
                    <span className="font-medium text-midnight">
                      {formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="text-base font-semibold text-midnight">
                      Total
                    </span>
                    <span className="text-xl font-bold text-midnight">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Desktop Submit */}
                <button
                  type="submit"
                  id="confirm-order"
                  disabled={isSubmitting}
                  className="btn-luxury mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-midnight py-3.5 text-sm font-semibold tracking-wide text-white transition-all hover:bg-midnight/90 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Confirm Order — {formatPrice(grandTotal)}
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-slate-muted">
                  Safe &amp; encrypted · Cash on Delivery
                </p>
              </div>
            </div>
          </div>

          {/* ======== MOBILE STICKY SUBMIT BAR ======== */}
          <aside
            aria-label="Mobile checkout submit bar"
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden"
          >
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-muted font-medium">
                  Total (COD)
                </span>
                <span className="text-base font-bold text-midnight leading-tight">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <button
                type="submit"
                id="confirm-order-mobile"
                disabled={isSubmitting}
                className="btn-luxury flex-1 flex items-center justify-center gap-2 rounded-full bg-midnight py-3.5 px-6 text-sm font-semibold tracking-wide text-white active:scale-95 shadow-md disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Confirm Order
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* Spacer for mobile sticky bar */}
          <div className="h-[calc(84px+env(safe-area-inset-bottom,0px))] lg:hidden" />
        </form>
      </div>
    </div>
  );
}
