import { ShieldCheck, ClipboardCheck, Headphones, Award } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Verified Sellers" },
  { icon: ClipboardCheck, label: "Vehicle Inspections" },
  { icon: Headphones, label: "Expert Consultation" },
  { icon: Award, label: "Quality Guarantee" },
];

export function TrustBanner() {
  return (
    <section className="border-y bg-card">
      <div className="container py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3 justify-center md:justify-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
