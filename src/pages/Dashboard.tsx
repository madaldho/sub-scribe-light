import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingSubscriptions } from "@/components/dashboard/UpcomingSubscriptions";
import { CreditCard, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: subscriptions = [], isLoading } = useSubscriptions();

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
    const amount = Number(sub.price);
    return sum + (sub.billing_cycle === 'monthly' ? amount : 
                  sub.billing_cycle === 'yearly' ? amount / 12 : 
                  sub.billing_cycle === 'weekly' ? amount * 4 : amount);
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="neumo-card p-8 rounded-3xl">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-foreground-muted">
          Kelola langganan Anda
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Langganan"
          value={activeSubscriptions.length.toString()}
          subtitle="Langganan aktif"
          icon={CreditCard}
        />
        <StatsCard
          title="Pengeluaran Bulanan"
          value={formatCurrency(totalMonthly)}
          subtitle="Estimasi per bulan"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Semua"
          value={subscriptions.length.toString()}
          subtitle="Termasuk tidak aktif"
          icon={Calendar}
        />
        <StatsCard
          title="Kategori"
          value={new Set(subscriptions.map(s => s.category)).size.toString()}
          subtitle="Kategori berbeda"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryChart subscriptions={subscriptions} />
        <UpcomingSubscriptions subscriptions={subscriptions} />
      </div>
    </div>
  );
}
