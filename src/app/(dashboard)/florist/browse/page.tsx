"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBasket } from "lucide-react";
import { getActiveListings, MOCK_FLORISTS } from "@/lib/mock-data";
import type { Listing, Island } from "@/types/database";
import { ListingCard } from "@/components/farm/listing-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/shared/page-transition";

const DEMO_FLORIST = MOCK_FLORISTS[0];

const ISLANDS: Island[] = [
  "Oahu",
  "Maui",
  "Big Island",
  "Kauai",
  "Molokai",
  "Lanai",
];

type CartItem = { listing: Listing; quantity: number };

export default function FloristBrowsePage() {
  const [search, setSearch] = useState("");
  const [island, setIsland] = useState<Island | "all">("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [requestListing, setRequestListing] = useState<Listing | null>(null);
  const [requestQty, setRequestQty] = useState("1");
  const [requestNotes, setRequestNotes] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const allActive = getActiveListings();

  const filtered = allActive.filter((listing) => {
    const matchesSearch =
      listing.flower_name.toLowerCase().includes(search.toLowerCase()) ||
      listing.variety?.toLowerCase().includes(search.toLowerCase()) ||
      listing.color?.toLowerCase().includes(search.toLowerCase());
    const matchesIsland =
      island === "all" || listing.farm?.island === island;
    return matchesSearch && matchesIsland;
  });

  function openRequest(listing: Listing) {
    setRequestListing(listing);
    setRequestQty("1");
    setRequestNotes("");
    setRequestDate("");
    setSubmitted(false);
  }

  function handleSubmitRequest() {
    if (!requestListing || !requestDate) return;
    setCart((prev) => {
      const exists = prev.find((i) => i.listing.id === requestListing.id);
      if (exists) {
        return prev.map((i) =>
          i.listing.id === requestListing.id
            ? { ...i, quantity: i.quantity + Number(requestQty) }
            : i
        );
      }
      return [...prev, { listing: requestListing, quantity: Number(requestQty) }];
    });
    setSubmitted(true);
  }

  const cartTotal = cart.reduce(
    (sum, { listing, quantity }) => sum + listing.price_per_unit * quantity,
    0
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-normal text-soil">Browse Flowers</h1>
            <p className="mt-1 text-sm text-stone">
              {DEMO_FLORIST.business_name} · {DEMO_FLORIST.island}
            </p>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-clay/30 bg-clay-pale px-4 py-2 text-sm font-medium text-clay">
              <ShoppingBasket className="h-4 w-4" />
              {cart.length} item{cart.length !== 1 ? "s" : ""} requested ·{" "}
              ${cartTotal.toFixed(2)} est.
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            <Input
              placeholder="Search by flower, variety, or color..."
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

        {/* Cart summary */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-xl border border-clay/20 bg-clay-pale p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-soil">Requested items</h3>
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-stone hover:text-clay"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cart.map(({ listing, quantity }) => (
                  <Badge
                    key={listing.id}
                    variant="outline"
                    className="border-clay/30 bg-white text-sm text-soil"
                  >
                    {listing.flower_name} × {quantity}
                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.filter((i) => i.listing.id !== listing.id)
                        )
                      }
                      className="ml-1.5 text-stone hover:text-clay"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-stone">
            No listings match your search.
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
                <ListingCard
                  listing={listing}
                  showRequestButton
                  onRequest={openRequest}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Request order dialog */}
      <Dialog
        open={requestListing !== null}
        onOpenChange={(open) => !open && setRequestListing(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request order</DialogTitle>
          </DialogHeader>

          {!submitted ? (
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-petal p-3 text-sm">
                <div className="font-semibold text-soil">
                  {requestListing?.flower_name}
                </div>
                {requestListing?.variety && (
                  <div className="text-stone">{requestListing.variety}</div>
                )}
                <div className="mt-1 text-clay font-medium">
                  ${requestListing?.price_per_unit.toFixed(2)}/
                  {requestListing?.unit}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qty">Quantity ({requestListing?.unit}s) *</Label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  max={requestListing?.qty_available}
                  value={requestQty}
                  onChange={(e) => setRequestQty(e.target.value)}
                />
                {requestListing && (
                  <p className="text-xs text-stone">
                    {requestListing.qty_available} available ·{" "}
                    <span className="font-medium text-clay">
                      Est. ${(
                        Number(requestQty) * requestListing.price_per_unit
                      ).toFixed(2)}
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="req-date">Pickup date *</Label>
                <Input
                  id="req-date"
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  placeholder="Any special instructions..."
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setRequestListing(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!requestDate || Number(requestQty) < 1}
                  className="bg-clay text-white hover:bg-clay/90"
                >
                  Send request
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fern-pale">
                <ShoppingBasket className="h-6 w-6 text-fern" />
              </div>
              <div>
                <p className="font-semibold text-soil">Request sent!</p>
                <p className="mt-1 text-sm text-stone">
                  {requestListing?.farm?.business_name} will confirm your order
                  shortly. Payment is handled directly with the farm.
                </p>
              </div>
              <Button
                className="rounded-full bg-fern text-white hover:bg-fern/90"
                onClick={() => setRequestListing(null)}
              >
                Continue browsing
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
