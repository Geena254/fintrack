import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import BudgetOverview from "@/components/BudgetOverview";
import GoalsTracker from "@/components/GoalsTracker";
import SpendingChart from "@/components/SpendingChart";

const Index = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SpendingChart />
        </div>
        <div className="lg:col-span-2">
          <BudgetOverview />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <TransactionList />
        </div>
        <div className="lg:col-span-3">
          <GoalsTracker />
        </div>
      </div>
    </div>
  );
};

export default Index;
