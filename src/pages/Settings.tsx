import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaymentMethodsSection } from "@/components/settings/PaymentMethodsSection";
import { BackupRestore } from "@/components/backup/BackupRestore";
import { useUserPreferences, useUpdateUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/settings/ThemeToggle";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  const [currency, setCurrency] = useState("IDR");

  const handleSignOut = () => {
    signOut();
  };

  const handleDeleteAccount = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Pengaturan
          </h1>
          <p className="text-muted-foreground">
            Kelola preferensi dan akun Anda
          </p>
        </header>

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Profil</CardTitle>
            <CardDescription>Informasi akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Section */}
        <PaymentMethodsSection />

        {/* Notification Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Notifikasi</CardTitle>
            <CardDescription>Atur pengingat pembayaran</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">Pengingat Email</p>
                <p className="text-sm text-muted-foreground">Terima notifikasi via email</p>
              </div>
              <Switch
                checked={preferences?.notification_preferences?.email ?? true}
                onCheckedChange={(checked) => {
                  const current = preferences?.notification_preferences || { email: true, push: false, days_before: [7, 3, 1] };
                  updatePreferences.mutate({
                    notification_preferences: { ...current, email: checked }
                  });
                }}
                className="flex-shrink-0"
              />
            </div>
            <div>
              <p className="font-medium mb-2">Kirim pengingat</p>
              <p className="text-sm text-muted-foreground break-words">
                Saat ini: {preferences?.notification_preferences?.days_before?.join(', ') || '7, 3, 1'} hari sebelum jatuh tempo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Restore */}
        <BackupRestore />

        {/* Preferences Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Preferensi</CardTitle>
            <CardDescription>Atur preferensi aplikasi Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Mata Uang Default</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency" className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tema Aplikasi</Label>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Mode Gelap/Terang</p>
                  <p className="text-sm text-muted-foreground">Ubah tampilan aplikasi</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Aksi Akun</CardTitle>
            <CardDescription>Kelola akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSignOut}
              aria-label="Keluar dari akun"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Akun
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border sm:max-w-md mx-4">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Hapus Akun</AlertDialogTitle>
                  <AlertDialogDescription className="break-words">
                    Apakah Anda yakin ingin menghapus akun? Semua data Anda akan dihapus secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Hapus Akun
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
