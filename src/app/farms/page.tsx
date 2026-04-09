"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_FARMS } from "@/lib/mock-data";
import { FarmCard } from "@/components/farm/farm-card";
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

type ActiveFilter = "island" | "sort" | null;
type SortBy = "az" | "za" | "";

export default function FarmsPage() {
  const [search, setSearch] = useState("");
  const [selectedIslands, setSelectedIslands] = useState<Island[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("");
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

  const hasActiveFilters = !!search || selectedIslands.length > 0 || sortBy !== "";

  function clearAll() {
    setSearch("");
    setSelectedIslands([]);
    setSortBy("");
    setOpenFilter(null);
  }

  const filtered = MOCK_FARMS
    .filter((farm) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        farm.business_name.toLowerCase().includes(s) ||
        farm.specialties.some((sp) => sp.toLowerCase().includes(s))
      );
    })
    .filter((farm) => {
      if (selectedIslands.length === 0) return true;
      return selectedIslands.includes(farm.island);
    })
    .sort((a, b) => {
      if (sortBy === "az") return a.business_name.localeCompare(b.business_name);
      if (sortBy === "za") return b.business_name.localeCompare(a.business_name);
      return 0;
    });

  const pillBase =
    "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors select-none cursor-pointer";
  const pillDefault = "border-stone/30 bg-white text-soil hover:border-stone/50";
  const pillActive = "border-soil bg-soil text-white";

  const sortLabel =
    sortBy === "az" ? "A → Z" : sortBy === "za" ? "Z → A" : "Sort";

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-soil">Farm Directory</h1>
          <p className="mt-1 text-sm text-stone">
            {MOCK_FARMS.length} farms growing flowers across the Hawaiian Islands
          </p>
        </div>

        {/* Search + Filter/Sort bar */}
        <div className="relative z-20 mb-8">
          {openFilter && (
            <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
          )}

          {/* Mobile: search row */}
          <div className="relative mb-2 sm:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9"
            />
          </div>

          {/* Mobile: Filters button + Sort */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setFilterSheetOpen(true)}
              className={`${pillBase} ${selectedIslands.length > 0 ? pillActive : pillDefault}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {selectedIslands.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
                  {selectedIslands.length}
                </span>
              )}
            </button>
            <div className="relative z-20 ml-auto shrink-0">
              <button
                onClick={() => toggleFilter("sort")}
                className={`${pillBase} ${sortBy ? pillActive : pillDefault}`}
              >
                {sortBy === "az" ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : sortBy === "za" ? (
                  <ArrowDown className="h-3.5 w-3.5" />
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5" />
                )}
                {sortLabel}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "sort" ? "rotate-180" : ""}`}
                />
              </button>
              {openFilter === "sort" && (
                <div className="absolute right-0 top-full z-30 mt-1.5 min-w-40 rounded-2xl border border-stone/15 bg-white p-2 shadow-lg">
                  {(
                    [
                      { value: "az", label: "A → Z" },
                      { value: "za", label: "Z → A" },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => { setSortBy(value); setOpenFilter(null); }}
                      className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-colors ${sortBy === value ? "bg-clay-pale font-medium text-clay" : "text-soil hover:bg-petal"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: full pills row */}
          <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
            {/* Island filter */}
            <div className="relative z-20 shrink-0">
              <button
                onClick={() => toggleFilter("island")}
                className={`${pillBase} ${selectedIslands.length > 0 ? pillActive : pillDefault}`}
              >
                {selectedIslands.length > 0 ? `Island (${selectedIslands.length})` : "Island"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "island" ? "rotate-180" : ""}`}
                />
              </button>
              {openFilter === "island" && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-64 rounded-2xl border border-stone/15 bg-white p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-stone">Island</span>
                    {selectedIslands.length > 0 && (
                      <button onClick={() => setSelectedIslands([])} className="text-xs text-stone hover:text-clay">
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ISLANDS.map((isle) => (
                      <button
                        key={isle}
                        onClick={() => toggleIsland(isle)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${selectedIslands.includes(isle) ? "bg-soil text-white" : "bg-stone/8 text-soil hover:bg-stone/15"}`}
                      >
                        {isle}
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

            {/* Search */}
            <div className="relative shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
              <Input
                placeholder="Search farms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-9"
              />
            </div>

            {/* Sort — pushed right */}
            <div className="relative z-20 ml-auto shrink-0">
              <button
                onClick={() => toggleFilter("sort")}
                className={`${pillBase} ${sortBy ? pillActive : pillDefault}`}
              >
                {sortBy === "az" ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : sortBy === "za" ? (
                  <ArrowDown className="h-3.5 w-3.5" />
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5" />
                )}
                {sortLabel}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${openFilter === "sort" ? "rotate-180" : ""}`}
                />
              </button>
              {openFilter === "sort" && (
                <div className="absolute right-0 top-full z-30 mt-1.5 min-w-40 rounded-2xl border border-stone/15 bg-white p-2 shadow-lg">
                  {(
                    [
                      { value: "az", label: "A → Z" },
                      { value: "za", label: "Z → A" },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => { setSortBy(value); setOpenFilter(null); }}
                      className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm transition-colors ${sortBy === value ? "bg-clay-pale font-medium text-clay" : "text-soil hover:bg-petal"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-stone">No farms match your filters.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((farm, i) => (
              <motion.div
                key={farm.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
              >
                <FarmCard farm={farm} />
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
                <button
                  onClick={() => setFilterSheetOpen(false)}
                  className="rounded-full p-1 text-stone hover:bg-petal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[65vh] space-y-6 overflow-y-auto px-5 pb-4">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone">Island</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ISLANDS.map((isle) => (
                      <button
                        key={isle}
                        onClick={() => toggleIsland(isle)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${selectedIslands.includes(isle) ? "bg-soil text-white" : "bg-stone/8 text-soil hover:bg-stone/15"}`}
                      >
                        {isle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-border px-5 py-4">
                {hasActiveFilters && (
                  <button onClick={clearAll} className="text-sm text-stone hover:text-clay">
                    Clear all
                  </button>
                )}
                <Button
                  className="ml-auto rounded-full bg-fern text-white hover:bg-fern/90"
                  onClick={() => setFilterSheetOpen(false)}
                >
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
