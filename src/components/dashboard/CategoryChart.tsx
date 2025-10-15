import { PieChart } from "lucide-react";

const categories = [
  { name: "Entertainment", amount: "Rp 250.000", percentage: 30, color: "bg-primary" },
  { name: "Development", amount: "Rp 350.000", percentage: 40, color: "bg-accent" },
  { name: "Music", amount: "Rp 150.000", percentage: 18, color: "bg-success" },
  { name: "Lainnya", amount: "Rp 100.000", percentage: 12, color: "bg-destructive" },
];

export const CategoryChart = () => {
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
              <span className="text-foreground-muted">{cat.amount}</span>
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
          <span className="text-2xl font-bold text-foreground">Rp 850.000</span>
        </div>
      </div>
    </div>
  );
};
