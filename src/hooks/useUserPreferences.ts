import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: string;
  has_completed_onboarding: boolean;
  notification_preferences: {
    email: boolean;
    push: boolean;
    days_before: number[];
  };
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userPreferences", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no preferences exist, create default ones
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from("user_preferences")
          .insert([{ user_id: user.id }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newData as UserPreferences;
      }
      
      return data as UserPreferences;
    },
    enabled: !!user,
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<UserPreferences>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_preferences")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
      toast.success("Pengaturan berhasil diupdate");
    },
  });
};
