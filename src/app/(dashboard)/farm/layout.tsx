"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, List, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/farm/listings", label: "My Listings", icon: List },
  { href: "/farm/orders", label: "Orders", icon: ShoppingCart },
];

export default function FarmDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen -mt-16">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-white lg:flex">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fern text-white">
            <Leaf className="h-3.5 w-3.5" />
          </span>
          <span className="font-semibold text-soil">Pua Market</span>
        </div>

        {/* Farm label */}
        <div className="px-5 pb-2 pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone">
            Farm Dashboard
          </p>
        </div>

        <nav className="flex flex-col gap-0.5 px-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-fern-pale text-fern"
                  : "text-stone hover:bg-petal hover:text-soil"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom: switch to florist */}
        <div className="mt-auto border-t border-border p-4">
          <Link
            href="/florist/browse"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-stone transition-colors hover:bg-clay-pale hover:text-clay"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Switch to Florist view
          </Link>
          <Link
            href="/"
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-stone transition-colors hover:text-fern"
          >
            ← Back to marketplace
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-semibold text-soil">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fern text-white">
            <Leaf className="h-3 w-3" />
          </span>
          Farm Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                pathname === href ? "text-fern" : "text-stone"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-petal lg:pt-0">
        <div className="pt-14 lg:pt-0">{children}</div>
      </div>
    </div>
  );
}
