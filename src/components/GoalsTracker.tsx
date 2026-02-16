import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoalFormDialog from "@/components/GoalFormDialog";
import { useGoals, useSaveGoal, useDeleteGoal } from "@/hooks/useFinanceData";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Heart, Plane, BookOpen, Gift, Home, Car, CreditCard, Target,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Savings: Heart, Travel: Plane, Education: BookOpen, Gifts: Gift,
  Housing: Home, Vehicle: Car, Target: Target, Other: CreditCard,
};

interface GoalsTrackerProps {
  editable?: boolean;
}

const GoalsTracker = ({ editable = false }: GoalsTrackerProps) => {
  const { data: goals = [], isLoading } = useGoals();
  const saveMutation = useSaveGoal();
  const deleteMutation = useDeleteGoal();

  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSave = (g: { id?: string; name: string; target_amount: number; current_amount: number; deadline: string; icon: string }) => {
    saveMutation.mutate(g, {
      onSuccess: () => toast.success(g.id ? "Goal updated" : "Goal added"),
      onError: (e) => toast.error(e.message),
    });
    setEditingGoal(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => toast.success("Goal deleted"),
        onError: (e) => toast.error(e.message),
      });
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Financial Goals</h2>
          {editable && (
            <Button size="sm" onClick={() => { setEditingGoal(null); setFormOpen(true); }} className="gap-1.5">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Goal</span>
            </Button>
          )}
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
        ) : goals.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No goals yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {goals.map((goal, i) => {
              const pct = Number(goal.target_amount) > 0 ? Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100) : 0;
              const Icon = iconMap[goal.icon] || CreditCard;
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
                        <Icon className="w-4 h-4 text-accent-foreground" />
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
                      KSh {Number(goal.current_amount).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / KSh {Number(goal.target_amount).toLocaleString()}
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
        )}
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
