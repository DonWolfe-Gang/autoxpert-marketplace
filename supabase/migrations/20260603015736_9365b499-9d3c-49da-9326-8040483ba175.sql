
-- Allow public read access to listing-images so signed URLs / public URLs both work cleanly
CREATE POLICY "Public read listing-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'listing-images');
