import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { mockTransactions, Transaction } from "@/data/mockData";
import { Button } from "@/components/ui/button";
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

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
          <h2 className="text-lg font-semibold text-card-foreground">Recent Transactions</h2>
          <Button size="sm" onClick={openCreate} className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
        <div className="space-y-1">
          {transactions.map((tx, i) => (
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
          ))}
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
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
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
