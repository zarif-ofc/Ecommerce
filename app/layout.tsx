import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppFloatingButton";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Cresol — Timeless Modern Jewellery",
  description:
    "Discover Cresol's curated collection of hypoallergenic, handcrafted silver jewelry. Rings, necklaces, and bracelets designed with minimalist elegance for the modern individual. Nationwide delivery across Bangladesh.",
  keywords: [
    "jewelry",
    "silver jewelry",
    "rings",
    "necklaces",
    "bracelets",
    "minimalist jewelry",
    "Bangladesh jewelry",
    "Cresol",
  ],
  openGraph: {
    title: "Cresol — Timeless Modern Jewellery",
    description:
      "Handcrafted silver jewelry designed with minimalist elegance. Shop rings, necklaces, and bracelets with nationwide delivery.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased selection:bg-champagne/20">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloatingButton />
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#111111",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
            },
          }}
        />
      </body>
    </html>
  );
}
