import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import BudgetOverview from "@/components/BudgetOverview";
import SpendingChart from "@/components/SpendingChart";
import DashboardDateFilter from "@/components/DashboardDateFilter";

const Index = () => {
  const { fullName } = useAuth();
  const firstName = fullName?.split(" ")[0] || "there";

  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Welcome back, {firstName} 👋</h1>
          <p className="text-sm text-muted-foreground">Here's your financial overview.</p>
        </div>
        <DashboardDateFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      </div>
      <SummaryCards dateFrom={dateFrom} dateTo={dateTo} />
      <SpendingChart dateFrom={dateFrom} dateTo={dateTo} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <BudgetOverview maxHeight="340px" dateFrom={dateFrom} dateTo={dateTo} />
        </div>
        <div className="lg:col-span-2">
          <TransactionList maxHeight="400px" dateFrom={dateFrom} dateTo={dateTo} />
        </div>
      </div>
    </div>
  );
};

export default Index;
