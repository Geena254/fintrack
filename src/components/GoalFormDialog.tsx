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
import type { FinancialGoal } from "@/data/mockData";
import { Heart, Plane, BookOpen, Gift, Home, Car, CreditCard } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Savings: Heart,
  Travel: Plane,
  Education: BookOpen,
  Gifts: Gift,
  Housing: Home,
  Vehicle: Car,
  Other: CreditCard,
};

const iconNames = Object.keys(iconMap);

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: FinancialGoal | null;
  onSave: (goal: FinancialGoal) => void;
}

const GoalFormDialog = ({ open, onOpenChange, goal, onSave }: GoalFormDialogProps) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [iconKey, setIconKey] = useState("Other");
  const [deadline, setDeadline] = useState<Date>(new Date());

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setCurrentAmount(goal.currentAmount.toString());
      const foundKey = iconNames.find((k) => iconMap[k] === goal.icon) || "Other";
      setIconKey(foundKey);
      setDeadline(new Date(goal.deadline));
    } else {
      setName("");
      setTargetAmount("");
      setCurrentAmount("0");
      setIconKey("Other");
      setDeadline(new Date());
    }
  }, [goal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || Number(targetAmount) <= 0) return;

    onSave({
      id: goal?.id || crypto.randomUUID(),
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      deadline: format(deadline, "yyyy-MM-dd"),
      icon: iconMap[iconKey] || CreditCard,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "New Financial Goal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input id="goal-name" placeholder="e.g. Emergency Fund" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target (KSh)</Label>
              <Input id="goal-target" type="number" min="1" placeholder="0" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-current">Saved (KSh)</Label>
              <Input id="goal-current" type="number" min="0" placeholder="0" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={iconKey} onValueChange={setIconKey}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {iconNames.map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(deadline, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={deadline} onSelect={(d) => d && setDeadline(d)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{goal ? "Save Changes" : "Add Goal"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalFormDialog;
