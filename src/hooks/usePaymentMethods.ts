import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface PaymentMethod {
  id: string;
  user_id: string;
  name: string;
  provider: string;
  type: string;
  color?: string;
  is_active?: boolean;
  created_at: string;
}

export const usePaymentMethods = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["paymentMethods", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as PaymentMethod[];
    },
    enabled: !!user,
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (paymentMethod: Partial<PaymentMethod>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("payment_methods")
        .insert([{
          ...paymentMethod,
          user_id: user.id,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success("Metode pembayaran berhasil ditambahkan!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan metode pembayaran");
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success("Metode pembayaran berhasil dihapus!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus metode pembayaran");
    },
  });
};
