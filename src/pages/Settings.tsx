import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your app preferences.</p>
      </div>
      <div className="glass-card rounded-xl p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-card-foreground">Appearance</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark mode.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-card-foreground">Currency</p>
            <p className="text-xs text-muted-foreground">Default currency for all amounts.</p>
          </div>
          <span className="text-sm font-mono text-muted-foreground">KSh (Kenyan Shilling)</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
