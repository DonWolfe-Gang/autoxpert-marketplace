import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustBanner } from "@/components/TrustBanner";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";

const featured = vehicles.filter((v) => v.featured);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <TrustBanner />

      {/* Featured Listings */}
      <section className="container py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Featured Listings</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings" className="flex items-center gap-1 text-sm">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          © 2026 AutoXpert™. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
