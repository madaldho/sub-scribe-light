import { useNavigate } from "react-router-dom";
import { Plus, Search, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingSubscriptions } from "@/components/dashboard/UpcomingSubscriptions";
import { CategoryChart } from "@/components/dashboard/CategoryChart";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-foreground-muted">Kelola semua langganan Anda</p>
          </div>
          
          <Button 
            onClick={() => navigate("/add")}
            className="neumo-card neumo-card-hover rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Tambah
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
          <Input
            placeholder="Cari langganan..."
            className="neumo-input pl-12 h-14 text-base border-0 focus-visible:ring-primary"
          />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatsCard
          title="Total Bulanan"
          value="Rp 850.000"
          change="+12%"
          icon={DollarSign}
          trend="up"
        />
        <StatsCard
          title="Langganan Aktif"
          value="8"
          subtitle="2 akan jatuh tempo"
          icon={TrendingUp}
        />
        <StatsCard
          title="Minggu Ini"
          value="Rp 245.000"
          subtitle="3 pembayaran"
          icon={Calendar}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <UpcomingSubscriptions />
        <CategoryChart />
      </div>
    </div>
  );
};

export default Dashboard;
