-- Consultation bookings
CREATE TABLE public.consultation_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  preferred_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.consultation_bookings TO anon, authenticated;
GRANT ALL ON public.consultation_bookings TO service_role;

ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a consultation booking"
  ON public.consultation_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Vehicle inquiries (contact seller / request call / trade proposal)
CREATE TABLE public.vehicle_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT NOT NULL,
  vehicle_title TEXT NOT NULL,
  inquiry_type TEXT NOT NULL DEFAULT 'message',
  full_name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.vehicle_inquiries TO anon, authenticated;
GRANT ALL ON public.vehicle_inquiries TO service_role;

ALTER TABLE public.vehicle_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a vehicle inquiry"
  ON public.vehicle_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Helpful index
CREATE INDEX idx_vehicle_inquiries_vehicle_id ON public.vehicle_inquiries(vehicle_id);
CREATE INDEX idx_consultation_bookings_created_at ON public.consultation_bookings(created_at DESC);