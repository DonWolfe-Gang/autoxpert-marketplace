import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Gauge, Calendar, ShieldCheck, MessageCircle, ArrowRightLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { vehicles } from "@/data/vehicles";

const VehicleDetail = () => {
  const { id } = useParams();
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Vehicle not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-6 space-y-6 max-w-3xl">
        <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="rounded-lg overflow-hidden border bg-card">
          <div className="aspect-video bg-muted">
            <img src={vehicle.image} alt={vehicle.title} className="h-full w-full object-cover" />
          </div>

          <div className="p-4 md:p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">{vehicle.title}</h1>
                <p className="text-2xl md:text-3xl font-extrabold text-primary mt-1">
                  ${vehicle.price.toLocaleString()}
                </p>
              </div>
              {vehicle.verified && (
                <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                  <ShieldCheck className="h-3 w-3 text-success" /> Verified
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Gauge className="h-4 w-4" /> {vehicle.mileage.toLocaleString()} mi</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {vehicle.location}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {vehicle.year}</span>
              <Badge variant="secondary" className="capitalize">{vehicle.condition}</Badge>
              <Badge variant="secondary" className="capitalize">{vehicle.type}</Badge>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={() => alert("Contact feature coming soon!")}>
                <MessageCircle className="h-4 w-4 mr-2" /> Contact Seller
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => alert("Trade feature coming soon!")}>
                <ArrowRightLeft className="h-4 w-4 mr-2" /> Propose Trade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
