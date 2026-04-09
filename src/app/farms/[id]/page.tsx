import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ArrowRight, ChevronLeft } from "lucide-react";
import { getFarmById } from "@/lib/mock-data";
import { PageTransition } from "@/components/shared/page-transition";

export default async function FarmProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const farm = getFarmById(id);
  if (!farm) notFound();

  const initials = farm.business_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <PageTransition>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative h-56 overflow-hidden sm:h-72 lg:h-80">
        {farm.logo_url ? (
          <Image
            src={farm.logo_url}
            alt={farm.business_name}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-fern-pale" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
        <Link
          href="/farms"
          className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/45 sm:left-6 lg:left-8"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Farm Directory
        </Link>
      </div>

      {/* ── Profile header ───────────────────────────────────── */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fern text-lg font-bold text-white shadow-sm">
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-normal text-soil sm:text-2xl">
                  {farm.business_name}
                </h1>
                <p className="flex items-center gap-1 text-sm text-stone">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {farm.island}
                </p>
              </div>
            </div>
            {/* CTA */}
            <Link
              href={`/listings?farm=${farm.id}`}
              className="flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-clay/90"
            >
              Browse their flowers
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-8 pb-20 sm:px-6 lg:px-8">
        {/* Contact */}
        <div className="mt-6 flex flex-col gap-2.5 rounded-xl border border-border bg-petal px-6 py-4">
          {farm.address && (
            <div className="flex items-start gap-2 text-sm text-stone">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
              <span>{farm.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-stone">
            <Mail className="h-4 w-4 shrink-0 text-fern" />
            <a href={`mailto:${farm.contact_email}`} className="hover:text-fern hover:underline">
              {farm.contact_email}
            </a>
          </div>
          {farm.phone && (
            <div className="flex items-center gap-2 text-sm text-stone">
              <Phone className="h-4 w-4 shrink-0 text-fern" />
              <a href={`tel:${farm.phone}`} className="hover:text-fern hover:underline">
                {farm.phone}
              </a>
            </div>
          )}
        </div>

        {/* About */}
        {farm.bio && (
          <div className="mt-8">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone">
              About
            </h2>
            <p className="leading-relaxed text-soil">{farm.bio}</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
