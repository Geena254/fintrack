import BudgetOverview from "@/components/BudgetOverview";
import SpendingChart from "@/components/SpendingChart";

const Budgets = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Budgets</h1>
        <p className="text-sm text-muted-foreground">Track your spending against budget categories.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetOverview />
        <SpendingChart />
      </div>
    </div>
  );
};

export default Budgets;
