import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductForm } from "@/components/forms/ProductForm";
import type { Product } from "@/types/database";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;

  return (
    <>
      <PageHeader
        title={`Edit: ${product.title}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Edit" },
        ]}
      />
      <ProductForm product={product} mode="edit" />
    </>
  );
}
