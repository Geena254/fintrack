import { motion } from "framer-motion";
import { mockTransactions } from "@/data/mockData";

const TransactionList = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">Recent Transactions</h2>
        <button className="text-sm text-primary font-medium hover:underline">View All</button>
      </div>
      <div className="space-y-1">
        {mockTransactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0"
          >
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <tx.icon className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
            </div>
            <span
              className={`text-sm font-semibold font-mono ${
                tx.type === "income" ? "text-success" : "text-destructive"
              }`}
            >
              {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
