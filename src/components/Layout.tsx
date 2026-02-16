import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { Menu, Moon, Sun, LogOut, Settings, UserPen } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/budgets": "Budgets",
  "/goals": "Goals",
  "/settings": "Settings",
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { fullName, avatarUrl, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || "FinTrack";
  const initials = fullName ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <AppSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      <main className="flex-1 min-w-0 transition-all duration-200">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors lg:hidden">
              <Menu className="w-4 h-4 text-muted-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    {avatarUrl ? <AvatarImage src={avatarUrl} alt="Profile" /> : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-lg z-50">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground truncate">{fullName || "User"}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer gap-2">
                  <UserPen className="w-4 h-4" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
