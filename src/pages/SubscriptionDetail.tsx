import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, CheckCircle, Calendar, CreditCard, Pause, Play, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription, useDeleteSubscription, useUpdateSubscriptionStatus } from "@/hooks/useSubscriptions";
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
  const updateStatus = useUpdateSubscriptionStatus();

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
    const statuses: Record<string, string> = {
      active: "Aktif",
      inactive: "Berhenti",
      paused: "Dijeda",
      cancelled: "Dibatalkan",
      trial: "Uji Coba"
    };
    return statuses[status] || "Aktif";
  };

  const handlePauseResume = () => {
    if (!subscription) return;
    const newStatus = subscription.status === 'paused' ? 'active' : 'paused';
    updateStatus.mutate({ id: subscription.id, status: newStatus });
  };

  const handleCancel = () => {
    if (!subscription) return;
    updateStatus.mutate({ id: subscription.id, status: 'cancelled' });
  };

  const formatCurrency = (amount: number, currency: string = "IDR") => {
    const currencySymbols: Record<string, string> = {
      IDR: "Rp",
      USD: "$",
      EUR: "€",
      GBP: "£",
      SGD: "S$",
      MYR: "RM",
      JPY: "¥",
      CNY: "¥",
      AUD: "A$",
      CAD: "C$",
    };

    const symbol = currencySymbols[currency] || currency;
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

    return `${symbol} ${formatted}`;
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

  const statusColors: Record<string, string> = {
    "Aktif": "text-success bg-success/10 border-success/30",
    "Berhenti": "text-destructive bg-destructive/10 border-destructive/30",
    "Dijeda": "text-warning bg-warning/10 border-warning/30",
    "Dibatalkan": "text-destructive bg-destructive/10 border-destructive/30",
    "Uji Coba": "text-primary bg-primary/10 border-primary/30"
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
              {subscription.logo_url ? (
                <img 
                  src={subscription.logo_url} 
                  alt={subscription.name} 
                  className="w-20 h-20 rounded-2xl object-contain neumo-card p-3 bg-background-elevated" 
                />
              ) : (
                <div className="neumo-card p-5 rounded-2xl text-4xl bg-background-elevated w-20 h-20 flex items-center justify-center text-primary font-bold">
                  {subscription.name.charAt(0)}
                </div>
              )}
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
            {subscription.price && subscription.price > 0 && (
              <div className="neumo-card p-4 rounded-xl bg-background-elevated">
                <p className="text-sm text-foreground-muted mb-1">Harga/Periode</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(subscription.price, subscription.currency)}
                </p>
                {subscription.currency !== 'IDR' && (
                  <p className="text-xs text-foreground-muted mt-1">
                    ≈ {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(subscription.price * 15800)}
                  </p>
                )}
              </div>
            )}

            <div className="neumo-card p-4 rounded-xl bg-background-elevated">
              <p className="text-sm text-foreground-muted mb-1">
                {subscription.is_trial && subscription.trial_end_date ? "Jatuh Tempo Trial" : "Jatuh Tempo Berikutnya"}
              </p>
              <p className="text-xl font-semibold text-foreground">
                {subscription.is_trial && subscription.trial_end_date 
                  ? format(new Date(subscription.trial_end_date), "d MMMM yyyy", { locale: localeId })
                  : format(new Date(subscription.next_billing_date), "d MMMM yyyy", { locale: localeId })
                }
              </p>
            </div>

            {subscription.is_trial && subscription.trial_fee && subscription.trial_fee > 0 && (
              <div className="neumo-card p-4 rounded-xl bg-background-elevated">
                <p className="text-sm text-foreground-muted mb-1">Biaya Trial</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(subscription.trial_fee, subscription.currency)}
                </p>
              </div>
            )}

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

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={handleMarkPaid}
              disabled={markAsPaid.isPending || subscription.status === 'cancelled'}
              className="h-12 bg-success text-success-foreground hover:bg-success/90"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {markAsPaid.isPending ? "Proses..." : "Tandai Bayar"}
            </Button>

            <Button
              onClick={handlePauseResume}
              disabled={updateStatus.isPending || subscription.status === 'cancelled'}
              variant="outline"
              className="h-12"
            >
              {subscription.status === 'paused' ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Lanjutkan
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Jeda
                </>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 text-destructive hover:text-destructive"
                  disabled={subscription.status === 'cancelled'}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Batalkan
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="neumo-card border-0">
                <AlertDialogHeader>
                  <AlertDialogTitle>Batalkan Langganan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ini akan mengubah status menjadi dibatalkan. Anda masih bisa mengaktifkannya kembali nanti.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Ya, Batalkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Payment History */}
        <div className="neumo-card p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Riwayat Pembayaran</h2>
            {paymentHistory && paymentHistory.length > 0 && (
              <Badge variant="outline" className="text-sm">
                {paymentHistory.length} pembayaran
              </Badge>
            )}
          </div>
          
          {paymentHistory && paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {paymentHistory.map((payment, index) => (
                <div
                  key={payment.id}
                  className="neumo-card neumo-card-hover p-4 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="neumo-card p-2 rounded-lg bg-success/10">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Pembayaran #{paymentHistory.length - index}
                        </p>
                        <p className="text-sm text-foreground-muted">
                          {format(new Date(payment.payment_date), "EEEE, d MMMM yyyy", { locale: localeId })}
                        </p>
                        {payment.created_at && (
                          <p className="text-xs text-foreground-muted mt-1">
                            Dicatat: {format(new Date(payment.created_at), "HH:mm", { locale: localeId })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground text-lg">
                        {formatCurrency(payment.amount, subscription.currency)}
                      </p>
                      <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30 mt-1">
                        Lunas
                      </Badge>
                    </div>
                  </div>
                  {payment.notes && (
                    <div className="ml-11 text-sm text-foreground-muted bg-background-elevated p-2 rounded mt-2">
                      {payment.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="neumo-card p-4 rounded-full w-16 h-16 mx-auto mb-4 bg-background-elevated flex items-center justify-center">
                <Calendar className="h-8 w-8 text-foreground-muted" />
              </div>
              <p className="text-foreground-muted mb-2">Belum ada riwayat pembayaran</p>
              <p className="text-sm text-foreground-muted">
                Klik "Tandai Bayar" untuk mencatat pembayaran pertama
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetail;
