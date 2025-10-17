import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const Subscriptions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: subscriptions, isLoading } = useSubscriptions();

  const filteredSubs = subscriptions?.filter(sub =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

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

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Langganan
            </h1>
            <p className="text-muted-foreground">
              {filteredSubs.length} langganan ditemukan
            </p>
          </div>
          
          <Button 
            onClick={() => navigate("/add")}
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari langganan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 border-border focus-visible:ring-primary"
            />
          </div>
          
          <Button
            variant="secondary"
            size="lg"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Subscriptions List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <Skeleton className="h-12 w-12 rounded-lg mb-3" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      ) : filteredSubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSubs.map((sub) => (
            <SubscriptionCard 
              key={sub.id} 
              subscription={sub} 
            />
          ))}
        </div>
      ) : (
        <div className="neumo-card p-12 text-center">
          <div className="neumo-card p-6 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center text-4xl">
            📭
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Tidak ada langganan
          </h3>
          <p className="text-foreground-muted mb-6">
            {search ? "Coba ubah kata kunci pencarian Anda" : "Mulai tambahkan langganan pertama Anda"}
          </p>
          {!search && (
            <Button
              onClick={() => navigate("/add")}
            >
              <Plus className="mr-2 h-5 w-5" />
              Tambah Langganan
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
