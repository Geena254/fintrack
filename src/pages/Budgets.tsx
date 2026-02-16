import BudgetOverview from "@/components/BudgetOverview";
import SpendingChart from "@/components/SpendingChart";

const Budgets = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <p className="text-sm text-muted-foreground">Track your spending against budget categories.</p>
      </div>
      <BudgetOverview editable maxHeight="340px" />
      <SpendingChart />
    </div>
  );
};

export default Budgets;
