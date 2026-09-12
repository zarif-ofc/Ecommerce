"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Mobile Top Header (hidden on desktop) */}
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white/95 backdrop-blur-md px-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-tertiary/60 text-text-primary hover:bg-mint-light hover:text-mint hover:border-mint-border transition-all"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-mint to-mint-dark text-white font-bold text-xs shadow-2xs">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-text-primary tracking-tight leading-none">Cresol</span>
              <span className="text-[9px] uppercase font-semibold text-mint tracking-wider leading-none mt-0.5">Admin</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-mint bg-mint-light px-2.5 py-1 rounded-full border border-mint-border">
          <Sparkles className="h-3 w-3" />
          <span>Live</span>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Responsive Sidebar */}
        <Sidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Main Page Content */}
        <main
          className={`flex-1 w-full min-w-0 transition-all duration-300 ${
            collapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
