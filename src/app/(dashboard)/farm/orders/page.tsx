"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { MOCK_FARMS, getOrdersByFarm } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/page-transition";

const DEMO_FARM = MOCK_FARMS[0];

type Tab = "pending" | "confirmed" | "fulfilled";

const DECLINE_REASONS = [
  "Insufficient inventory for requested quantity",
  "Variety unavailable on requested date",
  "Pickup date unavailable",
  "Farm closed on requested date",
  "Minimum order quantity not met",
  "Unable to fulfill at this time",
  "Other",
];

function OrderCard({
  order,
  onStatusChange,
  onRequestDecline,
}: {
  order: Order;
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
  onRequestDecline: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const isPending = order.status === "pending";
  const isConfirmed = order.status === "confirmed";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-sm">
      <div className="px-5 py-4">
        {/* Top row: florist + total */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="font-medium text-soil">
              {order.florist?.business_name}
            </div>
            <div className="mt-0.5 text-xs text-stone">
              Ordered{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-semibold text-clay">
              ${order.total_price.toFixed(2)}
            </div>
            <div className="mt-0.5 text-xs text-stone">
              Pickup{" "}
              {new Date(order.requested_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Bottom row: action buttons + details toggle */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isPending && (
              <>
                <Button
                  size="sm"
                  className="rounded-full bg-fern text-white hover:bg-fern/90"
                  onClick={() => onStatusChange(order.id, "confirmed")}
                >
                  Confirm order
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-red-200 text-red-500 hover:bg-red-50"
                  onClick={() => onRequestDecline(order.id)}
                >
                  Decline
                </Button>
              </>
            )}
            {isConfirmed && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-fern/30 text-fern hover:bg-fern-pale"
                onClick={() => onStatusChange(order.id, "fulfilled")}
              >
                Mark as fulfilled
              </Button>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-stone transition-colors hover:text-soil"
          >
            {expanded ? "Hide details" : "View details"}
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable detail panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border px-5 py-4">
              {/* Items breakdown */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone">
                    <th className="pb-2 font-medium">Flower</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Unit price</th>
                    <th className="pb-2 text-right font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item.id} className="border-t border-border/60">
                      <td className="py-2">
                        <div className="font-medium text-soil">
                          {item.listing?.flower_name}
                        </div>
                        {item.listing?.variety && (
                          <div className="text-xs text-stone">
                            {item.listing.variety}
                          </div>
                        )}
                      </td>
                      <td className="py-2 text-stone">
                        {item.quantity} {item.listing?.unit}s
                      </td>
                      <td className="py-2 text-stone">
                        ${item.unit_price.toFixed(2)}
                      </td>
                      <td className="py-2 text-right font-medium text-soil">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="pt-3 font-semibold text-soil">
                      Total
                    </td>
                    <td className="pt-3 text-right font-bold text-clay">
                      ${order.total_price.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Notes · contact */}
              <div className="space-y-1.5 text-sm text-stone">
                {order.notes && (
                  <div>
                    <span className="font-medium text-soil">Note: </span>
                    {order.notes}
                  </div>
                )}
                {order.florist && (
                  <div>
                    <span className="font-medium text-soil">Contact: </span>
                    <a
                      href={`mailto:${order.florist.contact_email}`}
                      className="hover:text-fern hover:underline"
                    >
                      {order.florist.contact_email}
                    </a>
                    {order.florist.phone && ` · ${order.florist.phone}`}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FarmOrdersPage() {
  const initialOrders = getOrdersByFarm(DEMO_FARM.id);
  const [orders, setOrders] = useState(initialOrders);
  const [declineTargetId, setDeclineTargetId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState(DECLINE_REASONS[0]);
  const [declineNote, setDeclineNote] = useState("");

  const orderToDecline = orders.find((o) => o.id === declineTargetId) ?? null;

  // Close modal on Escape
  useEffect(() => {
    if (!declineTargetId) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDeclineModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [declineTargetId]);

  function openDeclineModal(id: string) {
    setDeclineReason(DECLINE_REASONS[0]);
    setDeclineNote("");
    setDeclineTargetId(id);
  }

  function closeDeclineModal() {
    setDeclineTargetId(null);
    setDeclineReason(DECLINE_REASONS[0]);
    setDeclineNote("");
  }

  function handleConfirmDecline() {
    if (!declineTargetId) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === declineTargetId
          ? {
              ...o,
              status: "declined" as const,
              decline_reason: declineReason,
              decline_note: declineNote.trim() || null,
            }
          : o
      )
    );
    closeDeclineModal();
  }

  function handleStatusChange(id: string, newStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  }

  const counts: Record<Tab, number> = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    fulfilled: orders.filter((o) => o.status === "fulfilled").length,
  };

  const defaultTab: Tab =
    counts.pending > 0 ? "pending" : counts.confirmed > 0 ? "confirmed" : "fulfilled";

  const [tab, setTab] = useState<Tab>(defaultTab);

  const TABS: { key: Tab; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "fulfilled", label: "Fulfilled" },
  ];

  const visibleOrders = orders.filter((o) => o.status === tab);

  const EMPTY_MESSAGES: Record<Tab, string> = {
    pending: "You're all caught up — no orders waiting on you.",
    confirmed: "No confirmed orders right now.",
    fulfilled: "No fulfilled orders yet.",
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-stone">
            {DEMO_FARM.business_name}
          </p>
          <h1 className="mt-1 text-2xl font-normal text-soil">Orders</h1>
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex items-end gap-6 border-b border-border">
          {TABS.map(({ key, label }) => {
            const count = counts[key];
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 pb-2.5 text-sm transition-colors ${
                  tab === key
                    ? "border-b-2 border-soil font-medium text-soil"
                    : "text-stone hover:text-soil"
                }`}
              >
                {label}
                <span className="text-xs text-stone/50">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Orders */}
        {visibleOrders.length === 0 ? (
          <div className="py-20 text-center text-stone">
            {EMPTY_MESSAGES[tab]}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onRequestDecline={openDeclineModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decline modal */}
      <AnimatePresence>
        {declineTargetId && orderToDecline && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={closeDeclineModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="decline-dialog-title"
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 id="decline-dialog-title" className="text-base font-semibold text-soil">
                    Decline order
                  </h2>
                  <p className="mt-0.5 text-xs text-stone">
                    From {orderToDecline.florist?.business_name}
                  </p>
                </div>
                <button
                  onClick={closeDeclineModal}
                  aria-label="Close"
                  className="-mt-0.5 rounded-full p-1 text-stone transition-colors hover:bg-petal hover:text-soil"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Reason dropdown */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-soil">
                    Reason for declining
                  </label>
                  <div className="relative">
                    <select
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border bg-white py-2 pl-3 pr-10 text-sm text-soil focus:border-fern focus:outline-none focus:ring-1 focus:ring-fern"
                    >
                      {DECLINE_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
                  </div>
                </div>

                {/* Optional note */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-soil">
                    Additional note{" "}
                    <span className="font-normal text-stone">(optional)</span>
                  </label>
                  <textarea
                    value={declineNote}
                    onChange={(e) => setDeclineNote(e.target.value)}
                    placeholder="e.g. We expect new stock by next week — feel free to reorder."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-soil placeholder:text-stone/50 focus:border-fern focus:outline-none focus:ring-1 focus:ring-fern"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={closeDeclineModal}
                  className="flex-1 rounded-full border border-border py-2 text-sm font-medium text-soil transition-colors hover:bg-petal"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDecline}
                  className="flex-1 rounded-full bg-red-500 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                  Decline order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
