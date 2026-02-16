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
  { id: "1", description: "Salary Deposit", amount: 520000, type: "income", category: "Salary", date: "2026-02-15", icon: DollarSign },
  { id: "2", description: "Naivas Supermarket", amount: 12743, type: "expense", category: "Groceries", date: "2026-02-14", icon: ShoppingCart },
  { id: "3", description: "Netflix Subscription", amount: 1599, type: "expense", category: "Entertainment", date: "2026-02-13", icon: Zap },
  { id: "4", description: "Rent Payment", amount: 180000, type: "expense", category: "Housing", date: "2026-02-12", icon: Home },
  { id: "5", description: "Fuel Station", amount: 5230, type: "expense", category: "Transport", date: "2026-02-11", icon: Car },
  { id: "6", description: "Freelance Project", amount: 85000, type: "income", category: "Freelance", date: "2026-02-10", icon: TrendingUp },
  { id: "7", description: "Restaurant Dinner", amount: 6850, type: "expense", category: "Dining", date: "2026-02-09", icon: Utensils },
  { id: "8", description: "Internet Bill", amount: 7999, type: "expense", category: "Utilities", date: "2026-02-08", icon: Wifi },
];

export const mockBudgets: BudgetCategory[] = [
  { id: "1", name: "Housing", allocated: 200000, spent: 180000, icon: Home, color: "hsl(var(--chart-budget))" },
  { id: "2", name: "Groceries", allocated: 50000, spent: 32700, icon: ShoppingCart, color: "hsl(var(--chart-income))" },
  { id: "3", name: "Transport", allocated: 30000, spent: 18200, icon: Car, color: "hsl(var(--chart-savings))" },
  { id: "4", name: "Dining", allocated: 25000, spent: 19800, icon: Utensils, color: "hsl(var(--chart-expense))" },
  { id: "5", name: "Utilities", allocated: 20000, spent: 16000, icon: Zap, color: "hsl(var(--info))" },
  { id: "6", name: "Entertainment", allocated: 15000, spent: 9600, icon: Heart, color: "hsl(var(--primary))" },
];

export const mockGoals: FinancialGoal[] = [
  { id: "1", name: "Emergency Fund", targetAmount: 1500000, currentAmount: 875000, deadline: "2026-12-31", icon: Heart },
  { id: "2", name: "Vacation Fund", targetAmount: 500000, currentAmount: 230000, deadline: "2026-08-01", icon: Plane },
  { id: "3", name: "New Laptop", targetAmount: 250000, currentAmount: 180000, deadline: "2026-05-01", icon: BookOpen },
  { id: "4", name: "Holiday Gifts", targetAmount: 100000, currentAmount: 20000, deadline: "2026-12-15", icon: Gift },
];

export const monthlyData = [
  { month: "Sep", income: 580000, expenses: 420000 },
  { month: "Oct", income: 610000, expenses: 450000 },
  { month: "Nov", income: 560000, expenses: 390000 },
  { month: "Dec", income: 720000, expenses: 510000 },
  { month: "Jan", income: 590000, expenses: 430000 },
  { month: "Feb", income: 605000, expenses: 380000 },
];
