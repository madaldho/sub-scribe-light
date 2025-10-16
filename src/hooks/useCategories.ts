import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export const useCategories = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["categories", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("subscription_categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user,
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (category: Partial<Category>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("subscription_categories")
        .insert([{
          ...category,
          user_id: user.id,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil ditambahkan!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menambahkan kategori");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subscription_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil dihapus!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus kategori");
    },
  });
};
