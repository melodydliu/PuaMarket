"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { MOCK_FLORISTS, getOrdersByFlorist } from "@/lib/mock-data";
import type { Order } from "@/types/database";
import { PageTransition } from "@/components/shared/page-transition";

const DEMO_FLORIST = MOCK_FLORISTS[0];

type Tab = "pending" | "confirmed" | "fulfilled" | "declined";

function OrderCard({
  order,
  onRequestCancel,
}: {
  order: Order;
  onRequestCancel: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const canCancel = order.status === "pending" || order.status === "confirmed";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-sm">
      <div className="px-5 py-4">
        {/* Top row: farm name + total */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="font-medium text-soil">
              {order.farm?.business_name}
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

        {/* Bottom row: details toggle */}
        <div className="mt-4 flex justify-end">
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

              {/* Pickup · Notes · Contact */}
              <div className="space-y-1.5 text-sm text-stone">
                <div>
                  <span className="font-medium text-soil">Pickup: </span>
                  {new Date(order.requested_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                {order.notes && (
                  <div>
                    <span className="font-medium text-soil">Your note: </span>
                    {order.notes}
                  </div>
                )}
                {order.farm && (
                  <div>
                    <span className="font-medium text-soil">Farm contact: </span>
                    <a
                      href={`mailto:${order.farm.contact_email}`}
                      className="hover:text-fern hover:underline"
                    >
                      {order.farm.contact_email}
                    </a>
                    {order.farm.phone && ` · ${order.farm.phone}`}
                  </div>
                )}
              </div>

              {order.status === "declined" && (
                <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600 space-y-1">
                  <p className="font-medium">This order was declined by the farm.</p>
                  {order.decline_reason && (
                    <p>
                      <span className="font-medium">Reason: </span>
                      {order.decline_reason}
                    </p>
                  )}
                  {order.decline_note && (
                    <p>
                      <span className="font-medium">Note: </span>
                      {order.decline_note}
                    </p>
                  )}
                  <p className="text-xs text-red-400 pt-0.5">
                    Please contact the farm directly or browse other listings.
                  </p>
                </div>
              )}

              {canCancel && (
                <div>
                  <button
                    onClick={() => onRequestCancel(order.id)}
                    className="text-xs text-stone/50 transition-colors hover:text-stone"
                  >
                    Cancel order
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FloristOrdersPage() {
  const initialOrders = getOrdersByFlorist(DEMO_FLORIST.id);
  const [orders, setOrders] = useState(initialOrders);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const orderToCancel = orders.find((o) => o.id === cancelConfirmId) ?? null;

  // Close dialog on Escape
  useEffect(() => {
    if (!cancelConfirmId) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setCancelConfirmId(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cancelConfirmId]);

  function handleConfirmCancel() {
    if (!cancelConfirmId) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === cancelConfirmId ? { ...o, status: "cancelled" as const } : o
      )
    );
    setCancelConfirmId(null);
  }

  const counts: Record<Tab, number> = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    fulfilled: orders.filter((o) => o.status === "fulfilled").length,
    declined: orders.filter((o) => o.status === "declined").length,
  };

  const defaultTab: Tab =
    counts.pending > 0
      ? "pending"
      : counts.confirmed > 0
      ? "confirmed"
      : "fulfilled";

  const [tab, setTab] = useState<Tab>(defaultTab);

  const TABS: { key: Tab; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "fulfilled", label: "Fulfilled" },
    { key: "declined", label: "Declined" },
  ];

  const visibleOrders = orders.filter((o) => o.status === tab);

  const EMPTY_MESSAGES: Record<Tab, string> = {
    pending: "No orders waiting on a response.",
    confirmed: "No confirmed orders right now.",
    fulfilled: "No fulfilled orders yet.",
    declined: "No declined orders.",
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-stone">
            {DEMO_FLORIST.business_name}
          </p>
          <h1 className="mt-1 text-2xl font-normal text-soil">My Orders</h1>
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
                onRequestCancel={setCancelConfirmId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirmation dialog */}
      <AnimatePresence>
        {cancelConfirmId && orderToCancel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setCancelConfirmId(null)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-dialog-title"
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
            >
              {/* Dialog header */}
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2
                  id="cancel-dialog-title"
                  className="text-base font-semibold text-soil"
                >
                  {orderToCancel.status === "confirmed"
                    ? "Unable to cancel"
                    : "Cancel this order?"}
                </h2>
                <button
                  onClick={() => setCancelConfirmId(null)}
                  aria-label="Close"
                  className="-mt-0.5 rounded-full p-1 text-stone transition-colors hover:bg-petal hover:text-soil"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {orderToCancel.status === "confirmed" ? (
                /* Confirmed — informational only, no actions */
                <p className="rounded-lg bg-yellow-50 px-3 py-2.5 text-sm text-yellow-700">
                  This order has already been confirmed by the farm. Please
                  contact them directly if you need to cancel.
                </p>
              ) : (
                /* Pending — full cancel flow */
                <>
                  <p className="text-sm text-stone">
                    Your order from{" "}
                    <span className="font-medium text-soil">
                      {orderToCancel.farm?.business_name}
                    </span>{" "}
                    totalling{" "}
                    <span className="font-medium text-soil">
                      ${orderToCancel.total_price.toFixed(2)}
                    </span>{" "}
                    will be cancelled. The farm will be notified.
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => setCancelConfirmId(null)}
                      className="flex-1 rounded-full border border-border py-2 text-sm font-medium text-soil transition-colors hover:bg-petal"
                    >
                      Keep order
                    </button>
                    <button
                      onClick={handleConfirmCancel}
                      className="flex-1 rounded-full bg-red-500 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                    >
                      Cancel order
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
