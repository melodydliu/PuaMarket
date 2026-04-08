"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, ChevronDown, ChevronUp, ChevronsUpDown, Copy, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { MOCK_FARMS, getListingsByFarm } from "@/lib/mock-data";
import type { Listing } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageTransition } from "@/components/shared/page-transition";

const DEMO_FARM = MOCK_FARMS[0];

type SortKey = "flower_name" | "color" | "qty_available" | "price_per_unit" | "ready_date" | "is_active";
type SortDir = "asc" | "desc";

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 opacity-40" />;
  return sortDir === "asc"
    ? <ChevronUp className="ml-1 inline h-3.5 w-3.5 text-fern" />
    : <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-fern" />;
}

function sortListings(listings: Listing[], key: SortKey | null, dir: SortDir): Listing[] {
  if (!key) return listings;
  return [...listings].sort((a, b) => {
    let av = a[key];
    let bv = b[key];
    // Nulls always last
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });
}

function ListingCards({
  listings,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  listings: Listing[];
  onToggle: (id: string) => void;
  onEdit: (listing: Listing) => void;
  onDuplicate: (listing: Listing) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className={`overflow-hidden rounded-xl border border-border bg-white transition-opacity ${
            !listing.is_active ? "opacity-60" : ""
          }`}
        >
          <div className="flex items-start gap-3 p-4">
            {/* Photo */}
            {listing.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.photo_url}
                alt={listing.flower_name}
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-fern-pale">
                <Camera className="h-5 w-5 text-fern/40" />
              </div>
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-soil">{listing.flower_name}</div>
                  {listing.variety && (
                    <div className="text-xs text-stone">{listing.variety}</div>
                  )}
                  {listing.color && (
                    <div className="text-xs text-stone">{listing.color}</div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-semibold text-clay">
                    ${listing.price_per_unit.toFixed(2)}/{listing.unit}
                  </div>
                  <div className="mt-0.5 text-xs text-stone">
                    {listing.qty_available} {listing.unit}s
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-stone">
                Ready{" "}
                {new Date(listing.ready_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Footer: toggle + actions */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Switch
                checked={listing.is_active}
                onCheckedChange={() => onToggle(listing.id)}
                aria-label={listing.is_active ? "Deactivate listing" : "Activate listing"}
              />
              <span className="text-xs text-stone">
                {listing.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => onEdit(listing)}
                className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-fern"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDuplicate(listing)}
                title="Duplicate listing"
                className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-fern"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(listing.id)}
                className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingsTable({
  listings,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  listings: Listing[];
  onToggle: (id: string) => void;
  onEdit: (listing: Listing) => void;
  onDuplicate: (listing: Listing) => void;
  onDelete: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(col: SortKey) {
    if (sortKey !== col) {
      setSortKey(col);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir("asc");
    }
  }

  const sorted = sortListings(listings, sortKey, sortDir);

  const thClass = "px-4 py-3 font-medium text-stone";
  const thCompactClass = "w-px whitespace-nowrap px-6 py-3 font-medium text-stone";
  const sortBtn = "cursor-pointer select-none hover:text-soil transition-colors";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-petal text-left">
            <th className={thClass}>
              <button className={sortBtn} onClick={() => handleSort("flower_name")}>
                Flower<SortIcon col="flower_name" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className={thCompactClass}>
              <button className={sortBtn} onClick={() => handleSort("color")}>
                Color<SortIcon col="color" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className={thCompactClass}>
              <button className={sortBtn} onClick={() => handleSort("qty_available")}>
                Qty<SortIcon col="qty_available" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className={thCompactClass}>
              <button className={sortBtn} onClick={() => handleSort("price_per_unit")}>
                Price<SortIcon col="price_per_unit" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className={thCompactClass}>
              <button className={sortBtn} onClick={() => handleSort("ready_date")}>
                Ready<SortIcon col="ready_date" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className={thCompactClass}>
              <button className={sortBtn} onClick={() => handleSort("is_active")}>
                Availability<SortIcon col="is_active" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((listing, i) => (
            <motion.tr
              key={listing.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`border-b border-border last:border-0 transition-colors ${
                listing.is_active
                  ? "hover:bg-petal/60"
                  : "bg-stone/5 hover:bg-stone/10"
              }`}
            >
              <td className={`px-4 py-3 transition-opacity ${!listing.is_active ? "opacity-40" : ""}`}>
                <div className="flex items-center gap-2.5">
                  {listing.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.photo_url}
                      alt={listing.flower_name}
                      className="h-9 w-9 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-fern-pale">
                      <Camera className="h-3.5 w-3.5 text-fern/40" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-soil">{listing.flower_name}</div>
                    {listing.variety && (
                      <div className="text-xs text-stone">{listing.variety}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className={`w-px whitespace-nowrap px-6 py-3 text-stone transition-opacity ${!listing.is_active ? "opacity-40" : ""}`}>{listing.color ?? "—"}</td>
              <td className={`w-px whitespace-nowrap px-6 py-3 text-stone transition-opacity ${!listing.is_active ? "opacity-40" : ""}`}>
                {listing.qty_available} {listing.unit}s
              </td>
              <td className={`w-px whitespace-nowrap px-6 py-3 font-medium text-clay transition-opacity ${!listing.is_active ? "opacity-40" : ""}`}>
                ${listing.price_per_unit.toFixed(2)}/{listing.unit}
              </td>
              <td className={`w-px whitespace-nowrap px-6 py-3 text-stone transition-opacity ${!listing.is_active ? "opacity-40" : ""}`}>
                {new Date(listing.ready_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="w-px whitespace-nowrap px-6 py-3">
                <div className="flex items-center gap-6">
                  <Switch
                    checked={listing.is_active}
                    onCheckedChange={() => onToggle(listing.id)}
                    aria-label={listing.is_active ? "Deactivate listing" : "Activate listing"}
                  />
                  <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => onEdit(listing)}
                    className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-fern"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDuplicate(listing)}
                    title="Duplicate listing"
                    className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-fern"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  </div>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const EMPTY_FORM = {
  flower_name: "",
  variety: "",
  color: "",
  qty_available: "",
  unit: "stem" as "stem" | "bunch",
  price_per_unit: "",
  ready_date: "",
  notes: "",
};

export default function FarmListingsPage() {
  const initialListings = getListingsByFarm(DEMO_FARM.id);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openNew() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setPhotoPreview(null);
    setDialogOpen(true);
  }

  function openEdit(listing: Listing) {
    setEditTarget(listing);
    setForm({
      flower_name: listing.flower_name,
      variety: listing.variety ?? "",
      color: listing.color ?? "",
      qty_available: String(listing.qty_available),
      unit: listing.unit,
      price_per_unit: String(listing.price_per_unit),
      ready_date: listing.ready_date,
      notes: listing.notes ?? "",
    });
    setPhotoPreview(listing.photo_url ?? null);
    setDialogOpen(true);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke previous object URL to avoid memory leaks
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(URL.createObjectURL(file));
    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  }

  function removePhoto() {
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
  }

  function handleSave() {
    if (!form.flower_name || !form.qty_available || !form.price_per_unit || !form.ready_date) return;
    if (editTarget) {
      setListings((prev) =>
        prev.map((l) =>
          l.id === editTarget.id
            ? {
                ...l,
                flower_name: form.flower_name,
                variety: form.variety || null,
                color: form.color || null,
                qty_available: Number(form.qty_available),
                unit: form.unit,
                price_per_unit: Number(form.price_per_unit),
                ready_date: form.ready_date,
                photo_url: photoPreview,
                notes: form.notes || null,
              }
            : l
        )
      );
    } else {
      const newListing: Listing = {
        id: `listing-new-${Date.now()}`,
        farm_id: DEMO_FARM.id,
        flower_name: form.flower_name,
        variety: form.variety || null,
        color: form.color || null,
        qty_available: Number(form.qty_available),
        unit: form.unit,
        price_per_unit: Number(form.price_per_unit),
        ready_date: form.ready_date,
        photo_url: photoPreview,
        notes: form.notes || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setListings((prev) => [newListing, ...prev]);
    }
    setDialogOpen(false);
  }

  function toggleActive(id: string) {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, is_active: !l.is_active } : l))
    );
  }

  function duplicateListing(listing: Listing) {
    const copy: Listing = {
      ...listing,
      id: `listing-new-${Date.now()}`,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setListings((prev) => {
      const idx = prev.findIndex((l) => l.id === listing.id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }

  function deleteListing(id: string) {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-stone">
              {DEMO_FARM.business_name}
            </p>
            <h1 className="mt-1 text-2xl font-normal text-soil">My Listings</h1>
          </div>
          <Button
            onClick={openNew}
            className="rounded-full bg-fern text-white hover:bg-fern/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New listing
          </Button>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center text-stone">
            <p>No listings yet.</p>
            <Button onClick={openNew} variant="outline" className="rounded-full">
              Add your first listing
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="lg:hidden">
              <ListingCards
                listings={listings}
                onToggle={toggleActive}
                onEdit={openEdit}
                onDuplicate={duplicateListing}
                onDelete={deleteListing}
              />
            </div>
            {/* Desktop: sortable table */}
            <div className="hidden lg:block">
              <ListingsTable
                listings={listings}
                onToggle={toggleActive}
                onEdit={openEdit}
                onDuplicate={duplicateListing}
                onDelete={deleteListing}
              />
            </div>
          </>
        )}
      </div>

      {/* New / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit listing" : "New listing"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* ── Photo upload ─────────────────────────────────── */}
            <div className="space-y-1.5">
              <Label>
                Photo{" "}
                <span className="font-normal text-stone">(optional)</span>
              </Label>

              {/* Hidden file input — accept all images, no capture forces
                  iOS to show "Take Photo / Photo Library / Files" sheet */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
              />

              {photoPreview ? (
                /* Preview */
                <div className="relative overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Listing preview"
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-end justify-between bg-linear-to-t from-black/40 to-transparent p-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-soil backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <ImagePlus className="h-3.5 w-3.5" />
                      Change photo
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-soil backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Upload tap target */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-petal py-8 text-stone transition-colors hover:border-fern/40 hover:bg-fern-pale/50 active:bg-fern-pale"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <Camera className="h-5 w-5 text-fern" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-soil">Add a photo</p>
                    <p className="mt-0.5 text-xs text-stone">
                      Camera, photo library, or files
                    </p>
                  </div>
                </button>
              )}
            </div>

            {/* ── Other fields ─────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="flower_name">Flower name *</Label>
                <Input
                  id="flower_name"
                  value={form.flower_name}
                  onChange={(e) => setForm({ ...form, flower_name: e.target.value })}
                  placeholder="e.g. King Protea"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  value={form.variety}
                  onChange={(e) => setForm({ ...form, variety: e.target.value })}
                  placeholder="e.g. Cynaroides"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="e.g. Cream & Pink"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qty">Qty available *</Label>
                <Input
                  id="qty"
                  type="number"
                  min={0}
                  value={form.qty_available}
                  onChange={(e) => setForm({ ...form, qty_available: e.target.value })}
                  placeholder="e.g. 120"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Unit *</Label>
                <Select
                  value={form.unit}
                  onValueChange={(v) => setForm({ ...form, unit: v as "stem" | "bunch" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stem">Stem</SelectItem>
                    <SelectItem value="bunch">Bunch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price per unit ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price_per_unit}
                  onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })}
                  placeholder="e.g. 4.50"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ready">Ready date *</Label>
                <Input
                  id="ready"
                  type="date"
                  value={form.ready_date}
                  onChange={(e) => setForm({ ...form, ready_date: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="notes">
                  Notes{" "}
                  <span className="font-normal text-stone">(optional · visible to florists)</span>
                </Label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Stems are long, fragrance is mild, available for pickup only"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-fern text-white hover:bg-fern/90"
              disabled={!form.flower_name || !form.qty_available || !form.price_per_unit || !form.ready_date}
            >
              {editTarget ? "Save changes" : "Create listing"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
