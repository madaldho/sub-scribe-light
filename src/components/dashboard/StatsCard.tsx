import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  subtitle, 
  icon: Icon,
  trend 
}: StatsCardProps) => {
  return (
    <div className="neumo-card p-6 transition-all duration-300 hover:shadow-neumo-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {change && (
          <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
            trend === "up" 
              ? "text-success-foreground bg-success/20" 
              : "text-destructive-foreground bg-destructive/20"
          }`}>
            {change}
          </span>
        )}
      </div>
      
      <h3 className="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
};
