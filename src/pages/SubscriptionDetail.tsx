import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, CheckCircle, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const mockSubscription = {
  id: "1",
  name: "Netflix",
  package: "Premium",
  billing: "Bulanan",
  amount: "Rp 65.000",
  startDate: "25 Jan 2025",
  dueDate: "25 Okt 2025",
  nextDueDate: "25 Nov 2025",
  category: "Entertainment",
  status: "Aktif" as const,
  paymentMethod: "E-Wallet",
  reminder: "3 hari sebelum",
  notes: "Akun keluarga dibagikan dengan 4 anggota",
  logo: "🎬",
  history: [
    { date: "25 Sep 2025", amount: "Rp 65.000", status: "Lunas" },
    { date: "25 Agu 2025", amount: "Rp 65.000", status: "Lunas" },
    { date: "25 Jul 2025", amount: "Rp 65.000", status: "Lunas" }
  ]
};

const SubscriptionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleMarkPaid = () => {
    toast.success("Pembayaran berhasil ditandai!");
  };

  const handleDelete = () => {
    toast.success("Langganan berhasil dihapus");
    navigate("/subscriptions");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="neumo-card neumo-card-hover rounded-xl mb-4 border-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </header>

        {/* Main Info Card */}
        <div className="neumo-card p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="neumo-card p-5 rounded-2xl text-4xl bg-background-elevated">
                {mockSubscription.logo}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {mockSubscription.name}
                </h1>
                <p className="text-foreground-muted">
                  {mockSubscription.package} • {mockSubscription.billing}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="neumo-card neumo-card-hover rounded-xl border-0"
                onClick={() => navigate(`/edit/${id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="neumo-card neumo-card-hover rounded-xl border-0 text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {mockSubscription.category}
            </Badge>
            <Badge variant="outline" className="text-success bg-success/10 border-success/30">
              {mockSubscription.status}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="neumo-card p-4 rounded-xl bg-background-elevated">
              <p className="text-sm text-foreground-muted mb-1">Harga/Periode</p>
              <p className="text-2xl font-bold text-foreground">{mockSubscription.amount}</p>
            </div>

            <div className="neumo-card p-4 rounded-xl bg-background-elevated">
              <p className="text-sm text-foreground-muted mb-1">Jatuh Tempo Berikutnya</p>
              <p className="text-xl font-semibold text-foreground">{mockSubscription.nextDueDate}</p>
            </div>

            <div className="neumo-card p-4 rounded-xl bg-background-elevated">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-4 w-4 text-foreground-muted" />
                <p className="text-sm text-foreground-muted">Metode Pembayaran</p>
              </div>
              <p className="text-foreground font-medium">{mockSubscription.paymentMethod}</p>
            </div>

            <div className="neumo-card p-4 rounded-xl bg-background-elevated">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-foreground-muted" />
                <p className="text-sm text-foreground-muted">Pengingat</p>
              </div>
              <p className="text-foreground font-medium">{mockSubscription.reminder}</p>
            </div>
          </div>

          {/* Notes */}
          {mockSubscription.notes && (
            <div className="neumo-card p-4 rounded-xl bg-background-elevated mb-6">
              <p className="text-sm text-foreground-muted mb-2">Catatan</p>
              <p className="text-foreground">{mockSubscription.notes}</p>
            </div>
          )}

          {/* Mark as Paid Button */}
          <Button
            onClick={handleMarkPaid}
            className="neumo-card neumo-card-hover w-full h-14 rounded-2xl bg-success text-success-foreground hover:bg-success/90"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Tandai Sudah Bayar
          </Button>
        </div>

        {/* Payment History */}
        <div className="neumo-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Riwayat Pembayaran</h2>
          
          <div className="space-y-3">
            {mockSubscription.history.map((payment, index) => (
              <div
                key={index}
                className="neumo-card neumo-card-hover p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="neumo-card p-2 rounded-lg bg-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{payment.date}</p>
                    <p className="text-sm text-foreground-muted">{payment.status}</p>
                  </div>
                </div>
                <p className="font-bold text-foreground">{payment.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetail;
