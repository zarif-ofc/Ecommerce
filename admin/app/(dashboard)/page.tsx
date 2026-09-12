import { supabase } from "@/lib/supabase";
import { Package, ShoppingCart, Clock, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import type { Order, OrderStatus } from "@/types/database";
import Link from "next/link";

const statusVariant: Record<OrderStatus, "default" | "success" | "warning" | "danger" | "info"> = {
  Pending: "warning",
  Confirmed: "info",
  Shipped: "info",
  Delivered: "success",
  Cancelled: "danger",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [productsRes, ordersRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
  ]);

  const totalProducts = productsRes.count ?? 0;
  const orders = (ordersRes.data as Order[]) ?? [];
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const recentOrders = orders.slice(0, 8);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your store performance"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="mint"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          color="info"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="success"
        />
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Recent Orders</h2>
          <Link
            href="/orders"
            className="text-xs font-medium text-mint hover:text-mint-dark transition-colors"
          >
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-text-muted">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full min-w-[580px]">
              <thead>
                <tr>
                  <th className="text-left">Order</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">City</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs text-text-secondary">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="text-text-primary font-medium">{order.customer_name}</td>
                    <td className="text-text-secondary">{order.city}</td>
                    <td className="text-right text-text-primary font-medium">
                      ৳{Number(order.total_amount).toLocaleString()}
                    </td>
                    <td className="text-center">
                      <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                    </td>
                    <td className="text-right text-text-secondary text-xs">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
