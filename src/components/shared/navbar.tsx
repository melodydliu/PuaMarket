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

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors",
        isHome
          ? "border-b border-transparent bg-black/20 backdrop-blur-md"
          : "border-b border-border bg-background/95 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-semibold transition-colors",
            isHome ? "text-white" : "text-soil"
          )}
        >
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              isHome ? "bg-white/20 text-white" : "bg-fern text-white"
            )}
          >
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
                "text-sm font-medium tracking-wide transition-colors",
                isHome
                  ? "text-white/80 hover:text-white"
                  : pathname === href
                    ? "text-fern"
                    : "text-stone hover:text-fern"
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
                isHome
                  ? "border border-white/30 text-white/80 hover:bg-white/10 hover:text-white"
                  : href.startsWith("/farm")
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
