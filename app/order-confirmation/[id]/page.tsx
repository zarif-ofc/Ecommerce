import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import type { Order } from "@/types/database";
import { CopyButton } from "@/components/ui/CopyButton";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Order;
}

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <div className="flex min-h-screen items-center justify-center px-3.5 sm:px-6 pt-16 pb-20 lg:pt-[72px]">
      <div className="w-full max-w-lg text-center animate-scale-in">
        {/* Success Icon */}
        <div className="mx-auto flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-green-50 shadow-inner">
          <CheckCircle2
            className="h-9 w-9 sm:h-10 sm:w-10 text-green-500"
            strokeWidth={1.75}
            style={{ animation: "check-bounce 0.6s ease-out both 0.2s" }}
          />
        </div>

        <h1 className="mt-5 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-midnight">
          Order Confirmed!
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-muted max-w-sm mx-auto">
          Thank you for choosing Cresol. We are preparing your jewellery with signature gift packaging.
        </p>

        {/* Order ID Card */}
        <div className="mt-6 sm:mt-8 rounded-2xl border border-border bg-alabaster p-5 sm:p-6 text-left shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
              Order ID
            </span>
            <div className="flex items-center gap-1.5">
              <code className="rounded-md bg-bone px-2.5 py-1 text-xs font-mono font-medium text-midnight">
                {id.slice(0, 8).toUpperCase()}
              </code>
              <CopyButton text={id} />
            </div>
          </div>

          {order ? (
            <div className="mt-5 space-y-3.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-muted">Customer</span>
                <span className="font-medium text-midnight">
                  {order.customer_name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-muted">Phone</span>
                <span className="font-medium text-midnight">
                  {order.customer_phone}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-muted">Delivery</span>
                <span className="font-medium text-midnight">{order.city}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-muted">Payment</span>
                <span className="font-medium text-midnight">
                  {order.payment_method}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-muted">Status</span>
                <span className="rounded-full bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-700">
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="border-t border-border pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-midnight">
                  Items
                </p>
                {(order.items as { title: string; quantity: number; price: number; size?: string }[]).map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-1.5 text-sm"
                    >
                      <span className="text-slate-muted">
                        {item.title}
                        {item.size ? ` (${item.size})` : ""} × {item.quantity}
                      </span>
                      <span className="font-medium text-midnight">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-semibold text-midnight">Total</span>
                <span className="text-lg font-bold text-midnight">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-slate-muted">
                Your order is confirmed. You will receive a call from our
                team to verify delivery details.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={generateWhatsAppLink(
              id,
              order?.customer_name ?? "Customer"
            )}
            target="_blank"
            rel="noopener noreferrer"
            id="whatsapp-contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#22c55e]"
          >
            <MessageCircle className="h-4 w-4" />
            Contact via WhatsApp
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-midnight transition-all hover:bg-bone"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
