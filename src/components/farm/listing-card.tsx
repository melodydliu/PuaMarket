import Link from "next/link";
import { Leaf } from "lucide-react";
import type { Listing } from "@/types/database";

function FlowerPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-fern-pale">
      <Leaf className="h-10 w-10 text-fern/20" />
    </div>
  );
}

export function ListingCard({
  listing,
  showRequestButton = false,
  onRequest,
  hidePricing = false,
  showLoginButton = false,
}: {
  listing: Listing;
  showRequestButton?: boolean;
  onRequest?: (listing: Listing) => void;
  hidePricing?: boolean;
  showLoginButton?: boolean;
}) {
  return (
    <div className="group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-sm">
        {listing.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.photo_url}
            alt={listing.flower_name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FlowerPlaceholder />
        )}
        {listing.farm?.island && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-soil backdrop-blur-sm">
            {listing.farm.island}
          </span>
        )}
      </div>

      {/* Text below image */}
      <div className="mt-2 space-y-0.5">
        <p className="truncate text-[15px] font-medium text-soil transition-colors group-hover:text-fern">
          {listing.flower_name}
          {listing.variety ? ` · ${listing.variety}` : ""}
        </p>

        {listing.color && (
          <p className="text-[12px] text-stone/70">{listing.color}</p>
        )}

        {listing.farm && (
          <p className="text-[13px] text-stone">
            <Link
              href={`/farms/${listing.farm.id}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {listing.farm.business_name}
            </Link>
          </p>
        )}

        {!hidePricing && (
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-bold text-soil">
              ${listing.price_per_unit.toFixed(2)}
            </span>
            <span className="text-[13px] text-stone">/{listing.unit}</span>
          </div>
        )}

        <p className="text-[13px] text-stone">
          {listing.qty_available} {listing.unit}s · Ready{" "}
          {new Date(listing.ready_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>

        {showRequestButton && (
          <button
            onClick={() => onRequest?.(listing)}
            className="mt-2 w-full rounded-full border border-clay/50 py-1.5 text-xs font-medium text-clay transition-colors hover:bg-clay hover:text-white"
          >
            Request Order
          </button>
        )}

        {showLoginButton && (
          <button className="mt-2 w-full rounded-full border border-stone/30 py-1.5 text-xs font-medium text-stone transition-colors hover:border-clay hover:text-clay">
            Login for Pricing
          </button>
        )}
      </div>
    </div>
  );
}
