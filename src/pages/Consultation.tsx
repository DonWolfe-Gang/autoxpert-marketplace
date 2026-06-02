import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Clock, Check, ShieldCheck, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { consultationServices, timeSlots } from "@/data/consultations";
import { supabase } from "@/integrations/supabase/client";

const Consultation = () => {
  const [selectedId, setSelectedId] = useState<string>(consultationServices[1].id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const selected = consultationServices.find((s) => s.id === selectedId)!;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !slot) {
      toast({ title: "Please pick a date and time", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("consultation_bookings").insert({
      service_id: selected.id,
      service_name: selected.name,
      price: selected.price,
      preferred_date: date,
      time_slot: slot,
      full_name: form.name,
      email: form.email,
      phone: form.phone || null,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not save booking", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Booking confirmed",
      description: `${selected.name} on ${date} at ${slot}. We'll email ${form.email} shortly.`,
    });
    setForm({ name: "", email: "", phone: "", notes: "" });
    setDate("");
    setSlot("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-secondary/60 to-background">
        <div className="container py-10 md:py-14 text-center space-y-3">
          <Badge variant="secondary" className="mx-auto">Expert Consultation</Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Talk to a certified auto expert
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Independent advice on buying, selling, and maintaining your vehicle. No dealer pressure.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-success" /> ASE-certified</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 text-warning fill-warning" /> 4.9 / 5 rating</span>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12 grid md:grid-cols-[1.2fr_1fr] gap-8 max-w-5xl">
        {/* Services */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Choose a service</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {consultationServices.map((s) => {
              const Icon = s.icon;
              const active = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`text-left rounded-lg border bg-card p-4 transition-all hover-scale ${
                    active ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {s.popular && <Badge className="text-[10px]">Popular</Badge>}
                  </div>
                  <div className="mt-3 space-y-1">
                    <h3 className="font-semibold text-sm">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.tagline}</p>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-primary">${s.price}</span>
                    <span className="text-xs text-muted-foreground">/ {s.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-2">
            <h3 className="font-semibold text-sm">What's included</h3>
            <ul className="space-y-1.5">
              {selected.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking form */}
        <form onSubmit={submit} className="rounded-lg border bg-card p-5 space-y-4 h-fit md:sticky md:top-20">
          <div className="space-y-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" /> Book your session
            </h2>
            <p className="text-xs text-muted-foreground">{selected.name} · ${selected.price}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Preferred date</Label>
              <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Time slot</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSlot(t)}
                    className={`flex items-center justify-center gap-1 rounded-md border text-xs h-9 transition-colors ${
                      slot === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:border-primary/50"
                    }`}
                  >
                    <Clock className="h-3 w-3" /> {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" rows={3} placeholder="Tell us about the vehicle or your question..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Saving…" : `Confirm booking · $${selected.price}`}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Free cancellation up to 24h before your session.{" "}
            <Link to="/learn" className="underline">Read our guides</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Consultation;
