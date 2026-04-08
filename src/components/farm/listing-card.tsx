import Link from "next/link";
import { CalendarDays, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Listing } from "@/types/database";

function FlowerPlaceholder({ color }: { color: string | null }) {
  return (
    <div className="flex h-36 w-full items-center justify-center rounded-lg bg-fern-pale text-sm font-medium text-fern">
      {color ?? "Flower"}
    </div>
  );
}

export function ListingCard({
  listing,
  showRequestButton = false,
  onRequest,
}: {
  listing: Listing;
  showRequestButton?: boolean;
  onRequest?: (listing: Listing) => void;
}) {
  return (
    <Card className="group flex flex-col gap-0 overflow-hidden border-border p-0 transition-all hover:border-fern/40 hover:shadow-md">
      {/* Photo */}
      <div className="overflow-hidden">
        {listing.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.photo_url}
            alt={listing.flower_name}
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FlowerPlaceholder color={listing.color} />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-soil">{listing.flower_name}</h3>
            {listing.variety && (
              <p className="text-xs text-stone">{listing.variety}</p>
            )}
          </div>
          <span className="shrink-0 text-base font-bold text-clay">
            ${listing.price_per_unit.toFixed(2)}
            <span className="text-xs font-normal text-stone">/{listing.unit}</span>
          </span>
        </div>

        {listing.color && (
          <Badge
            variant="outline"
            className="w-fit border-border bg-petal text-xs text-stone"
          >
            {listing.color}
          </Badge>
        )}

        <div className="mt-auto space-y-1 pt-2 text-xs text-stone">
          <div className="flex items-center gap-1.5">
            <Package className="h-3 w-3 shrink-0" />
            {listing.qty_available} {listing.unit}s available
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3 shrink-0" />
            Ready{" "}
            {new Date(listing.ready_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          {listing.farm && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0" />
              <Link
                href={`/farms/${listing.farm.id}`}
                className="hover:text-fern hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {listing.farm.business_name}
              </Link>
            </div>
          )}
        </div>

        {showRequestButton && (
          <button
            onClick={() => onRequest?.(listing)}
            className="mt-3 w-full rounded-full bg-clay py-2 text-sm font-semibold text-white transition-colors hover:bg-clay/90"
          >
            Request Order
          </button>
        )}
      </div>
    </Card>
  );
}
