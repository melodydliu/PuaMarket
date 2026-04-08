"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MOCK_FARMS, getOrdersByFarm } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/page-transition";

const DEMO_FARM = MOCK_FARMS[0];

type Tab = "pending" | "confirmed" | "fulfilled";

function orderShortId(order: Order) {
  return `#${order.id.replace(/\D/g, "").padStart(4, "0")}`;
}

function itemsSummary(order: Order) {
  const items = order.items ?? [];
  if (items.length === 0) return "No items";
  if (items.length === 1)
    return items[0].listing?.flower_name ?? "1 item";
  return `${items.length} items`;
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const isPending = order.status === "pending";
  const isConfirmed = order.status === "confirmed";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-sm">

      <div className="px-5 py-4">
        {/* Top row: ID + date · florist + total */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-stone">
              <span className="font-mono">{orderShortId(order)}</span>
              <span>·</span>
              <span>
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="mt-0.5 font-medium text-soil">
              {order.florist?.business_name}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-semibold text-clay">
              ${order.total_price.toFixed(2)}
            </div>
            <div className="mt-0.5 text-xs text-stone">
              {itemsSummary(order)} · Pickup{" "}
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
                  onClick={() => onStatusChange(order.id, "declined")}
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

              {/* Pickup · notes · contact */}
              <div className="space-y-1.5 text-sm text-stone">
                <div>
                  <span className="font-medium text-soil">Pickup date: </span>
                  {new Date(order.requested_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
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

  const counts: Record<Tab, number> = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    fulfilled: orders.filter((o) => o.status === "fulfilled").length,
  };

  // Default to the most actionable tab
  const defaultTab: Tab =
    counts.pending > 0 ? "pending" : counts.confirmed > 0 ? "confirmed" : "fulfilled";

  const [tab, setTab] = useState<Tab>(defaultTab);

  function handleStatusChange(id: string, newStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  }

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
          <h1 className="text-2xl font-normal text-soil">Orders</h1>
          <p className="mt-1 text-sm text-stone">
            {DEMO_FARM.business_name}
            {counts.pending > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="font-medium text-soil">
                  {counts.pending} order{counts.pending !== 1 ? "s" : ""} waiting on you
                </span>
              </>
            )}
          </p>
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex gap-1 rounded-xl bg-petal p-1">
          {TABS.map(({ key, label }) => {
            const count = counts[key];
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === key
                    ? "bg-white text-soil shadow-sm"
                    : "text-stone hover:text-soil"
                }`}
              >
                {label}
                {count > 0 && (
                  <span
                    className="rounded-full bg-stone/10 px-1.5 py-0.5 text-xs font-semibold leading-none text-stone"
                  >
                    {count}
                  </span>
                )}
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
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
