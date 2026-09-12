import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminShell } from "@/components/layout/AdminShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/login");

  return <AdminShell>{children}</AdminShell>;
}
