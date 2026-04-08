"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDashboard =
    pathname.startsWith("/farm") || pathname.startsWith("/florist");

  if (isDashboard) return null;

  const isHome = pathname === "/";
  const heroMode = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        heroMode
          ? "border-b border-transparent bg-black/20 backdrop-blur-md"
          : "border-b border-fern/20 bg-fern/90 shadow-sm backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-semibold transition-colors",
            heroMode ? "text-white" : "text-white"
          )}
        >
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              heroMode ? "bg-white/20 text-white" : "bg-white/20 text-white"
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
                heroMode
                  ? "text-white/80 hover:text-white"
                  : pathname === href
                    ? "text-white"
                    : "text-white/80 hover:text-white"
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
                heroMode
                  ? "border border-white/30 text-white/80 hover:bg-white/10 hover:text-white"
                  : "border border-white/30 text-white hover:bg-white/10"
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
