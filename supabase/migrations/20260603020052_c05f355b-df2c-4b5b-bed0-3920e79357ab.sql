
-- 1) Track Telegram per-photo identifiers alongside the image URLs
ALTER TABLE public.car_listings
  ADD COLUMN IF NOT EXISTS file_unique_ids text[] NOT NULL DEFAULT '{}'::text[];

-- 2) Helpful indexes for filtering / lookups
CREATE INDEX IF NOT EXISTS idx_car_listings_status_created
  ON public.car_listings (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_car_listings_source_lookup
  ON public.car_listings (source, source_chat_id, source_message_id);

-- 3) Validation trigger: Telegram-sourced listings must carry their origin keys,
--    and images[] must stay aligned with file_unique_ids[].
CREATE OR REPLACE FUNCTION public.car_listings_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.source = 'telegram' THEN
    IF NEW.source_chat_id IS NULL OR NEW.source_message_id IS NULL THEN
      RAISE EXCEPTION 'Telegram listings require source_chat_id and source_message_id';
    END IF;
  END IF;

  IF NEW.images IS NULL THEN
    NEW.images := '{}'::text[];
  END IF;
  IF NEW.file_unique_ids IS NULL THEN
    NEW.file_unique_ids := '{}'::text[];
  END IF;

  -- When we track per-photo IDs, they must line up 1:1 with images
  IF array_length(NEW.file_unique_ids, 1) IS NOT NULL
     AND array_length(NEW.file_unique_ids, 1) <> COALESCE(array_length(NEW.images, 1), 0) THEN
    RAISE EXCEPTION 'file_unique_ids length (%) must match images length (%)',
      array_length(NEW.file_unique_ids, 1),
      COALESCE(array_length(NEW.images, 1), 0);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_car_listings_validate ON public.car_listings;
CREATE TRIGGER trg_car_listings_validate
BEFORE INSERT OR UPDATE ON public.car_listings
FOR EACH ROW EXECUTE FUNCTION public.car_listings_validate();

-- 4) Keep updated_at fresh
DROP TRIGGER IF EXISTS trg_car_listings_updated_at ON public.car_listings;
CREATE TRIGGER trg_car_listings_updated_at
BEFORE UPDATE ON public.car_listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
