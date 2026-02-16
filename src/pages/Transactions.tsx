import TransactionList from "@/components/TransactionList";

const Transactions = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">Manage and track all your transactions.</p>
      </div>
      <TransactionList showFilters />
    </div>
  );
};

export default Transactions;
