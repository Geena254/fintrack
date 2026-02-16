import { useAuth } from "@/contexts/AuthContext";
import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import BudgetOverview from "@/components/BudgetOverview";
import GoalsTracker from "@/components/GoalsTracker";
import SpendingChart from "@/components/SpendingChart";

const Index = () => {
  const { fullName } = useAuth();
  const firstName = fullName?.split(" ")[0] || "there";

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Welcome back, {firstName} 👋</h1>
        <p className="text-sm text-muted-foreground">Here's your financial overview.</p>
      </div>
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SpendingChart />
        </div>
        <div className="lg:col-span-2">
          <BudgetOverview maxHeight="340px" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <TransactionList maxHeight="400px" />
        </div>
        <div className="lg:col-span-3">
          <GoalsTracker />
        </div>
      </div>
    </div>
  );
};

export default Index;
