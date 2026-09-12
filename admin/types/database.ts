export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  category: "Rings" | "Necklaces" | "Bracelets";
  images: string[];
  material_specs: string;
  care_instructions: string;
  sizes: string[];
  in_stock: boolean;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  size: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  city: "Inside Dhaka" | "Outside Dhaka";
  delivery_notes: string | null;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
}

export interface Carousel {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  mobile_image_url?: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type ProductCategory = "Rings" | "Necklaces" | "Bracelets";
