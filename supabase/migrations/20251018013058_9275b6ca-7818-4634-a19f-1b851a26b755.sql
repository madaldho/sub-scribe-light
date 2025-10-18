-- Add auto_renew field to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS auto_renew boolean DEFAULT true;

-- Add last_payment_date to track when last payment was made
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS last_payment_date date;

-- Update RLS policies for storage.objects to allow users to upload logos
CREATE POLICY "Users can upload their own logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own logos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own logos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'company-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);