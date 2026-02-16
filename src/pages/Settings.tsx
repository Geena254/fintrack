import { useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Pencil, Check, X, Camera, Phone, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, fullName, avatarUrl, phoneNumber, refreshProfile, signOut } = useAuth();
  const { toast } = useToast();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(fullName);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(phoneNumber);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleEditName = () => { setName(fullName); setEditingName(true); };
  const handleCancelName = () => { setEditingName(false); setName(fullName); };

  const handleSaveName = async () => {
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
      setEditingName(false);
      refreshProfile();
    }
  };

  const handleEditPhone = () => { setPhone(phoneNumber); setEditingPhone(true); };
  const handleCancelPhone = () => { setEditingPhone(false); setPhone(phoneNumber); };

  const handleSavePhone = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ phone_number: phone?.trim() || null })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: "Failed to update phone number.", variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Your phone number has been updated." });
      setEditingPhone(false);
      refreshProfile();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image under 2MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl })
      .eq("user_id", user.id);

    setUploading(false);
    if (updateError) {
      toast({ title: "Error", description: "Failed to save avatar.", variant: "destructive" });
    } else {
      toast({ title: "Avatar updated", description: "Your profile picture has been updated." });
      refreshProfile();
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      <div>
        <p className="text-sm text-muted-foreground">Manage your app preferences.</p>
      </div>

      {/* User Profile */}
      <div className="glass-card rounded-xl p-5 space-y-5">
        <p className="text-sm font-medium text-card-foreground">Profile</p>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="h-16 w-16">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="Profile" />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 max-w-[220px]"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveName} disabled={saving}>
                  <Check className="w-4 h-4 text-primary" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelName}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-card-foreground">{fullName || "User"}</p>
                <button onClick={handleEditName} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium text-card-foreground">Phone Number</p>
          </div>
          {editingPhone ? (
            <div className="flex items-center gap-2">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254..."
                className="h-9 max-w-[180px]"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSavePhone} disabled={saving}>
                <Check className="w-4 h-4 text-primary" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelPhone}>
                <X className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{phoneNumber || "Not set"}</span>
              <button onClick={handleEditPhone} className="text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="w-full glass-card rounded-xl p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
};

export default Settings;
