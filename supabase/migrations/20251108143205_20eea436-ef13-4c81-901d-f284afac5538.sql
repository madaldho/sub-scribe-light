-- Add optional trial fee field to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN trial_fee numeric DEFAULT 0;