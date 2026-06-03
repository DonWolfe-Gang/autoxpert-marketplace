import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { FilterBar, type Filters } from "@/components/FilterBar";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/data/vehicles";
import { useCarListings } from "@/hooks/useCarListings";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const { data: liveListings, loading } = useCarListings();

  const [filters, setFilters] = useState<Filters>({
    type: initialType as Filters["type"],
    make: "",
    condition: "",
    sort: "newest",
  });

  const filtered = useMemo(() => {
    // Live (Telegram-ingested) listings always lead, static catalog backs them up.
    let result = [...liveListings, ...vehicles];

    if (filters.type) result = result.filter((v) => v.type === filters.type);
    if (filters.make) result = result.filter((v) => v.make === filters.make);
    if (filters.condition) result = result.filter((v) => v.condition === filters.condition);

    switch (filters.sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "mileage":
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
        result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} vehicles available</p>
        </div>

        <FilterBar filters={filters} onChange={setFilters} />

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No vehicles match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
