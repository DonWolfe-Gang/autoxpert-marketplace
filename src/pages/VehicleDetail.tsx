import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, Gauge, Calendar, ShieldCheck, MessageCircle,
  ArrowRightLeft, Heart, Share2, Fuel, Settings2, Palette, Star, Phone,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { vehicles, type Vehicle } from "@/data/vehicles";
import { SmartImage } from "@/components/SmartImage";
import { supabase } from "@/integrations/supabase/client";
import { rowToVehicle } from "@/hooks/useCarListings";

const VehicleDetail = () => {
  const { id } = useParams();
  const staticVehicle = vehicles.find((v) => v.id === id);
  const [dbVehicle, setDbVehicle] = useState<Vehicle | null>(null);
  const [resolving, setResolving] = useState(!staticVehicle);
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (staticVehicle || !id) return;
    let cancelled = false;
    (async () => {
      // car_listings IDs are uuids; only query when shape matches
      const isUuid = /^[0-9a-f-]{36}$/i.test(id);
      if (!isUuid) { setResolving(false); return; }
      const { data, error } = await supabase
        .from("car_listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (error) console.error(error);
      setDbVehicle(data ? rowToVehicle(data) : null);
      setResolving(false);
    })();
    return () => { cancelled = true; };
  }, [id, staticVehicle]);

  const vehicle = staticVehicle ?? dbVehicle;

  if (resolving) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Loading vehicle…
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">Vehicle not found.</p>
            <Button asChild variant="outline"><Link to="/listings">Back to listings</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  const gallerySources = vehicle.gallerySources?.length ? vehicle.gallerySources : [vehicle.imageSources];
  const gallery = gallerySources.map((c) => c[0]);

  const specs = vehicle.specs!;
  const seller = vehicle.seller!;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: vehicle.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard" });
      }
    } catch { /* user cancelled */ }
  };

  const logInquiry = async (type: "message" | "call" | "trade") => {
    const { error } = await supabase.from("vehicle_inquiries").insert({
      vehicle_id: vehicle.id,
      vehicle_title: vehicle.title,
      inquiry_type: type,
    });
    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      return false;
    }
    return true;
  };

  const specRows: { icon: typeof Fuel; label: string; value: string }[] = [
    { icon: Settings2, label: "Engine", value: specs.engine },
    { icon: Settings2, label: "Transmission", value: specs.transmission },
    { icon: Fuel, label: "Fuel", value: specs.fuel },
    { icon: Settings2, label: "Drivetrain", value: specs.drivetrain },
    { icon: Palette, label: "Exterior", value: specs.exteriorColor },
    { icon: Palette, label: "Interior", value: specs.interiorColor },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />

      <div className="container py-6 space-y-6 max-w-5xl">
        <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
              <SmartImage sources={gallerySources[activeImg]} alt={vehicle.title} className="h-full w-full object-cover animate-fade-in" key={activeImg} />
              <div className="absolute top-3 left-3 flex gap-2">
                {vehicle.verified && (
                  <Badge className="bg-card/90 text-foreground backdrop-blur flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-success" /> Verified
                  </Badge>
                )}
                <Badge variant="secondary" className="capitalize">{vehicle.condition}</Badge>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => setSaved(!saved)} aria-label="Save">
                  <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={share} aria-label="Share">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-video overflow-hidden rounded-md border-2 transition-all ${
                      i === activeImg ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <SmartImage sources={gallerySources[i]} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summary + actions */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4 md:p-5 space-y-3">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-bold leading-tight">{vehicle.title}</h1>
                <p className="text-3xl font-extrabold text-primary">${vehicle.price.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded-md bg-secondary p-2 text-center">
                  <Calendar className="h-4 w-4 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-1">Year</p>
                  <p className="text-sm font-semibold">{vehicle.year}</p>
                </div>
                <div className="rounded-md bg-secondary p-2 text-center">
                  <Gauge className="h-4 w-4 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-1">Mileage</p>
                  <p className="text-sm font-semibold">{(vehicle.mileage / 1000).toFixed(0)}k mi</p>
                </div>
                <div className="rounded-md bg-secondary p-2 text-center">
                  <MapPin className="h-4 w-4 mx-auto text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mt-1">Location</p>
                  <p className="text-sm font-semibold truncate">{vehicle.location.split(",")[0]}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button className="flex-1" onClick={async () => {
                  if (await logInquiry("message"))
                    toast({ title: "Message sent", description: "The seller will reply shortly." });
                }}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Contact
                </Button>
                <Button variant="outline" className="flex-1" onClick={async () => {
                  if (await logInquiry("trade")) toast({ title: "Trade proposed" });
                }}>
                  <ArrowRightLeft className="h-4 w-4 mr-2" /> Trade
                </Button>
              </div>
            </div>

            {/* Seller card */}
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h2 className="text-sm font-bold">Seller</h2>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {seller.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{seller.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{seller.rating} ({seller.reviews})</span>
                    <span>· Since {seller.memberSince}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Responds {seller.responseTime.toLowerCase()}</p>
              <Button variant="outline" size="sm" className="w-full" onClick={async () => {
                if (await logInquiry("call")) toast({ title: "Call requested" });
              }}>
                <Phone className="h-3 w-3 mr-2" /> Request a call
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg border bg-card p-4 md:p-5 space-y-2">
          <h2 className="text-sm font-bold">About this vehicle</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{vehicle.description}</p>
        </div>

        {/* Specs */}
        <div className="rounded-lg border bg-card p-4 md:p-5 space-y-3">
          <h2 className="text-sm font-bold">Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specRows.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.label} className="flex items-start gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{r.label}</p>
                    <p className="text-sm font-medium truncate">{r.value}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex items-start gap-2 col-span-2 md:col-span-3">
              <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">VIN</p>
                <p className="text-sm font-mono">{specs.vin}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consult CTA */}
        <div className="rounded-lg border bg-gradient-to-br from-primary/10 to-accent/10 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <h3 className="font-bold">Not sure yet?</h3>
            <p className="text-sm text-muted-foreground">Book a 30-minute call with an AutoXpert advisor before you buy.</p>
          </div>
          <Button asChild>
            <Link to="/consultation">Book consultation</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
