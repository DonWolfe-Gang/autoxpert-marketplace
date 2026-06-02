
-- Raw Telegram updates (idempotent on update_id)
CREATE TABLE public.telegram_messages (
  update_id BIGINT PRIMARY KEY,
  chat_id BIGINT NOT NULL,
  chat_title TEXT,
  user_id BIGINT,
  username TEXT,
  text TEXT,
  raw_update JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.telegram_messages TO service_role;

ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;
-- No public policies — only service_role (edge functions) can touch this table.

CREATE INDEX idx_telegram_messages_chat_id ON public.telegram_messages (chat_id);
CREATE INDEX idx_telegram_messages_created_at ON public.telegram_messages (created_at DESC);

-- Parsed car listings
CREATE TABLE public.car_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  location TEXT,
  contact TEXT,
  vehicle_type TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  mileage INTEGER,
  images TEXT[] NOT NULL DEFAULT '{}',
  source TEXT NOT NULL DEFAULT 'telegram',
  source_chat_id BIGINT,
  source_message_id BIGINT,
  raw_text TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, source_chat_id, source_message_id)
);

GRANT SELECT ON public.car_listings TO anon;
GRANT SELECT ON public.car_listings TO authenticated;
GRANT ALL ON public.car_listings TO service_role;

ALTER TABLE public.car_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active car listings"
  ON public.car_listings
  FOR SELECT
  USING (status = 'active');

CREATE INDEX idx_car_listings_created_at ON public.car_listings (created_at DESC);
CREATE INDEX idx_car_listings_status ON public.car_listings (status);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_car_listings_updated_at
  BEFORE UPDATE ON public.car_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
