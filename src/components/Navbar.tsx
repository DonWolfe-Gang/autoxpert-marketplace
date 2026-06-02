import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Buy/Sell", to: "/listings" },
  { label: "Consultation", to: "/consultation" },
  { label: "Learn", to: "/learn" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between md:h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Car className="h-6 w-6 text-primary" />
          <span>Auto<span className="text-primary">Xpert</span>™</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(l.to) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Button size="sm" asChild>
            <Link to="/listings">List Vehicle</Link>
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card animate-fade-in">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium py-2 ${
                  isActive(l.to) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Button size="sm" className="w-full" asChild>
              <Link to="/listings" onClick={() => setOpen(false)}>List Vehicle</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
