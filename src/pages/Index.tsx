import AppSidebar from "@/components/AppSidebar";
import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import BudgetOverview from "@/components/BudgetOverview";
import GoalsTracker from "@/components/GoalsTracker";
import SpendingChart from "@/components/SpendingChart";
import { Bell, Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark flex">
      <AppSidebar />

      <main className="flex-1 min-w-0 transition-all duration-200">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Welcome back! Here's your financial overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors relative">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              J
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6 max-w-7xl">
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
      </main>
    </div>
  );
};

export default Index;
