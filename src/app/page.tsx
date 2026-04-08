"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Leaf, ShoppingBasket, Sprout } from "lucide-react";
import { MOCK_FARMS, MOCK_LISTINGS } from "@/lib/mock-data";
import { FarmCard } from "@/components/farm/farm-card";
import { ListingCard } from "@/components/farm/listing-card";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 },
  }),
};

const HOW_IT_WORKS = [
  {
    icon: Sprout,
    title: "Farms post availability",
    body: "Growers list their weekly inventory — flower variety, quantity, price, and pickup date.",
  },
  {
    icon: ShoppingBasket,
    title: "Florists browse & order",
    body: "Discover island-grown flowers, filter by variety or island, and place orders in minutes.",
  },
  {
    icon: Leaf,
    title: "Direct farm relationships",
    body: "No middlemen. Farms confirm orders, florists track status, and everyone saves time.",
  },
];

export default function LandingPage() {
  const featuredFarms = MOCK_FARMS.slice(0, 3);
  const featuredListings = MOCK_LISTINGS.filter((l) => l.is_active).slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-fern-pale via-petal to-clay-pale px-4 py-24 sm:py-32">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-fern/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-clay/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-fern shadow-sm"
          >
            <Leaf className="h-3.5 w-3.5" />
            Hawaii&apos;s flower marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl font-semibold tracking-tight text-soil sm:text-5xl lg:text-6xl"
          >
            Fresh flowers,{" "}
            <span className="text-fern">direct from the farm.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone"
          >
            Pua Market connects Hawaii&apos;s florists directly with local flower
            farms — no phone tag, no Instagram DMs. Browse availability, place
            orders, and build lasting farm relationships, all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/farm/listings"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-fern px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-fern/90 hover:shadow-md sm:w-auto"
            >
              I&apos;m a farm
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/florist/browse"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-clay px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-clay/90 hover:shadow-md sm:w-auto"
            >
              I&apos;m a florist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-soil sm:text-3xl">
              How it works
            </h2>
            <p className="mt-2 text-stone">
              Simple enough for any farm owner, powerful enough for busy florists.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-petal p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fern-pale">
                  <Icon className="h-5 w-5 text-fern" />
                </span>
                <div>
                  <h3 className="font-semibold text-soil">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured listings ────────────────────────────────── */}
      <section className="bg-petal px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-soil sm:text-3xl">
                Available this week
              </h2>
              <p className="mt-1 text-sm text-stone">
                Fresh inventory posted by farms across Hawaii
              </p>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-1 text-sm font-medium text-clay hover:underline"
            >
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured farms ───────────────────────────────────── */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-soil sm:text-3xl">
                Featured farms
              </h2>
              <p className="mt-1 text-sm text-stone">
                Discover growers across the Hawaiian Islands
              </p>
            </div>
            <Link
              href="/farms"
              className="flex items-center gap-1 text-sm font-medium text-fern hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFarms.map((farm, i) => (
              <motion.div
                key={farm.id}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
              >
                <FarmCard farm={farm} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="bg-fern px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Ready to simplify your sourcing?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-fern-light">
          Join Hawaii&apos;s first B2B flower marketplace. Free to join during our
          beta.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/farm/listings"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-fern shadow-sm transition-colors hover:bg-fern-pale"
          >
            List your farm
          </Link>
          <Link
            href="/florist/browse"
            className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Start sourcing
          </Link>
        </div>
      </section>
    </div>
  );
}
