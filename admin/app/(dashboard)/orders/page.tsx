"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import type { Order, OrderStatus } from "@/types/database";
import { toast } from "sonner";
import { ShoppingCart, ChevronDown, ChevronUp, Filter } from "lucide-react";

const allStatuses: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const statusVariant: Record<OrderStatus, "default" | "success" | "warning" | "danger" | "info"> = {
  Pending: "warning",
  Confirmed: "info",
  Shipped: "info",
  Delivered: "success",
  Cancelled: "danger",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<{ order: Order; newStatus: OrderStatus } | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load orders");
    } else {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }

  async function handleStatusUpdate() {
    if (!statusModal) return;
    setUpdating(true);

    const { error } = await supabase
      .from("orders")
      .update({ status: statusModal.newStatus })
      .eq("id", statusModal.order.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Order updated to ${statusModal.newStatus}`);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === statusModal.order.id ? { ...o, status: statusModal.newStatus } : o
        )
      );
    }
    setStatusModal(null);
    setUpdating(false);
  }

  const filtered = statusFilter === "All"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${orders.length} total orders`}
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Orders" }]}
      />

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-text-muted" />
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap w-full flex-nowrap">
          {["All", ...allStatuses].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-mint text-white border border-mint shadow-2xs font-semibold"
                  : "bg-white text-text-secondary border border-border hover:bg-bg-hover hover:border-mint-border shadow-2xs"
              }`}
            >
              {status}
              {status !== "All" && (
                <span className="ml-1.5 text-text-muted">
                  ({orders.filter((o) => o.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-text-muted">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="h-10 w-10 text-text-muted mb-3" />
            <p className="text-sm text-text-muted">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full min-w-[680px]">
              <thead>
                <tr>
                  <th className="text-left w-8"></th>
                  <th className="text-left">Order</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Phone</th>
                  <th className="text-left">City</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <>
                    <tr key={order.id} className="cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <td className="text-text-muted">
                        {expandedOrder === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </td>
                      <td className="font-mono text-xs text-text-secondary">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="text-text-primary font-medium">{order.customer_name}</td>
                      <td className="text-text-secondary text-xs">{order.customer_phone}</td>
                      <td className="text-text-secondary">{order.city}</td>
                      <td className="text-right text-text-primary font-medium">
                        \u09F3{Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="text-center">
                        <select
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const newStatus = e.target.value as OrderStatus;
                            if (newStatus !== order.status) {
                              setStatusModal({ order, newStatus });
                            }
                          }}
                          className="rounded-lg bg-white border border-border px-2 py-1 text-xs font-medium text-text-primary focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/20 transition-all cursor-pointer shadow-2xs"
                        >
                          {allStatuses.map((s) => (
                            <option key={s} value={s} className="bg-white text-text-primary">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="text-right text-text-secondary text-xs">
                        {new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={8} className="!p-0">
                          <div className="bg-bg-tertiary/50 px-6 py-4 border-t border-border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs font-medium text-text-muted mb-1">Delivery Address</p>
                                <p className="text-text-primary">{order.delivery_address}</p>
                                {order.delivery_notes && (
                                  <p className="text-text-secondary text-xs mt-1">Note: {order.delivery_notes}</p>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-text-muted mb-1">Items</p>
                                <div className="space-y-1">
                                  {(order.items || []).map((item, i) => (
                                    <div key={i} className="flex justify-between text-xs">
                                      <span className="text-text-primary">
                                        {item.title} {item.size ? `(${item.size})` : ""} x{item.quantity}
                                      </span>
                                      <span className="text-text-secondary">\u09F3{item.price * item.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-text-muted mb-1">Payment</p>
                                <p className="text-text-primary">{order.payment_method}</p>
                                <p className="text-xs text-text-secondary mt-1">
                                  Delivery fee: \u09F3{Number(order.delivery_fee)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Change Confirmation */}
      <Modal
        open={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Update Order Status"
      >
        <p className="text-sm text-text-secondary mb-5">
          Change order <strong className="text-text-primary font-mono">{statusModal?.order.id.slice(0, 8)}...</strong> status
          from <Badge variant={statusVariant[statusModal?.order.status || "Pending"]}>{statusModal?.order.status}</Badge> to{" "}
          <Badge variant={statusVariant[statusModal?.newStatus || "Pending"]}>{statusModal?.newStatus}</Badge>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setStatusModal(null)}
            className="rounded-xl bg-bg-hover px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={updating}
            className="rounded-xl bg-mint px-4 py-2.5 text-sm font-semibold text-white hover:bg-mint-dark disabled:opacity-50 transition-all shadow-xs"
          >
            {updating ? "Updating..." : "Confirm"}
          </button>
        </div>
      </Modal>
    </>
  );
}
