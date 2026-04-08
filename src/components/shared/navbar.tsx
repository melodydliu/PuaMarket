"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/farms", label: "Browse Farms" },
  { href: "/listings", label: "Browse Flowers" },
];

const DASHBOARD_LINKS = [
  { href: "/farm/listings", label: "Farm Dashboard" },
  { href: "/florist/browse", label: "Florist Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/farm") || pathname.startsWith("/florist");

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-soil">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fern text-white">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="text-lg tracking-tight">Pua Market</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-fern",
                pathname === href ? "text-fern" : "text-stone"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: demo dashboard links */}
        <div className="flex items-center gap-2">
          {DASHBOARD_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "hidden rounded-full px-4 py-1.5 text-xs font-medium transition-colors sm:block",
                href.startsWith("/farm")
                  ? "bg-fern-pale text-fern hover:bg-fern hover:text-white"
                  : "bg-clay-pale text-clay hover:bg-clay hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
