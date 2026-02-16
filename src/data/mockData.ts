import { 
  TrendingUp, TrendingDown, DollarSign, Target, 
  CreditCard, ShoppingCart, Home, Car, Utensils, 
  Zap, Wifi, Heart, Plane, BookOpen, Gift
} from "lucide-react";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  icon: React.ElementType;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  icon: React.ElementType;
  color: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: React.ElementType;
}

export const mockTransactions: Transaction[] = [
  { id: "1", description: "Salary Deposit", amount: 5200, type: "income", category: "Salary", date: "2026-02-15", icon: DollarSign },
  { id: "2", description: "Whole Foods Market", amount: 127.43, type: "expense", category: "Groceries", date: "2026-02-14", icon: ShoppingCart },
  { id: "3", description: "Netflix Subscription", amount: 15.99, type: "expense", category: "Entertainment", date: "2026-02-13", icon: Zap },
  { id: "4", description: "Rent Payment", amount: 1800, type: "expense", category: "Housing", date: "2026-02-12", icon: Home },
  { id: "5", description: "Gas Station", amount: 52.30, type: "expense", category: "Transport", date: "2026-02-11", icon: Car },
  { id: "6", description: "Freelance Project", amount: 850, type: "income", category: "Freelance", date: "2026-02-10", icon: TrendingUp },
  { id: "7", description: "Restaurant Dinner", amount: 68.50, type: "expense", category: "Dining", date: "2026-02-09", icon: Utensils },
  { id: "8", description: "Internet Bill", amount: 79.99, type: "expense", category: "Utilities", date: "2026-02-08", icon: Wifi },
];

export const mockBudgets: BudgetCategory[] = [
  { id: "1", name: "Housing", allocated: 2000, spent: 1800, icon: Home, color: "hsl(var(--chart-budget))" },
  { id: "2", name: "Groceries", allocated: 500, spent: 327, icon: ShoppingCart, color: "hsl(var(--chart-income))" },
  { id: "3", name: "Transport", allocated: 300, spent: 182, icon: Car, color: "hsl(var(--chart-savings))" },
  { id: "4", name: "Dining", allocated: 250, spent: 198, icon: Utensils, color: "hsl(var(--chart-expense))" },
  { id: "5", name: "Utilities", allocated: 200, spent: 160, icon: Zap, color: "hsl(var(--info))" },
  { id: "6", name: "Entertainment", allocated: 150, spent: 96, icon: Heart, color: "hsl(var(--primary))" },
];

export const mockGoals: FinancialGoal[] = [
  { id: "1", name: "Emergency Fund", targetAmount: 15000, currentAmount: 8750, deadline: "2026-12-31", icon: Heart },
  { id: "2", name: "Vacation Fund", targetAmount: 5000, currentAmount: 2300, deadline: "2026-08-01", icon: Plane },
  { id: "3", name: "New Laptop", targetAmount: 2500, currentAmount: 1800, deadline: "2026-05-01", icon: BookOpen },
  { id: "4", name: "Holiday Gifts", targetAmount: 1000, currentAmount: 200, deadline: "2026-12-15", icon: Gift },
];

export const monthlyData = [
  { month: "Sep", income: 5800, expenses: 4200 },
  { month: "Oct", income: 6100, expenses: 4500 },
  { month: "Nov", income: 5600, expenses: 3900 },
  { month: "Dec", income: 7200, expenses: 5100 },
  { month: "Jan", income: 5900, expenses: 4300 },
  { month: "Feb", income: 6050, expenses: 3800 },
];
