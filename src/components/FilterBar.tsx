import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { makes, vehicleTypes, conditions, type VehicleType, type Condition } from "@/data/vehicles";

export interface Filters {
  type: VehicleType | "";
  make: string;
  condition: Condition | "";
  sort: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  const [showMobile, setShowMobile] = useState(false);

  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  const clear = () => onChange({ type: "", make: "", condition: "", sort: "newest" });

  const hasFilters = filters.type || filters.make || filters.condition;

  const filterControls = (
    <>
      <Select value={filters.type || undefined} onValueChange={(v) => update("type", v)}>
        <SelectTrigger className="w-full md:w-36 h-9 text-sm">
          <SelectValue placeholder="Vehicle Type" />
        </SelectTrigger>
        <SelectContent>
          {vehicleTypes.map((t) => (
            <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.make || undefined} onValueChange={(v) => update("make", v)}>
        <SelectTrigger className="w-full md:w-40 h-9 text-sm">
          <SelectValue placeholder="Make" />
        </SelectTrigger>
        <SelectContent>
          {makes.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.condition || undefined} onValueChange={(v) => update("condition", v)}>
        <SelectTrigger className="w-full md:w-36 h-9 text-sm">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          {conditions.map((c) => (
            <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.sort} onValueChange={(v) => update("sort", v)}>
        <SelectTrigger className="w-full md:w-36 h-9 text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low → High</SelectItem>
          <SelectItem value="price-high">Price: High → Low</SelectItem>
          <SelectItem value="mileage">Lowest Mileage</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clear} className="text-xs">
          <X className="h-3 w-3 mr-1" /> Clear
        </Button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">{filterControls}</div>

      {/* Mobile */}
      <div className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => setShowMobile(!showMobile)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters & Sort
          </span>
          {hasFilters && <span className="h-2 w-2 rounded-full bg-primary" />}
        </Button>
        {showMobile && (
          <div className="mt-3 flex flex-col gap-3 animate-fade-in">{filterControls}</div>
        )}
      </div>
    </>
  );
}
