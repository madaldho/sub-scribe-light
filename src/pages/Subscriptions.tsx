import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";

const mockSubscriptions = [
  {
    id: "1",
    name: "Netflix",
    package: "Premium",
    billing: "Bulanan",
    amount: "Rp 65.000",
    dueDate: "25 Okt 2025",
    category: "Entertainment",
    status: "Aktif" as const,
    logo: "🎬"
  },
  {
    id: "2",
    name: "Spotify",
    package: "Family",
    billing: "Bulanan",
    amount: "Rp 85.000",
    dueDate: "27 Okt 2025",
    category: "Music",
    status: "Aktif" as const,
    logo: "🎵"
  },
  {
    id: "3",
    name: "Domain .com",
    package: "Pro",
    billing: "Tahunan",
    amount: "Rp 350.000",
    dueDate: "10 Des 2025",
    category: "Development",
    status: "Aktif" as const,
    logo: "🌐"
  },
  {
    id: "4",
    name: "Adobe Creative",
    package: "All Apps",
    billing: "Bulanan",
    amount: "Rp 350.000",
    dueDate: "15 Nov 2025",
    category: "Design",
    status: "Berhenti" as const,
    logo: "🎨"
  }
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredSubs = mockSubscriptions.filter(sub =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Langganan
            </h1>
            <p className="text-foreground-muted">
              {filteredSubs.length} langganan ditemukan
            </p>
          </div>
          
          <Button 
            onClick={() => navigate("/add")}
            className="neumo-card neumo-card-hover rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
            <Input
              placeholder="Cari langganan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="neumo-input pl-12 h-14 text-base border-0 focus-visible:ring-primary"
            />
          </div>
          
          <Button
            variant="outline"
            size="lg"
            className="neumo-card neumo-card-hover rounded-2xl border-0"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Subscriptions List */}
      {filteredSubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredSubs.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
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
            Coba ubah kata kunci pencarian Anda
          </p>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
