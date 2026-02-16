import AppSidebar from "@/components/AppSidebar";
import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import BudgetOverview from "@/components/BudgetOverview";
import GoalsTracker from "@/components/GoalsTracker";
import SpendingChart from "@/components/SpendingChart";
import { Bell, Search, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, shown via overlay when toggled */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <AppSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 min-w-0 transition-all duration-200">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors lg:hidden"
            >
              <Menu className="w-4 h-4 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Welcome back! Here's your financial overview.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors hidden sm:flex">
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
      </main>
    </div>
  );
};

export default Index;
