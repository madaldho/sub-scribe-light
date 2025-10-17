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
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            trend === "up" 
              ? "text-success-foreground bg-success/20" 
              : "text-destructive-foreground bg-destructive/20"
          }`}>
            {change}
          </span>
        )}
      </div>
      
      <h3 className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};
