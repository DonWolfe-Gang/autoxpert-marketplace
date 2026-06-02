import { Link } from "react-router-dom";
import { MapPin, Gauge, ShieldCheck, MessageCircle, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/SmartImage";
import type { Vehicle } from "@/data/vehicles";


interface Props {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: Props) {
  const conditionColor: Record<string, string> = {
    excellent: "bg-success text-success-foreground",
    good: "bg-primary text-primary-foreground",
    fair: "bg-warning text-warning-foreground",
  };

  return (
    <Link
      to={`/vehicle/${vehicle.id}`}
      className="group block rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={vehicle.image}
          alt={vehicle.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {vehicle.verified && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-xs font-medium backdrop-blur">
            <ShieldCheck className="h-3 w-3 text-success" />
            Verified
          </div>
        )}
        <Badge className={`absolute top-2 right-2 text-xs ${conditionColor[vehicle.condition]}`}>
          {vehicle.condition}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm leading-tight line-clamp-1">{vehicle.title}</h3>
        <p className="text-lg font-bold text-primary">${vehicle.price.toLocaleString()}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            {(vehicle.mileage / 1000).toFixed(0)}k mi
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {vehicle.location}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Contact
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 text-xs h-8"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <ArrowRightLeft className="h-3 w-3 mr-1" />
            Trade
          </Button>
        </div>
      </div>
    </Link>
  );
}
