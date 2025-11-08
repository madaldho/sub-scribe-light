import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingSubscriptions } from "@/components/dashboard/UpcomingSubscriptions";
import { CreditCard, TrendingUp, Calendar, DollarSign, Plus, ArrowUpRight } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useTotalExpenses } from "@/hooks/useTotalExpenses";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: subscriptions = [], isLoading } = useSubscriptions();
  const { data: totalExpenses = 0, isLoading: isLoadingExpenses } = useTotalExpenses();

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active' || s.status === 'trial');
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Ringkasan langganan dan pengeluaran Anda
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate("/subscriptions")}
              variant="outline"
            >
              <span className="hidden sm:inline">Lihat Semua</span>
              <ArrowUpRight className="h-4 w-4 sm:ml-2" />
            </Button>
            
            <Button 
              onClick={() => navigate("/add")}
            >
              <Plus className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Tambah</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Langganan"
          value={activeSubscriptions.length.toString()}
          subtitle="Aktif & Trial"
          icon={CreditCard}
        />
        <StatsCard
          title="Total Pengeluaran"
          value={formatCurrency(totalExpenses)}
          subtitle="Total yang sudah dibayar"
          icon={DollarSign}
        />
        <StatsCard
          title="Estimasi Bulanan"
          value={formatCurrency(totalMonthly)}
          subtitle="Berdasarkan langganan aktif"
          icon={Calendar}
        />
        <StatsCard
          title="Kategori"
          value={new Set(subscriptions.map(s => s.category)).size.toString()}
          subtitle="Kategori berbeda"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart subscriptions={subscriptions} />
        <UpcomingSubscriptions subscriptions={subscriptions} />
      </div>
    </div>
  );
}
