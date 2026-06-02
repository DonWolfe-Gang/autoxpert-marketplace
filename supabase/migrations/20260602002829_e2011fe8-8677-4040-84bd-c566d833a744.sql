DROP POLICY "Anyone can submit a consultation booking" ON public.consultation_bookings;
CREATE POLICY "Anyone can submit a consultation booking"
  ON public.consultation_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 120
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(service_id) BETWEEN 1 AND 60
    AND char_length(time_slot) BETWEEN 1 AND 20
    AND (notes IS NULL OR char_length(notes) <= 2000)
    AND (phone IS NULL OR char_length(phone) <= 40)
    AND price >= 0 AND price <= 100000
  );

DROP POLICY "Anyone can submit a vehicle inquiry" ON public.vehicle_inquiries;
CREATE POLICY "Anyone can submit a vehicle inquiry"
  ON public.vehicle_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(vehicle_id) BETWEEN 1 AND 60
    AND char_length(vehicle_title) BETWEEN 1 AND 200
    AND inquiry_type IN ('message','call','trade')
    AND (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
    AND (full_name IS NULL OR char_length(full_name) <= 120)
    AND (phone IS NULL OR char_length(phone) <= 40)
    AND (message IS NULL OR char_length(message) <= 2000)
  );