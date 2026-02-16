import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { mockBudgets, BudgetCategory } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import BudgetFormDialog from "@/components/BudgetFormDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BudgetOverviewProps {
  editable?: boolean;
}

const BudgetOverview = ({ editable = false }: BudgetOverviewProps) => {
  const [budgets, setBudgets] = useState<BudgetCategory[]>(mockBudgets);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSave = (b: BudgetCategory) => {
    setBudgets((prev) => {
      const idx = prev.findIndex((x) => x.id === b.id);
      if (idx >= 0) { const u = [...prev]; u[idx] = b; return u; }
      return [...prev, b];
    });
    setEditingBudget(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      setBudgets((prev) => prev.filter((x) => x.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Budget Overview</h2>
          {editable ? (
            <Button size="sm" onClick={() => { setEditingBudget(null); setFormOpen(true); }} className="gap-1.5">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add</span>
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">February 2026</span>
          )}
        </div>
        <div className="space-y-4">
          {budgets.map((budget, i) => {
            const pct = Math.round((budget.spent / budget.allocated) * 100);
            const overBudget = pct > 90;
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
                    <budget.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-card-foreground">{budget.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      KSh {budget.spent.toLocaleString()} / KSh {budget.allocated.toLocaleString()}
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
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: overBudget ? "hsl(var(--destructive))" : budget.color }}
                  />
                </div>
                <p className={`text-xs mt-1 ${overBudget ? "text-destructive" : "text-muted-foreground"}`}>
                  {pct}% used · KSh {(budget.allocated - budget.spent).toLocaleString()} remaining
                </p>
              </motion.div>
            );
          })}
        </div>
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
