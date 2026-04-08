import { Search, Car, Bike, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const chips = [
  { label: "Sedans", icon: Car, type: "sedan" },
  { label: "SUVs", icon: Truck, type: "suv" },
  { label: "Motorcycles", icon: Bike, type: "motorcycle" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
      </div>

      <div className="relative container py-16 md:py-24 text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary-foreground leading-tight">
          Find Your Perfect <span className="text-gradient">Ride</span>
        </h1>
        <p className="text-sm md:text-base text-primary-foreground/80 max-w-lg mx-auto">
          Browse thousands of verified used vehicles — sedans, SUVs, and motorcycles — all in one place.
        </p>

        {/* Search bar */}
        <div className="max-w-xl mx-auto">
          <div className="flex items-center rounded-lg bg-card shadow-lg overflow-hidden">
            <Search className="h-5 w-5 ml-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search make, model, or keyword..."
              className="flex-1 h-12 px-3 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button className="rounded-none rounded-r-lg h-12 px-6" asChild>
              <Link to="/listings">Search</Link>
            </Button>
          </div>
        </div>

        {/* Quick filter chips */}
        <div className="flex justify-center gap-3 flex-wrap">
          {chips.map((c) => (
            <Link
              key={c.type}
              to={`/listings?type=${c.type}`}
              className="flex items-center gap-2 rounded-full bg-card/20 backdrop-blur border border-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-card/40 transition"
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
