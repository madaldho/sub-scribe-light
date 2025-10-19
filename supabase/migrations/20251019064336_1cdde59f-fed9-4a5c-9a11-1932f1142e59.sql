-- Add trial tracking fields to subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS is_trial boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_end_date date;

-- Create notifications table for reminders
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'payment_reminder', 'trial_ending', 'renewal', etc
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  scheduled_for timestamp with time zone,
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Create subscription_audit_log for tracking changes
CREATE TABLE IF NOT EXISTS public.subscription_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  action text NOT NULL, -- 'created', 'updated', 'deleted', 'renewed', 'cancelled'
  changes jsonb, -- Store what changed
  created_at timestamp with time zone DEFAULT now()
);

-- Create currency_rates table for multi-currency support
CREATE TABLE IF NOT EXISTS public.currency_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  rate numeric NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Create user_preferences table for settings like theme, onboarding, etc
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  theme text DEFAULT 'dark',
  has_completed_onboarding boolean DEFAULT false,
  notification_preferences jsonb DEFAULT '{"email": true, "push": false, "days_before": [7, 3, 1]}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for subscription_audit_log
CREATE POLICY "Users can view their own audit logs"
  ON public.subscription_audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for currency_rates (public read)
CREATE POLICY "Anyone can view currency rates"
  ON public.currency_rates FOR SELECT
  USING (true);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to log subscription changes
CREATE OR REPLACE FUNCTION log_subscription_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.subscription_audit_log (subscription_id, user_id, action, changes)
    VALUES (NEW.id, NEW.user_id, 'created', to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.subscription_audit_log (subscription_id, user_id, action, changes)
    VALUES (NEW.id, NEW.user_id, 'updated', jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ));
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.subscription_audit_log (subscription_id, user_id, action, changes)
    VALUES (OLD.id, OLD.user_id, 'deleted', to_jsonb(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for subscription audit logging
DROP TRIGGER IF EXISTS subscription_audit_trigger ON public.subscriptions;
CREATE TRIGGER subscription_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION log_subscription_change();

-- Insert some default currency rates (IDR based)
INSERT INTO public.currency_rates (from_currency, to_currency, rate) VALUES
  ('IDR', 'USD', 0.000064),
  ('IDR', 'EUR', 0.000059),
  ('IDR', 'SGD', 0.000085),
  ('IDR', 'MYR', 0.00029),
  ('USD', 'IDR', 15600),
  ('EUR', 'IDR', 17000),
  ('SGD', 'IDR', 11700),
  ('MYR', 'IDR', 3450),
  ('USD', 'USD', 1),
  ('EUR', 'EUR', 1),
  ('IDR', 'IDR', 1)
ON CONFLICT (from_currency, to_currency) DO NOTHING;