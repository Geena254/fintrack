import GoalsTracker from "@/components/GoalsTracker";

const Goals = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <p className="text-sm text-muted-foreground">Track progress towards your financial goals.</p>
      </div>
      <GoalsTracker editable />
    </div>
  );
};

export default Goals;
