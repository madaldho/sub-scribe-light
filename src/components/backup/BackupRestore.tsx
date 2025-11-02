import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, AlertCircle } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function BackupRestore() {
  const { data: subscriptions } = useSubscriptions();
  const { data: paymentMethods } = usePaymentMethods();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = () => {
    const backup = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        subscriptions: subscriptions || [],
        payment_methods: paymentMethods || [],
      },
    };

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `substracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Backup berhasil didownload!");
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.version || !backup.data) {
        throw new Error("Format backup tidak valid");
      }

      // Restore payment methods first
      if (backup.data.payment_methods?.length > 0) {
        const { error: pmError } = await supabase
          .from("payment_methods")
          .upsert(backup.data.payment_methods);
        if (pmError) throw pmError;
      }

      // Then restore subscriptions
      if (backup.data.subscriptions?.length > 0) {
        const { error: subsError } = await supabase
          .from("subscriptions")
          .upsert(backup.data.subscriptions);
        if (subsError) throw subsError;
      }

      toast.success("Data berhasil direstore!");
      window.location.reload();
    } catch (error: any) {
      toast.error("Gagal restore data: " + error.message);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>
          Backup semua data langganan Anda atau restore dari backup sebelumnya
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Backup akan menyimpan semua langganan dan metode pembayaran. Restore akan menggabungkan data, bukan menimpa.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button onClick={handleBackup} className="flex-1 w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Backup
          </Button>

          <Button
            variant="outline"
            className="flex-1 w-full relative"
            disabled={isRestoring}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isRestoring ? "Restoring..." : "Restore Backup"}
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isRestoring}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
