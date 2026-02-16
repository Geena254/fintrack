import { motion } from "framer-motion";
import {
  LayoutDashboard, Receipt, PiggyBank, Target,
  Settings, TrendingUp, ChevronLeft, ChevronRight, Sun, Moon,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Receipt, label: "Transactions", to: "/transactions" },
  { icon: PiggyBank, label: "Budgets", to: "/budgets" },
  { icon: Target, label: "Goals", to: "/goals" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

const AppSidebar = ({ onClose }: { onClose?: () => void }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50 shrink-0 sticky left-0 top-0"
    >
      <div className="flex items-center gap-3 h-16 border-b border-sidebar-border px-[10px]">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-sidebar-accent-foreground text-lg tracking-tight"
          >
            FinTrack
          </motion.span>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/dashboard"}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
          {!collapsed && <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
