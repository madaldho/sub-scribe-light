import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { addMonths, addYears, addWeeks, addDays } from "date-fns";

export interface PaymentHistory {
  id: string;
  subscription_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  status: string;
  notes?: string;
  created_at: string;
}

export const usePaymentHistory = (subscriptionId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["paymentHistory", subscriptionId],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .eq("subscription_id", subscriptionId)
        .eq("user_id", user.id)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data as PaymentHistory[];
    },
    enabled: !!user && !!subscriptionId,
  });
};

export const useMarkAsPaid = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      subscriptionId, 
      amount, 
      billingCycle,
      currentNextBillingDate 
    }: { 
      subscriptionId: string; 
      amount: number;
      billingCycle: string;
      currentNextBillingDate: string;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // Calculate next billing date based on billing cycle
      const currentDate = new Date(currentNextBillingDate);
      let newNextBillingDate: Date;

      switch (billingCycle) {
        case 'daily':
          newNextBillingDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          newNextBillingDate = addWeeks(currentDate, 1);
          break;
        case 'monthly':
          newNextBillingDate = addMonths(currentDate, 1);
          break;
        case 'yearly':
          newNextBillingDate = addYears(currentDate, 1);
          break;
        default:
          newNextBillingDate = addMonths(currentDate, 1);
      }

      // Create payment history record
      const { error: paymentError } = await supabase
        .from("payment_history")
        .insert({
          subscription_id: subscriptionId,
          user_id: user.id,
          amount,
          payment_date: new Date().toISOString().split('T')[0],
          status: 'paid',
        });

      if (paymentError) throw paymentError;

      // Update subscription next_billing_date and set to active if was in trial
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ 
          next_billing_date: newNextBillingDate.toISOString().split('T')[0],
          last_payment_date: new Date().toISOString().split('T')[0],
          status: 'active',
          is_trial: false
        })
        .eq("id", subscriptionId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Pembayaran berhasil ditandai!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menandai pembayaran");
    },
  });
};
