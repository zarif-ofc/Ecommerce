"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Pencil, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import type { Product } from "@/types/database";
import { toast } from "sonner";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load products");
      console.error(error);
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    const { error } = await supabase.from("products").delete().eq("id", deleteTarget.id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success(`"${deleteTarget.title}" deleted`);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
    setDeleting(false);
  }

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} products in your store`}
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Products" }]}
        action={{ label: "Add Product", href: "/products/new", icon: Plus }}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white border border-border pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/15 shadow-2xs transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl bg-white border border-border px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/15 shadow-2xs transition-all"
        >
          <option value="All">All Categories</option>
          <option value="Rings">Rings</option>
          <option value="Necklaces">Necklaces</option>
          <option value="Bracelets">Bracelets</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-text-muted">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-10 w-10 text-text-muted mb-3" />
            <p className="text-sm text-text-muted">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full min-w-[620px]">
              <thead>
                <tr>
                  <th className="text-left">Product</th>
                  <th className="text-left">Category</th>
                  <th className="text-right">Price</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Sizes</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-bg-tertiary overflow-hidden flex-shrink-0">
                          {product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-sm">{product.title}</p>
                          <p className="text-xs text-text-muted font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="mint">{product.category}</Badge>
                    </td>
                    <td className="text-right">
                      <span className="font-medium text-text-primary">৳{product.price}</span>
                      {product.original_price && (
                        <span className="ml-1.5 text-xs text-text-muted line-through">
                          ৳{product.original_price}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <Badge variant={product.in_stock ? "success" : "danger"}>
                        {product.in_stock ? "In Stock" : "Out"}
                      </Badge>
                    </td>
                    <td className="text-center text-text-secondary text-xs">
                      {product.sizes.length > 0 ? product.sizes.join(", ") : "—"}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-mint-light hover:text-mint transition-all"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-rose-50 hover:text-danger transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
        <p className="text-sm text-text-secondary mb-5">
          Are you sure you want to delete <strong className="text-text-primary">&quot;{deleteTarget?.title}&quot;</strong>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="rounded-xl bg-bg-hover px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger/90 disabled:opacity-50 transition-all"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}
