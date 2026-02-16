import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";

const cards = [
  { label: "Total Balance", value: "KSh 12,847.50", change: "+2.4%", positive: true, icon: Wallet },
  { label: "Monthly Income", value: "KSh 6,050.00", change: "+8.1%", positive: true, icon: ArrowUpRight },
  { label: "Monthly Expenses", value: "KSh 3,800.21", change: "-5.2%", positive: true, icon: ArrowDownRight },
  { label: "Net Savings", value: "KSh 2,249.79", change: "+12.3%", positive: true, icon: TrendingUp },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const SummaryCards = () => {
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
          <p className={`text-xs mt-1 font-medium ${card.positive ? "text-success" : "text-destructive"}`}>
            {card.change} from last month
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SummaryCards;
