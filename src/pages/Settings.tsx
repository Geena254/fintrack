import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Pencil, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, fullName, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(fullName);
  const [saving, setSaving] = useState(false);

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleEdit = () => {
    setName(fullName);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setName(fullName);
  };

  const handleSave = async () => {
    if (!user || !name?.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() })
      .eq("user_id", user.id);
    setSaving(false);

    if (error) {
      toast({ title: "Error", description: "Failed to update name.", variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Your name has been updated." });
      setEditing(false);
      refreshProfile();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <p className="text-sm text-muted-foreground">Manage your app preferences.</p>
      </div>

      {/* User Profile */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <p className="text-sm font-medium text-card-foreground">Profile</p>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 max-w-[220px]"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave} disabled={saving}>
                  <Check className="w-4 h-4 text-primary" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-card-foreground">{fullName || "User"}</p>
                <button onClick={handleEdit} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
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
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
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
