import { motion } from "framer-motion";
import { mockGoals } from "@/data/mockData";

const GoalsTracker = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">Financial Goals</h2>
        <button className="text-sm text-primary font-medium hover:underline">Add Goal</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {mockGoals.map((goal, i) => {
          const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="rounded-lg border border-border/50 p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <goal.icon className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{goal.name}</p>
                  <p className="text-xs text-muted-foreground">Due {goal.deadline}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-lg font-bold font-mono text-card-foreground">
                  ${goal.currentAmount.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  / ${goal.targetAmount.toLocaleString()}
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
  );
};

export default GoalsTracker;
