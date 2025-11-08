import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useTotalExpenses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["totalExpenses", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("payment_history")
        .select("amount")
        .eq("user_id", user.id)
        .eq("status", "paid");

      if (error) throw error;
      
      const total = data.reduce((sum, payment) => sum + Number(payment.amount), 0);
      return total;
    },
    enabled: !!user,
  });
};
