import Link from "next/link";
import { Leaf } from "lucide-react";
import type { Listing } from "@/types/database";

function FlowerPlaceholder({ color }: { color: string | null }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-fern-pale">
      <Leaf className="h-10 w-10 text-fern/20" />
      {color && (
        <span className="absolute bottom-2 left-2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-stone">
          {color}
        </span>
      )}
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
          <FlowerPlaceholder color={listing.color} />
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

        <div className="flex items-baseline gap-1">
          <span className="text-[15px] font-bold text-soil">
            ${listing.price_per_unit.toFixed(2)}
          </span>
          <span className="text-[13px] text-stone">/{listing.unit}</span>
        </div>

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
      </div>
    </div>
  );
}
