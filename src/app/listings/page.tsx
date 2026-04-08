"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_LISTINGS, MOCK_FARMS } from "@/lib/mock-data";
import { ListingCard } from "@/components/farm/listing-card";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/shared/page-transition";
import type { Island } from "@/types/database";

const ISLANDS: Island[] = [
  "Oahu",
  "Maui",
  "Big Island",
  "Kauai",
  "Molokai",
  "Lanai",
];

const COLOR_OPTIONS = [
  { key: "white",  label: "White",  hex: "#F8F5F0" },
  { key: "cream",  label: "Cream",  hex: "#EDD9A3" },
  { key: "pink",   label: "Pink",   hex: "#F4A7B9" },
  { key: "red",    label: "Red",    hex: "#C0392B" },
  { key: "orange", label: "Orange", hex: "#E67E22" },
  { key: "yellow", label: "Yellow", hex: "#F1C40F" },
  { key: "green",  label: "Green",  hex: "#3D8B5E" },
  { key: "purple", label: "Purple", hex: "#8E44AD" },
  { key: "blue",   label: "Blue",   hex: "#3B82C4" },
];

type AvailabilityFilter = "available" | "unavailable" | "all";
type ActiveFilter = "availability" | "island" | "color" | "farm" | "sort" | null;

export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [selectedIslands, setSelectedIslands] = useState<Island[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFarms, setSelectedFarms] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilityFilter>("available");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "recent" | "oldest" | "">("");
  const [openFilter, setOpenFilter] = useState<ActiveFilter>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  function toggleFilter(key: ActiveFilter) {
    setOpenFilter((prev) => (prev === key ? null : key));
  }

  function toggleIsland(island: Island) {
    setSelectedIslands((prev) =>
      prev.includes(island) ? prev.filter((i) => i !== island) : [...prev, island]
    );
  }

  function toggleColor(key: string) {
    setSelectedColors((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  }

  function toggleFarm(id: string) {
    setSelectedFarms((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  const hasActiveFilters =
    !!search ||
    selectedIslands.length > 0 ||
    selectedColors.length > 0 ||
    selectedFarms.length > 0 ||
    sortBy !== "" ||
    availability !== "available";

  function clearAll() {
    setSearch("");
    setSelectedIslands([]);
    setSelectedColors([]);
    setSelectedFarms([]);
    setSortBy("");
    setAvailability("available");
    setOpenFilter(null);
  }

  const filtered = MOCK_LISTINGS
    .filter((l) => {
      if (availability === "available") return l.is_active;
      if (availability === "unavailable") return !l.is_active;
      return true;
    })
    .filter((l) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        l.flower_name.toLowerCase().includes(s) ||
        l.variety?.toLowerCase().includes(s) ||
        l.color?.toLowerCase().includes(s)
      );
    })
    .filter((l) => {
      if (selectedIslands.length === 0) return true;
      return l.farm?.island !== undefined && selectedIslands.includes(l.farm.island);
    })
    .filter((l) => {
      if (selectedColors.length === 0) return true;
      if (!l.color) return false;
      const colorLower = l.color.toLowerCase();
      return selectedColors.some((c) => colorLower.includes(c));
    })
    .filter((l) => {
      if (selectedFarms.length === 0) return true;
      return selectedFarms.includes(l.farm_id);
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price_per_unit - b.price_per_unit;
      if (sortBy === "price-desc") return b.price_per_unit - a.price_per_unit;
      if (sortBy === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return 0;
    });

  // Shared pill base styles
  const pillBase =
    "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors select-none cursor-pointer";
  const pillDefault = "border-stone/30 bg-white text-soil hover:border-stone/50";
  const pillActive = "border-soil bg-soil text-white";

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-soil">Browse Flowers</h1>
          <p className="mt-1 text-sm text-stone">
            Fresh inventory from farms across Hawaii
          </p>
        </div>

        {/* Search + Filter/Sort bar */}
        <div className="relative z-20 mb-8">
          {openFilter && (
            <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
          )}

          {/* Search — full width on mobile */}
          <div className="relative mb-2 sm:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9" />
          </div>

          {/* Mobile: Filters button + Sort */}
          <div className="flex items-center gap-2 sm:hidden">
            <button onClick={() => setFilterSheetOpen(true)} className={`${pillBase} ${hasActiveFilters ? pillActive : pillDefault}`}>
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
                  {(availability !== "available" ? 1 : 0) + selectedColors.length + selectedIslands.length + selectedFarms.length || ""}
                </span>
              )}
            </button>
            <div className="relative z-20 ml-auto shrink-0">
              <button onClick={() => toggleFilter("sort")} className={`${pillBase} ${sortBy ? pillActive : pillDefault}`}>
                {sortBy === "price-asc" ? <ArrowUp className="h-3.5 w-3.5" /> : sortBy === "price-desc" ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUpDown className="h-3.5 w-3.5" />}
                {sortBy === "price-asc" ? "Price: Low to High" : sortBy === "price-desc" ? "Price: High to Low" : sortBy === "recent" ? "Most Recent" : sortBy === "oldest" ? "Least Recent" : "Sort"}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "sort" ? "rotate-180" : ""}`} />
              </button>
              {openFilter === "sort" && (
                <div className="absolute right-0 top-full z-30 mt-1.5 min-w-48 rounded-2xl border border-stone/15 bg-white p-2 shadow-lg">
                  {([{ value: "recent", label: "Most Recent" }, { value: "oldest", label: "Least Recent" }, { value: "price-asc", label: "Price: Low to High" }, { value: "price-desc", label: "Price: High to Low" }] as const).map(({ value, label }) => (
                    <button key={label} onClick={() => { setSortBy(value); setOpenFilter(null); }} className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-colors ${sortBy === value ? "bg-clay-pale font-medium text-clay" : "text-soil hover:bg-petal"}`}>{label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: full pills row */}
          <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
            <div className="relative z-20 shrink-0">
              <button onClick={() => toggleFilter("availability")} className={`${pillBase} ${availability !== "available" ? pillActive : pillDefault}`}>
                {availability === "available" ? "Availability" : availability === "unavailable" ? "Unavailable" : "All listings"}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "availability" ? "rotate-180" : ""}`} />
              </button>
              {openFilter === "availability" && (
                <div className="absolute left-0 top-full z-30 mt-1.5 min-w-45 rounded-2xl border border-stone/15 bg-white p-2 shadow-lg">
                  {([{ value: "available", label: "Available" }, { value: "unavailable", label: "Unavailable" }, { value: "all", label: "All listings" }] as const).map(({ value, label }) => (
                    <button key={value} onClick={() => { setAvailability(value); setOpenFilter(null); }} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${availability === value ? "bg-fern-pale font-medium text-fern" : "text-soil hover:bg-petal"}`}>
                      <span className={`h-2 w-2 rounded-full border ${availability === value ? "border-fern bg-fern" : "border-stone/40"}`} />{label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative z-20 shrink-0">
              <button onClick={() => toggleFilter("color")} className={`${pillBase} ${selectedColors.length > 0 ? pillActive : pillDefault}`}>
                {selectedColors.length > 0 ? `Color (${selectedColors.length})` : "Color"}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "color" ? "rotate-180" : ""}`} />
              </button>
              {openFilter === "color" && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-64 rounded-2xl border border-stone/15 bg-white p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-stone">Color</span>
                    {selectedColors.length > 0 && <button onClick={() => setSelectedColors([])} className="text-xs text-stone hover:text-clay">Clear</button>}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_OPTIONS.map(({ key, label, hex }) => (
                      <button key={key} onClick={() => toggleColor(key)} className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${selectedColors.includes(key) ? "bg-fern-pale" : "hover:bg-petal"}`}>
                        <span style={{ backgroundColor: hex }} className={`h-7 w-7 rounded-full border-2 transition-all ${selectedColors.includes(key) ? "border-fern shadow-sm" : key === "white" ? "border-stone/30" : "border-transparent"}`} />
                        <span className={`text-[11px] font-medium ${selectedColors.includes(key) ? "text-fern" : "text-stone"}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative z-20 shrink-0">
              <button onClick={() => toggleFilter("island")} className={`${pillBase} ${selectedIslands.length > 0 ? pillActive : pillDefault}`}>
                {selectedIslands.length > 0 ? `Island (${selectedIslands.length})` : "Island"}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "island" ? "rotate-180" : ""}`} />
              </button>
              {openFilter === "island" && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-64 rounded-2xl border border-stone/15 bg-white p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-stone">Island</span>
                    {selectedIslands.length > 0 && <button onClick={() => setSelectedIslands([])} className="text-xs text-stone hover:text-clay">Clear</button>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ISLANDS.map((isle) => (
                      <button key={isle} onClick={() => toggleIsland(isle)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${selectedIslands.includes(isle) ? "bg-soil text-white" : "bg-stone/8 text-soil hover:bg-stone/15"}`}>{isle}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative z-20 shrink-0">
              <button onClick={() => toggleFilter("farm")} className={`${pillBase} ${selectedFarms.length > 0 ? pillActive : pillDefault}`}>
                {selectedFarms.length > 0 ? `Farm (${selectedFarms.length})` : "Farm"}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "farm" ? "rotate-180" : ""}`} />
              </button>
              {openFilter === "farm" && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-64 rounded-2xl border border-stone/15 bg-white p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-stone">Farm</span>
                    {selectedFarms.length > 0 && <button onClick={() => setSelectedFarms([])} className="text-xs text-stone hover:text-clay">Clear</button>}
                  </div>
                  <div className="space-y-0.5">
                    {MOCK_FARMS.map((farm) => (
                      <button key={farm.id} onClick={() => toggleFarm(farm.id)} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${selectedFarms.includes(farm.id) ? "bg-fern-pale font-medium text-fern" : "text-soil hover:bg-petal"}`}>
                        <span className={`h-2 w-2 rounded border ${selectedFarms.includes(farm.id) ? "border-fern bg-fern" : "border-stone/40"}`} />
                        <span className="text-left">
                          <span className="block leading-tight">{farm.business_name}</span>
                          <span className={`text-[11px] ${selectedFarms.includes(farm.id) ? "text-fern/70" : "text-stone"}`}>{farm.island}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {hasActiveFilters && (
              <button onClick={clearAll} className="flex items-center gap-1 px-1 text-sm text-stone hover:text-clay">
                <X className="h-3.5 w-3.5" />Clear all
              </button>
            )}
            <div className="relative shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-56 pl-9" />
            </div>
            <div className="relative z-20 ml-auto shrink-0">
              <button onClick={() => toggleFilter("sort")} className={`${pillBase} ${sortBy ? pillActive : pillDefault}`}>
                {sortBy === "price-asc" ? <ArrowUp className="h-3.5 w-3.5" /> : sortBy === "price-desc" ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUpDown className="h-3.5 w-3.5" />}
                {sortBy === "price-asc" ? "Price: Low to High" : sortBy === "price-desc" ? "Price: High to Low" : sortBy === "recent" ? "Most Recent" : sortBy === "oldest" ? "Least Recent" : "Sort"}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "sort" ? "rotate-180" : ""}`} />
              </button>
              {openFilter === "sort" && (
                <div className="absolute right-0 top-full z-30 mt-1.5 min-w-48 rounded-2xl border border-stone/15 bg-white p-2 shadow-lg">
                  {([{ value: "recent", label: "Most Recent" }, { value: "oldest", label: "Least Recent" }, { value: "price-asc", label: "Price: Low to High" }, { value: "price-desc", label: "Price: High to Low" }] as const).map(({ value, label }) => (
                    <button key={label} onClick={() => { setSortBy(value); setOpenFilter(null); }} className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-colors ${sortBy === value ? "bg-clay-pale font-medium text-clay" : "text-soil hover:bg-petal"}`}>{label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-stone">
            No listings match your filters.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: i * 0.04 }}
              >
                <ListingCard listing={listing} hidePricing showLoginButton />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter bottom sheet */}
      <AnimatePresence>
        {filterSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setFilterSheetOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-xl"
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-stone/20" />
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <h2 className="font-medium text-soil">Filters</h2>
                <button onClick={() => setFilterSheetOpen(false)} className="rounded-full p-1 text-stone hover:bg-petal">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[65vh] space-y-6 overflow-y-auto px-5 pb-4">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Availability</p>
                  <div className="flex flex-wrap gap-2">
                    {([{ value: "available", label: "Available" }, { value: "unavailable", label: "Unavailable" }, { value: "all", label: "All listings" }] as const).map(({ value, label }) => (
                      <button key={value} onClick={() => setAvailability(value)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${availability === value ? "border-soil bg-soil text-white" : "border-stone/30 text-soil"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Color</p>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_OPTIONS.map(({ key, label, hex }) => (
                      <button key={key} onClick={() => toggleColor(key)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${selectedColors.includes(key) ? "bg-fern-pale" : "hover:bg-petal"}`}>
                        <span style={{ backgroundColor: hex }} className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColors.includes(key) ? "border-fern shadow-sm" : key === "white" ? "border-stone/30" : "border-transparent"}`} />
                        <span className={`text-[11px] font-medium ${selectedColors.includes(key) ? "text-fern" : "text-stone"}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Island</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ISLANDS.map((isle) => (
                      <button key={isle} onClick={() => toggleIsland(isle)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${selectedIslands.includes(isle) ? "bg-soil text-white" : "bg-stone/8 text-soil hover:bg-stone/15"}`}>
                        {isle}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Farm</p>
                  <div className="space-y-0.5">
                    {MOCK_FARMS.map((farm) => (
                      <button key={farm.id} onClick={() => toggleFarm(farm.id)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${selectedFarms.includes(farm.id) ? "bg-fern-pale font-medium text-fern" : "text-soil hover:bg-petal"}`}>
                        <span className={`h-2 w-2 rounded border ${selectedFarms.includes(farm.id) ? "border-fern bg-fern" : "border-stone/40"}`} />
                        <span className="text-left">
                          <span className="block leading-tight">{farm.business_name}</span>
                          <span className={`text-[11px] ${selectedFarms.includes(farm.id) ? "text-fern/70" : "text-stone"}`}>{farm.island}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-border px-5 py-4">
                {hasActiveFilters && (
                  <button onClick={clearAll} className="text-sm text-stone hover:text-clay">Clear all</button>
                )}
                <Button className="ml-auto rounded-full bg-fern text-white hover:bg-fern/90" onClick={() => setFilterSheetOpen(false)}>
                  Show results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
