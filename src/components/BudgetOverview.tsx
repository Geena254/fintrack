import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import BudgetFormDialog from "@/components/BudgetFormDialog";
import { useBudgets, useSaveBudget, useDeleteBudget } from "@/hooks/useFinanceData";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ShoppingCart, Home, Car, Utensils, Zap, Wifi, Heart,
  Plane, BookOpen, Gift, CreditCard, DollarSign,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Housing: Home, Groceries: ShoppingCart, Transport: Car, Dining: Utensils,
  Utilities: Zap, Entertainment: Heart, Internet: Wifi, Travel: Plane,
  Education: BookOpen, Gifts: Gift, DollarSign: DollarSign, Other: CreditCard,
};

interface BudgetOverviewProps {
  editable?: boolean;
  maxHeight?: string;
}

const BudgetOverview = ({ editable = false, maxHeight }: BudgetOverviewProps) => {
  const { data: budgets = [], isLoading } = useBudgets();
  const saveMutation = useSaveBudget();
  const deleteMutation = useDeleteBudget();

  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSave = (b: { id?: string; name: string; allocated: number; spent: number; icon: string; color: string }) => {
    saveMutation.mutate(b, {
      onSuccess: () => toast.success(b.id ? "Budget updated" : "Budget added"),
      onError: (e) => toast.error(e.message),
    });
    setEditingBudget(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => toast.success("Budget deleted"),
        onError: (e) => toast.error(e.message),
      });
      setDeletingId(null);
    }
  };

  const budgetList = (
    <div className="space-y-4">
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
      ) : budgets.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No budgets yet.</p>
      ) : (
        budgets.map((budget, i) => {
          const pct = budget.allocated > 0 ? Math.round((Number(budget.spent) / Number(budget.allocated)) * 100) : 0;
          const overBudget = pct > 90;
          const Icon = iconMap[budget.icon] || CreditCard;
          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">{budget.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    KSh {Number(budget.spent).toLocaleString()} / KSh {Number(budget.allocated).toLocaleString()}
                  </span>
                  {editable && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingBudget(budget); setFormOpen(true); }} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors">
                        <Pencil className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button onClick={() => setDeletingId(budget.id)} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct, 100)}%` }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: overBudget ? "hsl(var(--destructive))" : budget.color }}
                />
              </div>
              <p className={`text-xs mt-1 ${overBudget ? "text-destructive" : "text-muted-foreground"}`}>
                {pct}% used · KSh {(Number(budget.allocated) - Number(budget.spent)).toLocaleString()} remaining
              </p>
            </motion.div>
          );
        })
      )}
    </div>
  );

  return (
    <>
      <div className="glass-card rounded-xl p-5 flex flex-col" style={maxHeight ? { maxHeight } : undefined}>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-lg font-semibold text-card-foreground">Budget Overview</h2>
          {editable ? (
            <Button size="sm" onClick={() => { setEditingBudget(null); setFormOpen(true); }} className="gap-1.5">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add</span>
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">February 2026</span>
          )}
        </div>
        {maxHeight ? (
          <ScrollArea className="flex-1 min-h-0">
            {budgetList}
          </ScrollArea>
        ) : budgetList}
      </div>

      {editable && (
        <>
          <BudgetFormDialog open={formOpen} onOpenChange={setFormOpen} budget={editingBudget} onSave={handleSave} />
          <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete budget category?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
};

export default BudgetOverview;
