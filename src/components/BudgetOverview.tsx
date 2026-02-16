import { motion } from "framer-motion";
import { mockBudgets } from "@/data/mockData";

const BudgetOverview = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">Budget Overview</h2>
        <span className="text-sm text-muted-foreground">February 2026</span>
      </div>
      <div className="space-y-4">
        {mockBudgets.map((budget, i) => {
          const pct = Math.round((budget.spent / budget.allocated) * 100);
          const overBudget = pct > 90;
          return (
            <motion.div key={budget.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <budget.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">{budget.name}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  KSh {budget.spent.toLocaleString()} / KSh {budget.allocated.toLocaleString()}
                </span>
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
  );
};

export default BudgetOverview;
