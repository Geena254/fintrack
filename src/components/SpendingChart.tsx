import { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useTransactions } from "@/hooks/useFinanceData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";

const COLORS = [
  "hsl(var(--chart-income))",
  "hsl(var(--chart-expense))",
  "hsl(var(--chart-budget))",
  "hsl(var(--chart-savings))",
  "hsl(var(--primary))",
  "hsl(var(--info))",
  "hsl(var(--destructive))",
  "hsl(var(--warning))",
];

type Filter = "all" | "income" | "expense";
type Range = "6" | "12" | "all";

interface SpendingChartProps {
  dateFrom?: Date;
  dateTo?: Date;
}

const SpendingChart = ({ dateFrom, dateTo }: SpendingChartProps) => {
  const { data: transactions = [] } = useTransactions();
  const [filter, setFilter] = useState<Filter>("all");
  const [range, setRange] = useState<Range>("12");
  const hasDateFilter = !!dateFrom || !!dateTo;

  // Build monthly aggregated data from real transactions
  const monthlyData = useMemo(() => {
    const now = new Date();
    const cutoff = hasDateFilter ? null : (range === "all" ? null : startOfMonth(subMonths(now, Number(range))));

    const map = new Map<string, { income: number; expenses: number }>();

    transactions.forEach((tx) => {
      const d = parseISO(tx.date);
      if (cutoff && d < cutoff) return;
      if (dateFrom && d < dateFrom) return;
      if (dateTo && d > dateTo) return;
      const key = format(d, "yyyy-MM");
      const entry = map.get(key) || { income: 0, expenses: 0 };
      if (tx.type === "income") entry.income += Number(tx.amount);
      else entry.expenses += Number(tx.amount);
      map.set(key, entry);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        month: format(parseISO(key + "-01"), "MMM yy"),
        income: val.income,
        expenses: val.expenses,
        savings: val.income - val.expenses,
      }));
  }, [transactions, range, dateFrom, dateTo, hasDateFilter]);

  // Category breakdown for pie chart (current month expenses)
  const categoryData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const map = new Map<string, number>();

    transactions.forEach((tx) => {
      if (tx.type !== "expense") return;
      const d = parseISO(tx.date);
      if (dateFrom || dateTo) {
        if (dateFrom && d < dateFrom) return;
        if (dateTo && d > dateTo) return;
      } else {
        if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return;
      }
      map.set(tx.category, (map.get(tx.category) || 0) + Number(tx.amount));
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, dateFrom, dateTo]);

  const rangeLabel = range === "all" ? "All time" : `Last ${range} months`;

  return (
    <div className="space-y-6">
      {/* Income vs Expenses Area Chart */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Income vs Expenses</h2>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <SelectTrigger className="h-8 w-[110px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-64">
          {monthlyData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No transaction data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-income))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-income))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-expense))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-expense))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => `KSh ${value.toLocaleString()}`}
                />
                {(filter === "all" || filter === "income") && (
                  <Area type="monotone" dataKey="income" stroke="hsl(var(--chart-income))" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
                )}
                {(filter === "all" || filter === "expense") && (
                  <Area type="monotone" dataKey="expenses" stroke="hsl(var(--chart-expense))" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row: Savings bar chart + Category pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Savings Bar Chart */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Monthly Savings</h2>
          <div className="h-56">
            {monthlyData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No data yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => `KSh ${value.toLocaleString()}`}
                  />
                  <Bar dataKey="savings" name="Net Savings" radius={[4, 4, 0, 0]}>
                    {monthlyData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.savings >= 0 ? "hsl(var(--chart-income))" : "hsl(var(--chart-expense))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Spending by Category</h2>
          <div className="h-56">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No expenses this month.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => `KSh ${value.toLocaleString()}`}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;
