"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_FARMS } from "@/lib/mock-data";
import { FarmCard } from "@/components/farm/farm-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function FarmsPage() {
  const [search, setSearch] = useState("");
  const [island, setIsland] = useState<Island | "all">("all");

  const filtered = MOCK_FARMS.filter((farm) => {
    const matchesSearch =
      farm.business_name.toLowerCase().includes(search.toLowerCase()) ||
      farm.specialties.some((s) =>
        s.toLowerCase().includes(search.toLowerCase())
      );
    const matchesIsland = island === "all" || farm.island === island;
    return matchesSearch && matchesIsland;
  });

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-soil">Farm Directory</h1>
          <p className="mt-2 text-stone">
            {MOCK_FARMS.length} farms growing flowers across the Hawaiian Islands
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            <Input
              placeholder="Search by farm name or flower type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={island}
            onValueChange={(v) => setIsland(v as Island | "all")}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All islands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All islands</SelectItem>
              {ISLANDS.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-stone">
            No farms match your search.
          </div>
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
    </PageTransition>
  );
}
