import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentMethods, useAddPaymentMethod, useDeletePaymentMethod } from "@/hooks/usePaymentMethods";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { toast } from "sonner";

export function PaymentMethodsSection() {
  const { data: paymentMethods = [] } = usePaymentMethods();
  const addPaymentMethod = useAddPaymentMethod();
  const deletePaymentMethod = useDeletePaymentMethod();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addPaymentMethod.mutate({
      name: formData.get("name") as string,
      provider: formData.get("provider") as string,
      type: formData.get("type") as string,
      color: formData.get("color") as string,
    }, {
      onSuccess: () => {
        setIsOpen(false);
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Metode Pembayaran</CardTitle>
            <CardDescription>Kelola metode pembayaran untuk langganan Anda</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Tambah Metode Pembayaran</DialogTitle>
                <DialogDescription>Tambahkan metode pembayaran baru untuk langganan</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="contoh: Kartu BCA"
                    required
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    name="provider"
                    placeholder="contoh: BCA, GoPay, OVO"
                    required
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipe</Label>
                  <Select name="type" defaultValue="digital_wallet" required>
                    <SelectTrigger className="border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      <SelectItem value="digital_wallet">Dompet Digital</SelectItem>
                      <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                      <SelectItem value="debit_card">Kartu Debit</SelectItem>
                      <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Warna</Label>
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    defaultValue="#3B82F6"
                    className="h-12 border-border"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1" disabled={addPaymentMethod.isPending}>
                    {addPaymentMethod.isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Belum ada metode pembayaran</p>
            <p className="text-sm">Klik tombol Tambah untuk menambahkan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: method.color + '20', color: method.color }}
                  >
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.provider} • {method.type}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(method.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Hapus Metode Pembayaran</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus metode pembayaran ini?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteId) {
                    deletePaymentMethod.mutate(deleteId);
                    setDeleteId(null);
                  }
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
