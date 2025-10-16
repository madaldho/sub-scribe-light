import { PieChart } from "lucide-react";
import { Subscription } from "@/hooks/useSubscriptions";

interface CategoryChartProps {
  subscriptions: Subscription[];
}

export const CategoryChart = ({ subscriptions }: CategoryChartProps) => {
  // Calculate category totals
  const categoryTotals = subscriptions.reduce((acc, sub) => {
    if (sub.status === 'active') {
      const amount = Number(sub.price);
      acc[sub.category] = (acc[sub.category] || 0) + amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, amt) => sum + amt, 0);

  const categories = Object.entries(categoryTotals)
    .map(([name, amount], index) => ({
      name,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: ['bg-primary', 'bg-accent', 'bg-success', 'bg-warning'][index % 4]
    }))
    .sort((a, b) => b.amount - a.amount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (categories.length === 0) {
    return (
      <div className="neumo-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Kategori Terbesar</h2>
          <PieChart className="h-5 w-5 text-primary" />
        </div>
        <p className="text-foreground-muted text-center py-8">Belum ada data kategori</p>
      </div>
    );
  }

  return (
    <div className="neumo-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Kategori Terbesar</h2>
        <PieChart className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-4">
        {categories.map((cat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">{cat.name}</span>
              <span className="text-foreground-muted">{formatCurrency(cat.amount)}</span>
            </div>
            
            <div className="relative h-3 neumo-card rounded-full overflow-hidden bg-background-elevated">
              <div 
                className={`absolute inset-y-0 left-0 rounded-full ${cat.color} transition-all duration-500`}
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
            
            <p className="text-xs text-foreground-muted">{cat.percentage}% dari total</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-foreground-muted">Total Pengeluaran</span>
          <span className="text-2xl font-bold text-foreground">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};
