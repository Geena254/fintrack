import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { mockTransactions, Transaction } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TransactionFormDialog from "@/components/TransactionFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const allCategories = [...new Set(mockTransactions.map((t) => t.category))];

interface TransactionListProps {
  showFilters?: boolean;
}

const TransactionList = ({ showFilters = false }: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && tx.category !== categoryFilter) return false;
      if (dateFrom && new Date(tx.date) < dateFrom) return false;
      if (dateTo && new Date(tx.date) > dateTo) return false;
      return true;
    });
  }, [transactions, search, categoryFilter, dateFrom, dateTo]);

  const hasActiveFilters = search || categoryFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleSave = (tx: Transaction) => {
    setTransactions((prev) => {
      const idx = prev.findIndex((t) => t.id === tx.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = tx;
        return updated;
      }
      return [tx, ...prev];
    });
    setEditingTx(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      setTransactions((prev) => prev.filter((t) => t.id !== deletingId));
      setDeletingId(null);
    }
  };

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingTx(null);
    setFormOpen(true);
  };

  return (
    <>
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            {showFilters ? "All Transactions" : "Recent Transactions"}
          </h2>
          <Button size="sm" onClick={openCreate} className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM dd") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                  <X className="w-3.5 h-3.5" /> Clear
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No transactions found.</p>
          ) : (
            filtered.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="group flex items-center gap-3 py-3 border-b border-border/50 last:border-0"
              >
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <tx.icon className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
                </div>
                <span
                  className={`text-sm font-semibold font-mono ${
                    tx.type === "income" ? "text-success" : "text-destructive"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}KSh {tx.amount.toLocaleString()}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(tx)}
                    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setDeletingId(tx.id)}
                    className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editingTx}
        onSave={handleSave}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionList;
