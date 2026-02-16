import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionList from "@/components/TransactionList";
import { useTransactions } from "@/hooks/useFinanceData";

const Transactions = () => {
  const { data: transactions = [] } = useTransactions();

  const exportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = transactions.map((tx) => [tx.date, tx.description, tx.category, tx.type, tx.amount]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Manage and track all your transactions.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          disabled={transactions.length === 0}
          className="gap-1.5"
        >
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>
      <TransactionList showFilters />
    </div>
  );
};

export default Transactions;
