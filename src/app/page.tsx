"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    image: "/images/Process1.png",
    imgClassName: "h-40 w-40 object-contain scale-150 sm:h-64 sm:w-64",
    title: "Farms post availability",
    body: "Growers list their weekly inventory — flower variety, quantity, price, and pickup date.",
  },
  {
    image: "/images/Process2.png",
    imgClassName: "h-40 w-40 object-contain sm:h-64 sm:w-64",
    title: "Florists browse & order",
    body: "Discover island-grown flowers, filter by variety or island, and place orders in minutes.",
  },
  {
    image: "/images/Process3.png",
    imgClassName: "h-40 w-40 object-contain sm:h-64 sm:w-64",
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
      <section className="relative -mt-16 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        {/* background image */}
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover object-bottom"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/30 to-black/65" />
        {/* extra top vignette for nav legibility */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/40 to-transparent" />

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-xs font-medium tracking-[0.25em] text-white/70 uppercase drop-shadow-md"
          >
            Hawaii&apos;s flower marketplace
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-5xl font-semibold text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
          >
            Fresh flowers,
            <br />
            <span className="font-normal italic text-fern-light">
              direct from the farm.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mx-auto mt-7 max-w-md text-base leading-relaxed text-white/80 drop-shadow-md"
          >
            Connecting Hawaii&apos;s florists directly with local farms —
            no phone tag, no Instagram DMs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/farm/listings"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-10 py-3.5 text-sm font-semibold text-soil shadow-sm transition-all hover:bg-white/90 sm:w-auto"
            >
              I&apos;m a farm
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/florist/browse"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-10 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto"
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
            {HOW_IT_WORKS.map(({ image, imgClassName, title, body }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="flex flex-col items-center gap-4 sm:items-start"
              >
                <img src={image} alt={title} className={imgClassName} />
                <div className="max-w-xs text-center sm:text-left">
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
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between">
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
              className="mt-3 flex items-center gap-1 text-sm font-medium text-clay hover:underline sm:mt-0"
            >
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between">
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
              className="mt-3 flex items-center gap-1 text-sm font-medium text-fern hover:underline sm:mt-0"
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
