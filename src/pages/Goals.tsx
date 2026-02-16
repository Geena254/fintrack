import GoalsTracker from "@/components/GoalsTracker";

const Goals = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Goals</h1>
        <p className="text-sm text-muted-foreground">Track progress towards your financial goals.</p>
      </div>
      <GoalsTracker />
    </div>
  );
};

export default Goals;
