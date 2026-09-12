import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cresol Admin — Dashboard",
  description: "Admin panel for managing Cresol jewelry store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-bg-primary text-text-primary min-h-screen">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#12221a",
              border: "1px solid #e2eae5",
              borderRadius: "14px",
              fontSize: "13px",
              boxShadow: "0 10px 30px -8px rgba(18, 34, 26, 0.12)",
            },
          }}
        />
      </body>
    </html>
  );
}
