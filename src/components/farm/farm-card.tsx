import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { MOCK_FARMS } from "@/lib/mock-data";

type FarmCardProps = {
  farm: (typeof MOCK_FARMS)[number];
};

function FarmInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fern text-lg font-semibold text-white">
      {initials}
    </div>
  );
}

export function FarmCard({ farm }: FarmCardProps) {
  return (
    <Link href={`/farms/${farm.id}`}>
      <Card className="group h-full cursor-pointer gap-4 border-border p-5 transition-all hover:border-fern/40 hover:shadow-md">
        <div className="flex items-start gap-4">
          <FarmInitials name={farm.business_name} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-soil group-hover:text-fern">
              {farm.business_name}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-stone">
              <MapPin className="h-3 w-3 shrink-0" />
              {farm.island}
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-stone">
          {farm.bio}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {farm.specialties.slice(0, 4).map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="border-fern/30 bg-fern-pale text-fern text-xs"
            >
              {s}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
