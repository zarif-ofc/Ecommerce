export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function calculateDiscount(
  price: number,
  originalPrice: number | null
): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function generateWhatsAppLink(
  orderId: string,
  customerName: string
): string {
  const phone = "8801XXXXXXXXX";
  const message = encodeURIComponent(
    `Hi Cresol! I just placed an order.\n\nOrder ID: ${orderId}\nName: ${customerName}\n\nPlease confirm my order. Thank you!`
  );
  return `https://wa.me/${phone}?text=${message}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
