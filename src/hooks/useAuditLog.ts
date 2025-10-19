import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface AuditLog {
  id: string;
  subscription_id: string;
  user_id: string;
  action: string;
  changes: any;
  created_at: string;
}

export const useAuditLog = (subscriptionId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["auditLog", subscriptionId, user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      let query = supabase
        .from("subscription_audit_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (subscriptionId) {
        query = query.eq("subscription_id", subscriptionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AuditLog[];
    },
    enabled: !!user,
  });
};
