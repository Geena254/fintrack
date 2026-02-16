import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import TransactionFormDialog from "@/components/TransactionFormDialog";
import { useTransactions, useSaveTransaction, useDeleteTransaction } from "@/hooks/useFinanceData";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ShoppingCart, Home, Car, Utensils, Zap, Wifi, Heart,
  DollarSign, TrendingUp, Plane, BookOpen, Gift, CreditCard,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  Salary: DollarSign, Freelance: TrendingUp, Groceries: ShoppingCart,
  Housing: Home, Transport: Car, Dining: Utensils, Utilities: Zap,
  Entertainment: Heart, Internet: Wifi, Travel: Plane,
  Education: BookOpen, Gifts: Gift, Other: CreditCard,
};

interface TransactionListProps {
  showFilters?: boolean;
  maxHeight?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

const TransactionList = ({ showFilters = false, maxHeight, dateFrom: externalDateFrom, dateTo: externalDateTo }: TransactionListProps) => {
  const { data: transactions = [], isLoading } = useTransactions();
  const saveMutation = useSaveTransaction();
  const deleteMutation = useDeleteTransaction();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const allCategories = useMemo(() => [...new Set(transactions.map((t) => t.category))], [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && tx.category !== categoryFilter) return false;
      const effectiveFrom = dateFrom || externalDateFrom;
      const effectiveTo = dateTo || externalDateTo;
      if (effectiveFrom && new Date(tx.date) < effectiveFrom) return false;
      if (effectiveTo && new Date(tx.date) > effectiveTo) return false;
      return true;
    });
  }, [transactions, search, categoryFilter, dateFrom, dateTo, externalDateFrom, externalDateTo]);

  const hasActiveFilters = search || categoryFilter !== "all" || dateFrom || dateTo;
  const clearFilters = () => { setSearch(""); setCategoryFilter("all"); setDateFrom(undefined); setDateTo(undefined); };

  const handleSave = (tx: { id?: string; description: string; amount: number; type: "income" | "expense"; category: string; date: string }) => {
    saveMutation.mutate(tx, {
      onSuccess: () => toast.success(tx.id ? "Transaction updated" : "Transaction added"),
      onError: (e) => toast.error(e.message),
    });
    setEditingTx(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => toast.success("Transaction deleted"),
        onError: (e) => toast.error(e.message),
      });
      setDeletingId(null);
    }
  };

  const txList = (
    <div className="space-y-1">
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No transactions found.</p>
      ) : (
        filtered.map((tx, i) => {
          const Icon = categoryIcons[tx.category] || CreditCard;
          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="group flex items-center gap-3 py-3 border-b border-border/50 last:border-0"
            >
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
              </div>
              <span className={`text-sm font-semibold font-mono ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                {tx.type === "income" ? "+" : "-"}KSh {Number(tx.amount).toLocaleString()}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingTx(tx); setFormOpen(true); }} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => setDeletingId(tx.id)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );

  return (
    <>
      <div className="glass-card rounded-xl p-5 flex flex-col" style={maxHeight ? { maxHeight } : undefined}>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-lg font-semibold text-card-foreground">
            {showFilters ? "All Transactions" : "Recent Transactions"}
          </h2>
          <Button size="sm" onClick={() => { setEditingTx(null); setFormOpen(true); }} className="gap-1.5">
            <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add</span>
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-3 mb-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />{dateFrom ? format(dateFrom, "MMM dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />{dateTo ? format(dateTo, "MMM dd") : "To"}
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

        {maxHeight ? (
          <ScrollArea className="flex-1 min-h-0">
            {txList}
          </ScrollArea>
        ) : txList}
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
