import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getFarmById, getListingsByFarm } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ListingCard } from "@/components/farm/listing-card";
import { PageTransition } from "@/components/shared/page-transition";

export default async function FarmProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const farm = getFarmById(id);
  if (!farm) notFound();

  const allListings = getListingsByFarm(id);
  const activeListings = allListings.filter((l) => l.is_active);

  const initials = farm.business_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/farms"
          className="mb-8 inline-flex items-center gap-1 text-sm text-stone hover:text-fern"
        >
          ← Back to farms
        </Link>

        {/* Profile header */}
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-white p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-fern text-2xl font-bold text-white">
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-soil">
                  {farm.business_name}
                </h1>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-stone">
                  <MapPin className="h-3.5 w-3.5" />
                  {farm.island}
                </div>
              </div>
              <Link
                href="/florist/browse"
                className="rounded-full bg-clay px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-clay/90"
              >
                Browse their listings
              </Link>
            </div>

            <p className="mt-4 leading-relaxed text-stone">{farm.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {farm.specialties.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="border-fern/30 bg-fern-pale text-fern"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6 flex flex-wrap gap-4 rounded-xl border border-border bg-petal px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-stone">
            <Mail className="h-4 w-4 shrink-0 text-fern" />
            <a
              href={`mailto:${farm.contact_email}`}
              className="hover:text-fern hover:underline"
            >
              {farm.contact_email}
            </a>
          </div>
          {farm.phone && (
            <div className="flex items-center gap-2 text-sm text-stone">
              <Phone className="h-4 w-4 shrink-0 text-fern" />
              <a
                href={`tel:${farm.phone}`}
                className="hover:text-fern hover:underline"
              >
                {farm.phone}
              </a>
            </div>
          )}
        </div>

        <Separator className="my-10" />

        {/* Listings */}
        <div>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-bold text-soil">
              Available now
              <span className="ml-2 text-sm font-normal text-stone">
                ({activeListings.length} listing
                {activeListings.length !== 1 ? "s" : ""})
              </span>
            </h2>
          </div>

          {activeListings.length === 0 ? (
            <p className="py-12 text-center text-stone">
              No active listings right now. Check back soon.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showRequestButton />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
