import { useNavigate } from "react-router-dom";
import { Plus, Search, TrendingUp, Calendar, DollarSign, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuth } from "@/hooks/useAuth";
import { useState, useMemo } from "react";
import { format, isWithinInterval, addDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { data: subscriptions, isLoading } = useSubscriptions();
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    if (!subscriptions) return {
      totalMonthly: 0,
      activeCount: 0,
      weeklyAmount: 0,
      weeklyCount: 0,
      upcomingThisWeek: []
    };

    // Calculate monthly total (convert all to monthly equivalent)
    const totalMonthly = subscriptions.reduce((sum, sub) => {
      if (sub.status !== 'active') return sum;
      
      let monthlyEquivalent = sub.price;
      switch (sub.billing_cycle) {
        case 'daily':
          monthlyEquivalent = sub.price * 30;
          break;
        case 'weekly':
          monthlyEquivalent = sub.price * 4;
          break;
        case 'yearly':
          monthlyEquivalent = sub.price / 12;
          break;
      }
      return sum + monthlyEquivalent;
    }, 0);

    // Active subscriptions count
    const activeCount = subscriptions.filter(sub => sub.status === 'active').length;

    // Upcoming this week
    const today = new Date();
    const weekEnd = addDays(today, 7);
    const upcomingThisWeek = subscriptions.filter(sub => {
      const dueDate = new Date(sub.next_billing_date);
      return isWithinInterval(dueDate, { start: today, end: weekEnd });
    });

    const weeklyAmount = upcomingThisWeek.reduce((sum, sub) => sum + sub.price, 0);

    return {
      totalMonthly,
      activeCount,
      weeklyAmount,
      weeklyCount: upcomingThisWeek.length,
      upcomingThisWeek
    };
  }, [subscriptions]);

  const formatCurrency = (amount: number) => {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
  };

  const filteredUpcoming = stats.upcomingThisWeek.filter(sub =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-foreground-muted">
              Halo, {user?.email?.split('@')[0]} 👋
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/settings")}
              className="neumo-card neumo-card-hover rounded-xl border-0"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => signOut()}
              className="neumo-card neumo-card-hover rounded-xl border-0"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate("/add")}
              className="neumo-card neumo-card-hover rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Tambah</span>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
          <Input
            placeholder="Cari langganan upcoming..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neumo-input pl-12 h-14 text-base border-0 focus-visible:ring-primary"
          />
        </div>
      </header>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="neumo-card p-6">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <StatsCard
            title="Total Bulanan"
            value={formatCurrency(stats.totalMonthly)}
            icon={DollarSign}
          />
          <StatsCard
            title="Langganan Aktif"
            value={stats.activeCount.toString()}
            subtitle={`${stats.weeklyCount} akan jatuh tempo`}
            icon={TrendingUp}
          />
          <StatsCard
            title="7 Hari Kedepan"
            value={formatCurrency(stats.weeklyAmount)}
            subtitle={`${stats.weeklyCount} pembayaran`}
            icon={Calendar}
          />
        </div>
      )}

      {/* Upcoming Subscriptions */}
      <div className="neumo-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Jatuh Tempo Minggu Ini</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/subscriptions")}
            className="text-primary hover:text-primary/80"
          >
            Lihat Semua
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="neumo-card p-4 rounded-xl">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : filteredUpcoming.length > 0 ? (
          <div className="space-y-3">
            {filteredUpcoming.map((sub) => (
              <div
                key={sub.id}
                onClick={() => navigate(`/subscription/${sub.id}`)}
                className="neumo-card neumo-card-hover p-4 rounded-xl flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="neumo-card p-3 rounded-xl text-2xl bg-background-elevated">
                    🎯
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{sub.name}</p>
                    <p className="text-sm text-foreground-muted">
                      {format(new Date(sub.next_billing_date), "d MMM yyyy", { locale: localeId })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">
                    {formatCurrency(sub.price)}
                  </p>
                  <p className="text-xs text-foreground-muted">{sub.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="neumo-card p-6 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center text-4xl">
              🎉
            </div>
            <p className="text-foreground-muted">
              {search ? "Tidak ada hasil" : "Tidak ada pembayaran minggu ini"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
