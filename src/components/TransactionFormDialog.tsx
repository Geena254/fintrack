import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/data/mockData";
import {
  ShoppingCart, Home, Car, Utensils, Zap, Wifi, Heart,
  DollarSign, TrendingUp, Plane, BookOpen, Gift, CreditCard
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  Salary: DollarSign,
  Freelance: TrendingUp,
  Groceries: ShoppingCart,
  Housing: Home,
  Transport: Car,
  Dining: Utensils,
  Utilities: Zap,
  Entertainment: Heart,
  Internet: Wifi,
  Travel: Plane,
  Education: BookOpen,
  Gifts: Gift,
  Other: CreditCard,
};

const categories = Object.keys(categoryIcons);

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSave: (tx: Transaction) => void;
}

const TransactionFormDialog = ({ open, onOpenChange, transaction, onSave }: TransactionFormDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category);
      setDate(new Date(transaction.date));
    } else {
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("Other");
      setDate(new Date());
    }
  }, [transaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    onSave({
      id: transaction?.id || crypto.randomUUID(),
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      date: format(date, "yyyy-MM-dd"),
      icon: categoryIcons[category] || CreditCard,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Transaction" : "New Transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g. Naivas Supermarket"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KSh)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "income" | "expense")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "MMM dd")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {transaction ? "Save Changes" : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormDialog;
