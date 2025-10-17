import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, DollarSign, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currency, setCurrency] = useState("IDR");

  const handleDeleteAccount = async () => {
    // TODO: Implement account deletion
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Pengaturan
          </h1>
          <p className="text-foreground-muted">
            Kelola preferensi akun Anda
          </p>
        </header>

        {/* Profile Section */}
        <div className="neumo-card p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Profil</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="neumo-input h-12 border-0 opacity-60"
              />
              <p className="text-xs text-foreground-muted">
                Email tidak dapat diubah
              </p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="neumo-card p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Preferensi</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-foreground">
                Mata Uang Default
              </Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="neumo-input h-12 border-0 focus-visible:ring-primary"
              />
              <p className="text-xs text-foreground-muted">
                Mata uang yang digunakan untuk langganan baru
              </p>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="neumo-card p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Notifikasi</h2>
          </div>

          <div className="space-y-4">
            <p className="text-foreground-muted">
              Fitur notifikasi akan segera hadir. Anda akan dapat mengatur pengingat untuk pembayaran yang akan datang.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="neumo-card p-6 md:p-8 border-2 border-destructive/20">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="h-5 w-5 text-destructive" />
            <h2 className="text-xl font-bold text-destructive">Zona Berbahaya</h2>
          </div>

          <Separator className="my-4 bg-border" />

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Keluar dari Akun</h3>
              <p className="text-sm text-foreground-muted mb-4">
                Keluar dari sesi Anda saat ini
              </p>
              <Button
                onClick={() => signOut()}
                variant="outline"
              >
                Keluar
              </Button>
            </div>

            <Separator className="my-4 bg-border" />

            <div>
              <h3 className="font-semibold text-destructive mb-2">Hapus Akun</h3>
              <p className="text-sm text-foreground-muted mb-4">
                Hapus akun Anda secara permanen beserta semua data
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Hapus Akun
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="neumo-card border-0">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun Anda secara permanen 
                      dan menghapus semua data termasuk langganan, riwayat pembayaran, kategori, dan metode pembayaran.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Ya, Hapus Akun Saya
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
