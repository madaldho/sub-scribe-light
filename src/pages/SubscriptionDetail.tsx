import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, CheckCircle, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription, useDeleteSubscription } from "@/hooks/useSubscriptions";
import { usePaymentHistory, useMarkAsPaid } from "@/hooks/usePaymentHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
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

const SubscriptionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: subscription, isLoading } = useSubscription(id!);
  const { data: paymentHistory } = usePaymentHistory(id!);
  const deleteSubscription = useDeleteSubscription();
  const markAsPaid = useMarkAsPaid();

  const handleMarkPaid = () => {
    if (!subscription) return;
    
    markAsPaid.mutate({
      subscriptionId: subscription.id,
      amount: subscription.price,
      billingCycle: subscription.billing_cycle,
      currentNextBillingDate: subscription.next_billing_date,
    });
  };

  const handleDelete = () => {
    deleteSubscription.mutate(id!, {
      onSuccess: () => {
        navigate("/subscriptions");
      }
    });
  };

  const formatBillingCycle = (cycle: string) => {
    const cycles: Record<string, string> = {
      daily: "Harian",
      weekly: "Mingguan",
      monthly: "Bulanan",
      yearly: "Tahunan"
    };
    return cycles[cycle] || cycle;
  };

  const formatStatus = (status: string) => {
    const statuses: Record<string, "Aktif" | "Berhenti" | "Uji Coba"> = {
      active: "Aktif",
      inactive: "Berhenti",
      trial: "Uji Coba"
    };
    return statuses[status] || "Aktif";
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "IDR") {
      return `Rp ${amount.toLocaleString("id-ID")}`;
    }
    return `${currency} ${amount}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="neumo-card p-6 md:p-8 mb-6">
            <Skeleton className="h-20 w-20 rounded-2xl mb-6" />
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Langganan tidak ditemukan</h1>
          <Button onClick={() => navigate("/subscriptions")}>Kembali</Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    "Aktif": "text-success bg-success/10 border-success/30",
    "Berhenti": "text-destructive bg-destructive/10 border-destructive/30",
    "Uji Coba": "text-warning bg-warning/10 border-warning/30"
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Detail Langganan</h1>
        </header>

        {/* Main Info Card */}
        <div className="neumo-card p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="neumo-card p-5 rounded-2xl text-4xl bg-background-elevated">
                🎯
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {subscription.name}
                </h1>
                <p className="text-foreground-muted">
                  {subscription.description || "-"} • {formatBillingCycle(subscription.billing_cycle)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/subscription/${subscription.id}/edit`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="neumo-card border-0">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Langganan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Ini akan menghapus langganan dan semua riwayat pembayaran terkait.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {subscription.category}
            </Badge>
            <Badge 
              variant="outline" 
              className={statusColors[formatStatus(subscription.status)]}
            >
              {formatStatus(subscription.status)}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="neumo-card p-4 rounded-xl bg-background-elevated">
              <p className="text-sm text-foreground-muted mb-1">Harga/Periode</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(subscription.price, subscription.currency)}
              </p>
            </div>

            <div className="neumo-card p-4 rounded-xl bg-background-elevated">
              <p className="text-sm text-foreground-muted mb-1">Jatuh Tempo Berikutnya</p>
              <p className="text-xl font-semibold text-foreground">
                {format(new Date(subscription.next_billing_date), "d MMMM yyyy", { locale: localeId })}
              </p>
            </div>

            {subscription.payment_method && (
              <div className="neumo-card p-4 rounded-xl bg-background-elevated">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-foreground-muted" />
                  <p className="text-sm text-foreground-muted">Metode Pembayaran</p>
                </div>
                <p className="text-foreground font-medium">{subscription.payment_method}</p>
              </div>
            )}

            <div className="neumo-card p-4 rounded-xl bg-background-elevated">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-foreground-muted" />
                <p className="text-sm text-foreground-muted">Tanggal Mulai</p>
              </div>
              <p className="text-foreground font-medium">
                {format(new Date(subscription.start_date), "d MMMM yyyy", { locale: localeId })}
              </p>
            </div>
          </div>

          {/* Notes */}
          {subscription.notes && (
            <div className="neumo-card p-4 rounded-xl bg-background-elevated mb-6">
              <p className="text-sm text-foreground-muted mb-2">Catatan</p>
              <p className="text-foreground">{subscription.notes}</p>
            </div>
          )}

          {/* Mark as Paid Button */}
          <Button
            onClick={handleMarkPaid}
            disabled={markAsPaid.isPending}
            className="w-full h-14 bg-success text-success-foreground hover:bg-success/90"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            {markAsPaid.isPending ? "Memproses..." : "Tandai Sudah Bayar"}
          </Button>
        </div>

        {/* Payment History */}
        <div className="neumo-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Riwayat Pembayaran</h2>
          
          {paymentHistory && paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="neumo-card neumo-card-hover p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="neumo-card p-2 rounded-lg bg-success/10">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {format(new Date(payment.payment_date), "d MMMM yyyy", { locale: localeId })}
                      </p>
                      <p className="text-sm text-foreground-muted">{payment.status === 'paid' ? 'Lunas' : payment.status}</p>
                    </div>
                  </div>
                  <p className="font-bold text-foreground">
                    {formatCurrency(payment.amount, subscription.currency)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-foreground-muted">Belum ada riwayat pembayaran</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetail;
