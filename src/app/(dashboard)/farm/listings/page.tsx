"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { MOCK_FARMS, getListingsByFarm } from "@/lib/mock-data";
import type { Listing } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageTransition } from "@/components/shared/page-transition";

const DEMO_FARM = MOCK_FARMS[0];

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge className="bg-fern-pale text-fern hover:bg-fern-pale">Active</Badge>
  ) : (
    <Badge variant="outline" className="text-stone">
      Inactive
    </Badge>
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
};

export default function FarmListingsPage() {
  const initialListings = getListingsByFarm(DEMO_FARM.id);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const activeCt = listings.filter((l) => l.is_active).length;

  function openNew() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
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
    });
    setDialogOpen(true);
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
        photo_url: null,
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

  function deleteListing(id: string) {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-soil">My Listings</h1>
            <p className="mt-1 text-sm text-stone">
              {DEMO_FARM.business_name} · {DEMO_FARM.island} ·{" "}
              <span className="text-fern font-medium">{activeCt} active</span>
              {" / "}
              {listings.length} total
            </p>
          </div>
          <Button
            onClick={openNew}
            className="bg-fern text-white hover:bg-fern/90 rounded-full"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New listing
          </Button>
        </div>

        {/* Table */}
        {listings.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center text-stone">
            <p>No listings yet.</p>
            <Button onClick={openNew} variant="outline" className="rounded-full">
              Add your first listing
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-petal text-left">
                  <th className="px-4 py-3 font-medium text-stone">Flower</th>
                  <th className="px-4 py-3 font-medium text-stone">Color</th>
                  <th className="px-4 py-3 font-medium text-stone">Qty</th>
                  <th className="px-4 py-3 font-medium text-stone">Price</th>
                  <th className="px-4 py-3 font-medium text-stone">Ready</th>
                  <th className="px-4 py-3 font-medium text-stone">Status</th>
                  <th className="px-4 py-3 font-medium text-stone" />
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, i) => (
                  <motion.tr
                    key={listing.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-petal/60"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-soil">{listing.flower_name}</div>
                      {listing.variety && (
                        <div className="text-xs text-stone">{listing.variety}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone">{listing.color ?? "—"}</td>
                    <td className="px-4 py-3 text-stone">
                      {listing.qty_available} {listing.unit}s
                    </td>
                    <td className="px-4 py-3 font-medium text-clay">
                      ${listing.price_per_unit.toFixed(2)}/{listing.unit}
                    </td>
                    <td className="px-4 py-3 text-stone">
                      {new Date(listing.ready_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge active={listing.is_active} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleActive(listing.id)}
                          title={listing.is_active ? "Deactivate" : "Activate"}
                          className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-fern"
                        >
                          {listing.is_active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(listing)}
                          className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-fern"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteListing(listing.id)}
                          className="rounded p-1.5 text-stone transition-colors hover:bg-petal hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
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
