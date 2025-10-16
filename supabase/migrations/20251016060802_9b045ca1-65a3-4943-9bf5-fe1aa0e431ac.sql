-- Create payment_history table for tracking subscription payments
CREATE TABLE public.payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'paid',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on payment_history
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_history
CREATE POLICY "Users can view their own payment history"
ON public.payment_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment history"
ON public.payment_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment history"
ON public.payment_history
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment history"
ON public.payment_history
FOR DELETE
USING (auth.uid() = user_id);