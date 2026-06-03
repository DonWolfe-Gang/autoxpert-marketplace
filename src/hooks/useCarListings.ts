import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/data/vehicles";
import type { Tables } from "@/integrations/supabase/types";

type Row = Tables<"car_listings">;

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='hsl(220 13% 91%)'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='28' fill='hsl(215 16% 47%)'>No photo yet</text></svg>`,
  );

const VALID_TYPES = ["sedan", "suv", "motorcycle"] as const;
type VType = (typeof VALID_TYPES)[number];

export function rowToVehicle(r: Row): Vehicle {
  const images = Array.isArray(r.images) && r.images.length > 0 ? r.images : [];
  const imageSources = [...images, FALLBACK_IMG];
  const gallerySources = images.length > 0
    ? images.map((u) => [u, FALLBACK_IMG])
    : [[FALLBACK_IMG]];

  const type: VType = (VALID_TYPES as readonly string[]).includes(r.vehicle_type ?? "")
    ? (r.vehicle_type as VType)
    : "sedan";

  return {
    id: r.id,
    title: r.title,
    make: r.make ?? "Unknown",
    model: r.model ?? "",
    year: r.year ?? new Date().getFullYear(),
    price: Number(r.price ?? 0),
    mileage: r.mileage ?? 0,
    location: r.location ?? "—",
    condition: "good",
    type,
    verified: false,
    description: r.description ?? "",
    imageSources,
    gallerySources,
    image: imageSources[0],
    images: imageSources,
    specs: {
      engine: "—",
      transmission: "—",
      fuel: "—",
      drivetrain: "—",
      exteriorColor: "—",
      interiorColor: "—",
      vin: "—",
    },
    seller: {
      name: "Telegram Seller",
      rating: 0,
      reviews: 0,
      memberSince: new Date(r.created_at).getFullYear().toString(),
      responseTime: "Varies",
    },
  } as Vehicle;
}

export function useCarListings() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: rows, error } = await supabase
        .from("car_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(500);
      if (cancelled) return;
      if (error) {
        console.error("car_listings fetch failed", error);
        setData([]);
      } else {
        setData((rows ?? []).map(rowToVehicle));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}
