import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const iconNames = ["Housing", "Groceries", "Transport", "Dining", "Utilities", "Entertainment", "Internet", "Travel", "Education", "Gifts", "Other"];

const colorOptions = [
  { label: "Blue", value: "hsl(var(--chart-budget))" },
  { label: "Green", value: "hsl(var(--chart-income))" },
  { label: "Teal", value: "hsl(var(--chart-savings))" },
  { label: "Red", value: "hsl(var(--chart-expense))" },
  { label: "Purple", value: "hsl(var(--primary))" },
  { label: "Cyan", value: "hsl(var(--info))" },
];

interface BudgetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: { id?: string; name: string; allocated: number; spent: number; icon: string; color: string } | null;
  onSave: (budget: { id?: string; name: string; allocated: number; spent: number; icon: string; color: string }) => void;
}

const BudgetFormDialog = ({ open, onOpenChange, budget, onSave }: BudgetFormDialogProps) => {
  const [name, setName] = useState("");
  const [allocated, setAllocated] = useState("");
  const [spent, setSpent] = useState("");
  const [iconKey, setIconKey] = useState("Other");
  const [color, setColor] = useState(colorOptions[0].value);

  useEffect(() => {
    if (budget) {
      setName(budget.name); setAllocated(budget.allocated.toString()); setSpent(budget.spent.toString());
      setIconKey(budget.icon || "Other"); setColor(budget.color);
    } else {
      setName(""); setAllocated(""); setSpent("0"); setIconKey("Other"); setColor(colorOptions[0].value);
    }
  }, [budget, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !allocated || Number(allocated) <= 0) return;
    onSave({
      id: budget?.id,
      name: name.trim(),
      allocated: Number(allocated),
      spent: Number(spent) || 0,
      icon: iconKey,
      color,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget" : "New Budget Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-name">Name</Label>
            <Input id="budget-name" placeholder="e.g. Groceries" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-allocated">Allocated (KSh)</Label>
              <Input id="budget-allocated" type="number" min="1" placeholder="0" value={allocated} onChange={(e) => setAllocated(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-spent">Spent (KSh)</Label>
              <Input id="budget-spent" type="number" min="0" placeholder="0" value={spent} onChange={(e) => setSpent(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={iconKey} onValueChange={setIconKey}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {iconNames.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {colorOptions.map((c) => <SelectItem key={c.label} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{budget ? "Save Changes" : "Add Budget"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetFormDialog;
