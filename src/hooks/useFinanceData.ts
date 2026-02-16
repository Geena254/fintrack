import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ── Transactions ──
export const useTransactions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useSaveTransaction = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (tx: { id?: string; description: string; amount: number; type: string; category: string; date: string }) => {
      if (tx.id) {
        const { error } = await supabase.from("transactions").update({
          description: tx.description, amount: tx.amount, type: tx.type, category: tx.category, date: tx.date,
        }).eq("id", tx.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("transactions").insert({
          user_id: user!.id, description: tx.description, amount: tx.amount, type: tx.type, category: tx.category, date: tx.date,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
};

export const useDeleteTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
};

// ── Budgets ──
export const useBudgets = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("budgets").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useSaveBudget = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (b: { id?: string; name: string; allocated: number; spent: number; icon: string; color: string }) => {
      if (b.id) {
        const { error } = await supabase.from("budgets").update({
          name: b.name, allocated: b.allocated, spent: b.spent, icon: b.icon, color: b.color,
        }).eq("id", b.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("budgets").insert({
          user_id: user!.id, name: b.name, allocated: b.allocated, spent: b.spent, icon: b.icon, color: b.color,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

export const useDeleteBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

// ── Goals ──
export const useGoals = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("goals").select("*").order("deadline");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useSaveGoal = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (g: { id?: string; name: string; target_amount: number; current_amount: number; deadline: string; icon: string }) => {
      if (g.id) {
        const { error } = await supabase.from("goals").update({
          name: g.name, target_amount: g.target_amount, current_amount: g.current_amount, deadline: g.deadline, icon: g.icon,
        }).eq("id", g.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("goals").insert({
          user_id: user!.id, name: g.name, target_amount: g.target_amount, current_amount: g.current_amount, deadline: g.deadline, icon: g.icon,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
};

export const useDeleteGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
};
