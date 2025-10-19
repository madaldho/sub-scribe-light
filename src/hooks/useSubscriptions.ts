import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: string;
  category: string;
  status: string;
  start_date: string;
  next_billing_date: string;
  payment_method?: string;
  payment_provider?: string;
  notes?: string;
  logo_url?: string;
  brand_color?: string;
  badge_color?: string;
  auto_renew?: boolean;
  last_payment_date?: string;
  is_trial?: boolean;
  trial_end_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useSubscriptions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("next_billing_date", { ascending: true });

      if (error) throw error;
      return data as Subscription[];
    },
    enabled: !!user,
  });
};

export const useSubscription = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subscription", id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    enabled: !!user && !!id,
  });
};

export const useAddSubscription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (subscription: Partial<Subscription>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("subscriptions")
        .insert([{
          ...subscription,
          user_id: user.id,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Langganan berhasil ditambahkan!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan langganan");
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Subscription> & { id: string }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("Langganan berhasil diupdate!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal mengupdate langganan");
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Langganan berhasil dihapus!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus langganan");
    },
  });
};
