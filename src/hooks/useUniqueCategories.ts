import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useUniqueCategories = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["unique-categories", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("category")
        .eq("user_id", user.id);

      if (error) throw error;
      
      // Get unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
      return uniqueCategories as string[];
    },
    enabled: !!user,
  });
};
