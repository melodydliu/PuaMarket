import Link from "next/link";
import type { MOCK_FARMS } from "@/lib/mock-data";

type FarmCardProps = {
  farm: (typeof MOCK_FARMS)[number];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function FarmCard({ farm }: FarmCardProps) {
  return (
    <Link href={`/farms/${farm.id}`}>
      <div className="group cursor-pointer">
        {/* Banner / logo area */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-fern-pale flex items-center justify-center transition-opacity group-hover:opacity-90">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fern text-xl font-semibold text-white shadow-sm">
            {getInitials(farm.business_name)}
          </div>
        </div>

        {/* Text below */}
        <div className="mt-2 space-y-0.5">
          <p className="truncate text-[15px] font-medium text-soil transition-colors group-hover:text-fern">
            {farm.business_name}
          </p>
          <p className="text-[13px] text-stone">{farm.island}</p>
          <p className="text-[13px] text-stone">
            {farm.specialties.slice(0, 3).join(" · ")}
          </p>
        </div>
      </div>
    </Link>
  );
}
