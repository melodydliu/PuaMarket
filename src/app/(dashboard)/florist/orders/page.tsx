"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MOCK_FLORISTS, getOrdersByFlorist } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/shared/page-transition";

const DEMO_FLORIST = MOCK_FLORISTS[0];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-fern-pale text-fern border-fern/20",
  declined: "bg-red-50 text-red-600 border-red-200",
  fulfilled: "bg-stone/10 text-stone border-border",
};

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-petal/60"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-medium text-soil">
            {order.farm?.business_name}
          </span>
          <span className="text-xs text-stone">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-sm font-semibold text-clay">
            ${order.total_price.toFixed(2)}
          </span>
          <Badge
            variant="outline"
            className={STATUS_STYLES[order.status] + " capitalize"}
          >
            {order.status}
          </Badge>
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
                        {item.listing?.color && (
                          <div className="text-xs text-stone">
                            {item.listing.color}
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

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone">
                <span>
                  <span className="font-medium text-soil">Pickup:</span>{" "}
                  {new Date(order.requested_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {order.notes && (
                  <span>
                    <span className="font-medium text-soil">Your note:</span>{" "}
                    {order.notes}
                  </span>
                )}
              </div>

              {order.farm && (
                <div className="mt-3 text-sm text-stone">
                  <span className="font-medium text-soil">Farm contact:</span>{" "}
                  <a
                    href={`mailto:${order.farm.contact_email}`}
                    className="hover:text-fern hover:underline"
                  >
                    {order.farm.contact_email}
                  </a>
                  {order.farm.phone && ` · ${order.farm.phone}`}
                </div>
              )}

              {order.status === "declined" && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  This order was declined by the farm. Please contact them
                  directly or browse other listings.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FloristOrdersPage() {
  const orders = getOrdersByFlorist(DEMO_FLORIST.id);

  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed"].includes(o.status)
  );
  const pastOrders = orders.filter((o) =>
    ["fulfilled", "declined"].includes(o.status)
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-soil">My Orders</h1>
          <p className="mt-1 text-sm text-stone">
            {DEMO_FLORIST.business_name} · {DEMO_FLORIST.island} ·{" "}
            {activeOrders.length} active order
            {activeOrders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center text-stone">No orders yet.</div>
        ) : (
          <div className="space-y-6">
            {activeOrders.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-stone">
                  Active
                </h2>
                <div className="flex flex-col gap-3">
                  {activeOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {pastOrders.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-stone">
                  Past orders
                </h2>
                <div className="flex flex-col gap-3">
                  {pastOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
