import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { mockGoals, FinancialGoal } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import GoalFormDialog from "@/components/GoalFormDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GoalsTrackerProps {
  editable?: boolean;
}

const GoalsTracker = ({ editable = false }: GoalsTrackerProps) => {
  const [goals, setGoals] = useState<FinancialGoal[]>(mockGoals);
  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSave = (g: FinancialGoal) => {
    setGoals((prev) => {
      const idx = prev.findIndex((x) => x.id === g.id);
      if (idx >= 0) { const u = [...prev]; u[idx] = g; return u; }
      return [...prev, g];
    });
    setEditingGoal(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      setGoals((prev) => prev.filter((x) => x.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Financial Goals</h2>
          <Button size="sm" onClick={() => { setEditingGoal(null); setFormOpen(true); }} className="gap-1.5">
            <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Goal</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goals.map((goal, i) => {
            const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="group rounded-lg border border-border/50 p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                      <goal.icon className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">Due {goal.deadline}</p>
                    </div>
                  </div>
                  {editable && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingGoal(goal); setFormOpen(true); }} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors">
                        <Pencil className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button onClick={() => setDeletingId(goal.id)} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-lg font-bold font-mono text-card-foreground">
                    KSh {goal.currentAmount.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / KSh {goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pct}% achieved</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <GoalFormDialog open={formOpen} onOpenChange={setFormOpen} goal={editingGoal} onSave={handleSave} />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete goal?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GoalsTracker;
