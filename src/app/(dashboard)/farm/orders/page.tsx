"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MOCK_FARMS, getOrdersByFarm } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/page-transition";

const DEMO_FARM = MOCK_FARMS[0];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-fern-pale text-fern border-fern/20",
  declined: "bg-red-50 text-red-600 border-red-200",
  fulfilled: "bg-stone/10 text-stone border-border",
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={STATUS_STYLES[status] + " capitalize"}
    >
      {status}
    </Badge>
  );
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-petal/60"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-medium text-soil truncate">
            {order.florist?.business_name}
          </span>
          <span className="text-xs text-stone">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-sm font-semibold text-clay">
            ${order.total_price.toFixed(2)}
          </span>
          <OrderStatusBadge status={status} />
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-stone" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-stone" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-4">
              {/* Items */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone">
                    <th className="pb-2 font-medium">Flower</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Unit price</th>
                    <th className="pb-2 font-medium text-right">Subtotal</th>
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
                          <div className="text-xs text-stone">{item.listing.variety}</div>
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

              {/* Pickup date + notes */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone">
                <span>
                  <span className="font-medium text-soil">Pickup date:</span>{" "}
                  {new Date(order.requested_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {order.notes && (
                  <span>
                    <span className="font-medium text-soil">Note:</span>{" "}
                    {order.notes}
                  </span>
                )}
              </div>

              {/* Contact */}
              {order.florist && (
                <div className="mt-3 text-sm text-stone">
                  <span className="font-medium text-soil">Contact:</span>{" "}
                  <a
                    href={`mailto:${order.florist.contact_email}`}
                    className="hover:text-fern hover:underline"
                  >
                    {order.florist.contact_email}
                  </a>
                  {order.florist.phone && ` · ${order.florist.phone}`}
                </div>
              )}

              {/* Actions for pending orders */}
              {status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="bg-fern text-white hover:bg-fern/90 rounded-full"
                    onClick={() => setStatus("confirmed")}
                  >
                    Confirm order
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => setStatus("declined")}
                  >
                    Decline
                  </Button>
                </div>
              )}
              {status === "confirmed" && (
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-fern/30 text-fern hover:bg-fern-pale"
                    onClick={() => setStatus("fulfilled")}
                  >
                    Mark as fulfilled
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FarmOrdersPage() {
  const orders = getOrdersByFarm(DEMO_FARM.id);

  const pending = orders.filter((o) => o.status === "pending");
  const active = orders.filter((o) =>
    ["confirmed", "pending"].includes(o.status)
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-soil">Incoming Orders</h1>
          <p className="mt-1 text-sm text-stone">
            {DEMO_FARM.business_name} ·{" "}
            {pending.length > 0 ? (
              <span className="font-medium text-clay">
                {pending.length} pending action
                {pending.length !== 1 ? "s" : ""}
              </span>
            ) : (
              "No orders awaiting action"
            )}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center text-stone">No orders yet.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
