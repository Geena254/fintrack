import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";
import { useTransactions } from "@/hooks/useFinanceData";
import { useMemo } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface SummaryCardsProps {
  dateFrom?: Date;
  dateTo?: Date;
}

const SummaryCards = ({ dateFrom, dateTo }: SummaryCardsProps) => {
  const { data: transactions = [] } = useTransactions();

  const { totalIncome, totalExpenses } = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      if (!dateFrom && !dateTo) {
        const now = new Date();
        if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return;
      }
      if (tx.type === "income") totalIncome += Number(tx.amount);
      else totalExpenses += Number(tx.amount);
    });
    return { totalIncome, totalExpenses };
  }, [transactions, dateFrom, dateTo]);

  const netSavings = totalIncome - totalExpenses;
  const balance = transactions.reduce((acc, tx) => acc + (tx.type === "income" ? Number(tx.amount) : -Number(tx.amount)), 0);

  const cards = [
    { label: "Total Balance", value: `KSh ${balance.toLocaleString()}`, icon: Wallet },
    { label: "Monthly Income", value: `KSh ${totalIncome.toLocaleString()}`, icon: ArrowUpRight },
    { label: "Monthly Expenses", value: `KSh ${totalExpenses.toLocaleString()}`, icon: ArrowDownRight },
    { label: "Net Savings", value: `KSh ${netSavings.toLocaleString()}`, icon: TrendingUp },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <motion.div key={card.label} variants={item} className="glass-card rounded-xl p-5 hover:glow-primary transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{card.label}</span>
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <card.icon className="w-4 h-4 text-accent-foreground" />
            </div>
          </div>
          <p className="text-2xl font-bold text-card-foreground font-mono tracking-tight">{card.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SummaryCards;
