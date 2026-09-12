import { PageHeader } from "@/components/ui/PageHeader";
import { ProductForm } from "@/components/forms/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        title="Add Product"
        description="Create a new product in your store"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Products", href: "/products" },
          { label: "New Product" },
        ]}
      />
      <ProductForm mode="create" />
    </>
  );
}
